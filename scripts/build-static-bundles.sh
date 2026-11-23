#!/usr/bin/env bash
# Rebuild the committed static Before/After bundles.
# Usage: scripts/build-static-bundles.sh /path/to/before-worktree /path/to/after-worktree
set -euo pipefail
root=$(cd "$(dirname "$0")/.." && pwd)
[[ $# -eq 2 ]] || { echo "usage: $0 <before-worktree> <after-worktree>" >&2; exit 2; }
for pair in "before:$1" "after:$2"; do
  side=${pair%%:*}
  worktree=${pair#*:}
  rm -rf "$worktree/playground/.lab-pages-app"
  cp -R "$root/pages/app" "$worktree/playground/.lab-pages-app"
  (cd "$worktree/playground/.lab-pages-app" && BLOCKNOTE_WORKTREE="$worktree" pnpm exec vp build)
  rm -rf "$root/pages/$side"
  cp -R "$worktree/playground/.lab-pages-app/dist" "$root/pages/$side"
done
echo "Rebuilt pages/before and pages/after."
