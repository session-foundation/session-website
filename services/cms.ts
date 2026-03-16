import type { Block, Document, Inline } from '@contentful/rich-text-types';
import { type ContentfulClientApi, createClient, type EntryCollection, type Tag } from 'contentful';
import { format, parseISO } from 'date-fns';
import { unstable_cache } from 'next/cache';
import { METADATA } from '@/constants';
import CMS, { IS_STATIC_MODE } from '@/constants/cms';
import { fetchContent } from '@/services/embed';
import type {
  IAuthor,
  IFAQItem,
  IFetchBlogEntriesReturn,
  IFetchEntriesReturn,
  IFetchFAQItemsReturn,
  IFetchPagesReturn,
  IFigureImage,
  IPage,
  IPost,
  ITagList,
} from '@/types/cms';

// Contentful API pagination limit
const CONTENTFUL_PAGE_SIZE = 100;

const client: ContentfulClientApi = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  environment: process.env.CONTENTFUL_ENVIRONMENT_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  host: 'cdn.contentful.com',
});

const previewClient: ContentfulClientApi = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  environment: process.env.CONTENTFUL_ENVIRONMENT_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
  host: 'preview.contentful.com',
});

/**
 * Cache tags used for on-demand revalidation via revalidateTag() in the webhook handler.
 * Exported so the webhook handler can reference them without magic strings.
 */
export const CACHE_TAGS = {
  TAGS: 'contentful-tags',
  POSTS: 'contentful-posts',
  PAGES: 'contentful-pages',
  FAQ: 'contentful-faq',
} as const;

const cacheOptions = { revalidate: IS_STATIC_MODE ? false : CMS.CONTENT_REVALIDATE_RATE } as const;

// ---------------------------------------------------------------------------
// Internal cached implementations
// Exported functions below normalise default parameters then delegate here
// so that cache keys are always consistent regardless of how callers pass args.
// ---------------------------------------------------------------------------

const _fetchTagList = unstable_cache(
  async (): Promise<ITagList> => {
    const _tags = await client.getTags();
    const tags: ITagList = {};
    _tags.items.forEach((tag) => {
      tags[tag.sys.id] = tag.name;
    });
    return tags;
  },
  ['contentful-tag-list'],
  { ...cacheOptions, tags: [CACHE_TAGS.TAGS] }
);

const _fetchBlogEntries = unstable_cache(
  async (quantity: number, page: number): Promise<IFetchBlogEntriesReturn> => {
    const _entries = await client.getEntries({
      content_type: 'post',
      order: '-fields.date',
      limit: quantity,
      skip: (page - 1) * quantity,
    });
    const results = await generateEntries(_entries, 'post');
    return {
      entries: results.entries as Array<IPost>,
      total: results.total,
    };
  },
  ['contentful-blog-entries'],
  { ...cacheOptions, tags: [CACHE_TAGS.POSTS] }
);

const _fetchAllBlogEntries = unstable_cache(
  async (): Promise<IPost[]> => {
    const posts: IPost[] = [];

    const firstBatch = await fetchBlogEntries(CONTENTFUL_PAGE_SIZE, 1);
    posts.push(...firstBatch.entries);

    const totalPages = Math.ceil(firstBatch.total / CONTENTFUL_PAGE_SIZE);
    if (totalPages > 1) {
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      const batches = await Promise.all(
        remainingPages.map((page) => fetchBlogEntries(CONTENTFUL_PAGE_SIZE, page))
      );
      for (const { entries } of batches) {
        posts.push(...entries);
      }
    }

    return posts;
  },
  ['contentful-all-blog-entries'],
  { ...cacheOptions, tags: [CACHE_TAGS.POSTS] }
);

const _fetchBlogEntriesByTag = unstable_cache(
  async (tag: string, quantity: number): Promise<IFetchBlogEntriesReturn> => {
    const taglist = await fetchTagList();
    const entry = Object.entries(taglist).find(([, value]) => value === tag);
    if (!entry) {
      throw new Error(`Tag not found: ${tag}`);
    }
    const [id] = entry;

    const _entries = await client.getEntries({
      content_type: 'post',
      order: '-fields.date',
      'metadata.tags.sys.id[in]': id,
      limit: quantity,
    });

    if (_entries.items.length === 0) {
      throw new Error(`Failed to fetch entries for ${tag}`);
    }

    const results = await generateEntries(_entries, 'post', taglist);
    return {
      entries: results.entries as Array<IPost>,
      total: results.total,
    };
  },
  ['contentful-blog-entries-by-tag'],
  { ...cacheOptions, tags: [CACHE_TAGS.POSTS] }
);

const _fetchEntryBySlug = unstable_cache(
  async (slug: string): Promise<IPage | IPost> => {
    const [_pages, _posts] = await Promise.all([
      client.getEntries({ content_type: 'page', 'fields.slug': slug }),
      client.getEntries({ content_type: 'post', 'fields.slug': slug }),
    ]);

    const _entries = [..._pages.items, ..._posts.items];
    const hasPost = _entries.some((e) => e.sys.contentType.sys.id === 'post');
    const taglist = hasPost ? await fetchTagList() : {};

    if (_entries.length > 0) {
      const entry = _entries[0];
      if (entry.sys.contentType.sys.id === 'post') {
        return convertPost(entry, taglist);
      }
      if (entry.sys.contentType.sys.id === 'page') {
        return convertPage(entry);
      }
    }

    throw new Error(`Failed to fetch entry for ${slug}`);
  },
  ['contentful-entry-by-slug'],
  { ...cacheOptions, tags: [CACHE_TAGS.POSTS, CACHE_TAGS.PAGES] }
);

const _fetchFAQItems = unstable_cache(
  async (): Promise<IFetchFAQItemsReturn> => {
    const _entries = await client.getEntries({
      content_type: 'faq_item',
      order: 'fields.id',
    });
    const results = await generateEntries(_entries, 'faq');
    return { entries: results.entries as Array<IFAQItem>, total: results.total };
  },
  ['contentful-faq-items'],
  { ...cacheOptions, tags: [CACHE_TAGS.FAQ] }
);

const _fetchPages = unstable_cache(
  async (quantity: number): Promise<IFetchPagesReturn> => {
    const _entries = await client.getEntries({
      content_type: 'page',
      limit: quantity,
    });
    const results = await generateEntries(_entries, 'page');
    return {
      entries: results.entries as Array<IPage>,
      total: results.total,
    };
  },
  ['contentful-pages'],
  { ...cacheOptions, tags: [CACHE_TAGS.PAGES] }
);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchTagList(): Promise<ITagList> {
  return _fetchTagList();
}

export async function fetchBlogEntries(
  quantity = CONTENTFUL_PAGE_SIZE,
  page = 1
): Promise<IFetchBlogEntriesReturn> {
  return _fetchBlogEntries(quantity, page);
}

export async function fetchAllBlogEntries(): Promise<IPost[]> {
  return _fetchAllBlogEntries();
}

export async function fetchBlogEntriesByTag(
  tag: string,
  quantity = CONTENTFUL_PAGE_SIZE
): Promise<IFetchBlogEntriesReturn> {
  return _fetchBlogEntriesByTag(tag, quantity);
}

export async function fetchEntryBySlug(slug: string): Promise<IPage | IPost> {
  return _fetchEntryBySlug(slug);
}

export async function fetchFAQItems(): Promise<IFetchFAQItemsReturn> {
  return _fetchFAQItems();
}

export async function fetchPages(quantity = CONTENTFUL_PAGE_SIZE): Promise<IFetchPagesReturn> {
  return _fetchPages(quantity);
}

// Preview is intentionally not cached — it always fetches live draft content.
export async function fetchEntryPreview(slug: string): Promise<IPage | IPost> {
  const [_pages, _posts] = await Promise.all([
    previewClient.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      'fields.preview': true,
    }),
    previewClient.getEntries({
      content_type: 'post',
      'fields.slug': slug,
      'fields.preview': true,
    }),
  ]);

  const _entries = [..._pages.items, ..._posts.items];
  const hasPost = _entries.some((e) => e.sys.contentType.sys.id === 'post');
  const taglist = hasPost ? await fetchTagList() : {};

  if (_entries.length > 0) {
    const entry = _entries[0];
    if (entry.sys.contentType.sys.id === 'post') {
      return convertPost(entry, taglist);
    }
    if (entry.sys.contentType.sys.id === 'page') {
      return convertPage(entry);
    }
  }

  return Promise.reject(new Error(`Failed to fetch preview for ${slug}`));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function convertPost(rawData: any, taglist: ITagList): IPost {
  const rawPost = rawData.fields;
  const rawFeatureImage = rawPost?.featureImage ? rawPost?.featureImage.fields : null;
  const rawAuthor = rawPost.author ? rawPost.author.fields : null;

  return {
    id: rawData.sys.id ?? null,
    body: rawPost.body ?? null,
    subtitle: rawPost.subtitle ?? null,
    description: rawPost.description ?? null,
    publishedDateISO: rawPost.date,
    publishedDate: format(parseISO(rawPost.date), 'MMMM dd, yyyy'),
    slug: rawPost.slug,
    tags: convertTags(rawData.metadata.tags, taglist),
    title: rawPost.title,
    featureImage: convertImage(rawFeatureImage),
    fullHeader: rawPost.fullHeader ?? null,
    author: convertAuthor(rawAuthor),
  };
}

function convertImage(rawImage: any): IFigureImage {
  return {
    imageUrl: rawImage.file.url.replace('//', 'https://'),
    description: rawImage.description ?? null,
    title: rawImage.title ?? null,
    width: rawImage.file.details.image.width,
    height: rawImage.file.details.image.height,
  };
}

function convertAuthor(rawAuthor: any): IAuthor {
  return {
    name: rawAuthor?.name ?? null,
    avatar: convertImage(rawAuthor.avatar.fields),
    shortBio: rawAuthor?.shortBio ?? null,
    position: rawAuthor?.position ?? null,
    email: rawAuthor?.email ?? null,
    twitter: rawAuthor?.twitter ?? null,
    facebook: rawAuthor.facebook ?? null,
    github: rawAuthor.github ?? null,
  };
}

function convertTags(rawTags: any, taglist: ITagList): string[] {
  return rawTags.map((tag: Tag) => taglist[tag.sys.id]);
}

async function generateEntries(
  entries: EntryCollection<unknown>,
  entryType: 'post' | 'faq' | 'page',
  taglist?: ITagList
): Promise<IFetchEntriesReturn> {
  let _entries: any = [];
  if (entries?.items && entries.items.length > 0) {
    switch (entryType) {
      case 'post': {
        const tags = taglist ?? (await fetchTagList());
        _entries = entries.items.map((entry) => convertPost(entry, tags));
        break;
      }
      case 'faq':
        _entries = entries.items.map((entry) => convertFAQ(entry));
        break;
      case 'page':
        _entries = entries.items.map((entry) => convertPage(entry));
        break;
      default:
        break;
    }
    return { entries: _entries, total: entries.total };
  }

  return { entries: _entries, total: 0 };
}

export function generateRoute(slug: string): string {
  return slug.indexOf('/blog/') > 0 ? slug.split('/blog/')[0] : `/blog/${slug}`;
}

async function loadMetaData(node: Block | Inline) {
  if (!node.data.target.fields.file) {
    if (node.data.target.sys.contentType.sys.id === 'post') {
      node.data.target.fields.url = `${METADATA.HOST_URL}/blog/${node.data.target.fields.slug}`;
    }
    node.data.target.fields.meta = await fetchContent(node.data.target.fields.url);
  }
  return node;
}

export async function generateLinkMeta(doc: Document): Promise<Document> {
  const promises = doc.content.map(async (node: Block | Inline) => {
    if (node.nodeType === 'embedded-entry-block') {
      node = await loadMetaData(node);
    } else {
      const innerPromises = node.content.map(async (innerNode) => {
        if (
          innerNode.nodeType === 'embedded-entry-inline' &&
          innerNode.data.target.sys.contentType.sys.id !== 'markup'
        ) {
          innerNode = await loadMetaData(innerNode);
        }
      });
      await Promise.all(innerPromises);
    }
  });
  await Promise.all(promises);
  return doc;
}

function convertFAQ(rawData: any): IFAQItem {
  const rawFAQ = rawData.fields;
  const { question, answer, id, tag, slug } = rawFAQ;
  return {
    id: id ?? null,
    question: question ?? null,
    answer: answer ?? null,
    tag: tag ?? null,
    slug: slug ?? null,
  };
}

function convertPage(rawData: any): IPage {
  const rawPage = rawData.fields;
  return {
    title: rawPage.title,
    slug: rawPage.slug,
    headline: rawPage.headline ?? null,
    body: rawPage.body,
  };
}
