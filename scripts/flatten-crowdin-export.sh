#!/usr/bin/env bash
# Crowdin exports translations as locales/<code>/en.json; next-intl wants locales/<code>.json.
# Also remaps Crowdin's regional codes to the ones next.config.js lists, and restores
# locales/en.json, which the export omits because English is the source language.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

DRY=0
[[ "${1:-}" == "-n" || "${1:-}" == "--dry-run" ]] && DRY=1

# the filenames the repo actually tracks are the source of truth for valid targets
mapfile -t tracked < <(git ls-files 'locales/*.json' | xargs -n1 basename | sed 's/\.json$//')
is_tracked() { local n=$1; for t in "${tracked[@]}"; do [[ "$t" == "$n" ]] && return 0; done; return 1; }

run() { if ((DRY)); then echo "  would: $*"; else "$@"; fi; }

moved=0 warned=0
for dir in locales/*/; do
  [[ -d "$dir" ]] || continue
  code=$(basename "$dir")
  dir=${dir%/}
  src="$dir/en.json"

  if [[ ! -f "$src" ]]; then
    echo "  skip $code: no en.json inside" >&2; warned=$((warned+1)); continue
  fi

  # es-ES -> es, pt-PT -> pt, sv-SE -> sv; zh-CN/zh-TW stay as-is because both are tracked
  target=$code
  if ! is_tracked "$target"; then
    stripped=${code%%-*}
    if is_tracked "$stripped"; then
      target=$stripped
    else
      echo "  warn $code: no tracked locales/$code.json or locales/$stripped.json — writing $code.json" >&2
      warned=$((warned+1))
    fi
  fi

  if ! node -e 'JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"))' "$src" 2>/dev/null; then
    echo "  FAIL $code: $src is not valid JSON, leaving it alone" >&2; warned=$((warned+1)); continue
  fi

  echo "$code/en.json -> $target.json"
  run mv -f "$src" "locales/$target.json"
  run rmdir "$dir"
  moved=$((moved+1))
done

# English is never in the export; put the tracked copy back if the download removed it
if [[ ! -f locales/en.json ]]; then
  echo "locales/en.json missing (not in export) -> restoring from git"
  run git checkout -- locales/en.json
fi

echo
echo "flattened $moved, warnings $warned"
((DRY)) && echo "(dry run — nothing changed)"
exit 0
