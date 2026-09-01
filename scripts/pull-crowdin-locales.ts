#!/usr/bin/env node
// Overwrites locales/*.json with what Crowdin holds — English included. Source strings are edited
// on Crowdin now, so locales/en.json is the project's source file downloaded back, and every other
// file is that file's translation for one language. Talks to the REST API directly (the same
// endpoints session-shared-scripts/crowdin uses) rather than the `crowdin` CLI, because the CLI's
// download covers target languages only and cannot bring the source language back.
//
// Run through `pnpm crowdin:pull` (dry run by default; `--apply` writes the files):
//   CROWDIN_PERSONAL_TOKEN=... pnpm crowdin:pull
//   CROWDIN_PERSONAL_TOKEN=... pnpm crowdin:pull --apply
//
// Crowdin locale codes are mapped onto the filenames this repo already tracks (es-ES -> es.json),
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

interface Language {
  id: string;
  locale: string;
  name: string;
}

interface ProjectDetails {
  sourceLanguage: Language;
  targetLanguages: Language[];
  // the in-context pseudo-language (locales/ach.json) is not one of the target languages, it hangs
  // off the project itself and has to be asked for by name
  inContextPseudoLanguage?: Language | null;
}

interface ProjectFile {
  id: number;
  path: string;
}

interface Download {
  url: string;
}

const PROJECT = '810838';
const SOURCE_FILE = '/en.json';
const LOCALES = 'locales';

const API = process.env.CROWDIN_API_BASE || 'https://api.crowdin.com/api/v2';
const TOKEN = process.env.CROWDIN_PERSONAL_TOKEN || process.env.CROWDIN_API_TOKEN;
const APPLY = process.argv.includes('--apply');

const RETRIES = 4;
const RETRY_DELAY_MS = 500;

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function request(url: string, init?: RequestInit): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, init);
    // 429 carries Retry-After; 5xx is worth one more go. Anything else is the caller's problem.
    if ((res.status === 429 || res.status >= 500) && attempt < RETRIES) {
      const retryAfter = Number(res.headers.get('retry-after'));
      await sleep(retryAfter > 0 ? retryAfter * 1000 : RETRY_DELAY_MS * 2 ** attempt);
      continue;
    }
    return res;
  }
}

async function api<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const res = await request(`${API}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`${init?.method ?? 'GET'} ${endpoint} -> ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as T;
}

// the download links are pre-signed and reject the Authorization header
async function fetchJson(url: string, what: string): Promise<unknown> {
  const res = await request(url);
  if (!res.ok) {
    throw new Error(`downloading ${what} -> ${res.status}`);
  }
  const body = await res.text();
  try {
    return JSON.parse(body);
  } catch (err) {
    throw new Error(`${what} is not valid JSON: ${(err as Error).message}`);
  }
}

async function sourceFileId(): Promise<number> {
  const files = await api<{ data: { data: ProjectFile }[] }>(
    `/projects/${PROJECT}/files?limit=500`
  );
  const file = files.data.find((f) => f.data.path === SOURCE_FILE);
  if (!file) {
    throw new Error(
      `no file ${SOURCE_FILE} in project ${PROJECT}; found: ${files.data.map((f) => f.data.path).join(', ')}`
    );
  }
  return file.data.id;
}

async function downloadSource(fileId: number): Promise<unknown> {
  const link = await api<{ data: Download }>(`/projects/${PROJECT}/files/${fileId}/download`);
  return fetchJson(link.data.url, `${SOURCE_FILE} (source)`);
}

async function downloadTranslation(fileId: number, language: Language): Promise<unknown> {
  const link = await api<{ data: Download }>(
    `/projects/${PROJECT}/translations/builds/files/${fileId}`,
    {
      method: 'POST',
      body: JSON.stringify({
        targetLanguageId: language.id,
        // untranslated strings fall back to the English source, which is what the site wants:
        // a half-translated page beats a page with holes in it
        skipUntranslatedStrings: false,
        exportApprovedOnly: false,
      }),
    }
  );
  return fetchJson(link.data.url, `${SOURCE_FILE} (${language.locale})`);
}

// git's list, not the directory listing: a stray es-ES.json left by an earlier run must not make
// itself canonical and stop es-ES from folding onto the tracked es.json
function trackedLocales(root: string): Set<string> {
  const ls = spawnSync('git', ['ls-files', `${LOCALES}/*.json`], { cwd: root, encoding: 'utf8' });
  if (ls.status !== 0) {
    throw new Error(`git ls-files failed: ${ls.stderr || ls.stdout}`);
  }
  return new Set(
    ls.stdout
      .split('\n')
      .filter(Boolean)
      .map((f) => path.basename(f))
  );
}

// the filenames this repo tracks are the source of truth for what a locale is called here
function targetFile(locale: string, tracked: Set<string>): { file: string; known: boolean } {
  if (tracked.has(`${locale}.json`)) {
    return { file: `${locale}.json`, known: true };
  }
  const base = `${locale.split('-')[0]}.json`;
  if (tracked.has(base)) {
    return { file: base, known: true };
  }
  return { file: `${locale}.json`, known: false };
}

// Re-serialised rather than written verbatim, so the files keep one shape whatever Crowdin's
// export does with indentation, trailing newlines or key order. JSON.stringify hoists integer-like
// keys ("1", "2", ...) above their siblings, which reorders a file once and then never again.
function write(root: string, file: string, content: unknown): 'new' | 'updated' | 'unchanged' {
  const target = path.join(root, LOCALES, file);
  const serialised = JSON.stringify(content, null, 2);
  const existing = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
  if (existing === serialised) {
    return 'unchanged';
  }
  if (APPLY) {
    fs.writeFileSync(target, serialised);
  }
  return existing === null ? 'new' : 'updated';
}

async function main(): Promise<number> {
  if (!TOKEN) {
    console.error('set CROWDIN_PERSONAL_TOKEN');
    return 1;
  }

  const root = path.resolve(import.meta.dirname, '..');
  const tracked = trackedLocales(root);

  const project = await api<{ data: ProjectDetails }>(`/projects/${PROJECT}`);
  const { sourceLanguage, targetLanguages, inContextPseudoLanguage } = project.data;
  const fileId = await sourceFileId();
  const pseudo = inContextPseudoLanguage ? ` + in-context ${inContextPseudoLanguage.locale}` : '';
  console.log(
    `project ${PROJECT}, file ${SOURCE_FILE} (#${fileId}): source ${sourceLanguage.locale}, ${targetLanguages.length} translations${pseudo}`
  );
  if (!inContextPseudoLanguage) {
    console.log('  no in-context pseudo-language on this project, so ach.json cannot be refreshed');
  }

  // everything is downloaded and parsed before a single file is written
  const source = targetFile(sourceLanguage.locale, tracked);
  const downloads: { file: string; content: unknown; locale: string; known: boolean }[] = [
    {
      file: source.file,
      content: await downloadSource(fileId),
      locale: sourceLanguage.locale,
      known: source.known,
    },
  ];
  const translated = [
    ...targetLanguages,
    ...(inContextPseudoLanguage ? [inContextPseudoLanguage] : []),
  ];
  for (const language of translated.sort((a, b) => a.locale.localeCompare(b.locale))) {
    const { file, known } = targetFile(language.locale, tracked);
    downloads.push({
      file,
      content: await downloadTranslation(fileId, language),
      locale: language.locale,
      known,
    });
  }

  const counts = { new: 0, updated: 0, unchanged: 0 };
  for (const d of downloads) {
    const outcome = write(root, d.file, d.content);
    counts[outcome]++;
    const note = d.known ? '' : ' (no such locale file — add it to next.config.js)';
    console.log(`  ${d.locale} -> ${LOCALES}/${d.file}: ${outcome}${note}`);
  }

  const untouched = [...tracked].filter((f) => !downloads.some((d) => d.file === f));
  if (untouched.length) {
    console.log(`\nnot in Crowdin, left alone: ${untouched.join(', ')}`);
  }
  console.log(
    `\n${downloads.length} files | ${counts.updated} updated | ${counts.new} new | ${counts.unchanged} unchanged`
  );
  if (!APPLY) {
    console.log('DRY RUN — nothing written. Rerun with --apply.');
  }

  return 0;
}

main().then(
  (code) => process.exit(code),
  (err: unknown) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
);
