#!/usr/bin/env bash
# Rebuild the committed static Before/After bundles, including the two
# single-file variants used by the comparator.
# Usage: scripts/build-static-bundles.sh /path/to/before-worktree /path/to/after-worktree
# The After worktree must be clean at the shared fixture commit; this script
# applies the patches from issues/2854/patch and restores the worktree.
set -euo pipefail
root=$(cd "$(dirname "$0")/.." && pwd)
[[ $# -eq 2 ]] || { echo "usage: $0 <before-worktree> <after-worktree>" >&2; exit 2; }
before=$1
after=$2
inert_patch="$root/issues/2854/patch/inert.patch"
activation_patch="$root/issues/2854/patch/activation.patch"
files=(packages/react/src/components/Popovers/GenericPopover.tsx packages/react/src/components/SideMenu/DefaultButtons/AddBlockButton.tsx)

if [[ -n "$(git -C "$after" status --porcelain -- "${files[@]}")" ]]; then
  echo "The After worktree has local changes in the #2854 files. Restore it to the fixture commit first." >&2
  exit 1
fi

build() {
  local worktree=$1 side=$2 title=$3
  rm -rf "$worktree/playground/.lab-pages-app"
  cp -R "$root/pages/app" "$worktree/playground/.lab-pages-app"
  (cd "$worktree/playground/.lab-pages-app" && BLOCKNOTE_WORKTREE="$worktree" pnpm exec vp build)
  rm -rf "$root/pages/$side"
  cp -R "$worktree/playground/.lab-pages-app/dist" "$root/pages/$side"
  node -e 'const fs=require("fs");const [f,t]=process.argv.slice(1);let s=fs.readFileSync(f,"utf8");s=s.replace(/<title>[^<]*<\/title>/,`<title>${t}</title>`);fs.writeFileSync(f,s)' "$root/pages/$side/index.html" "BlockNote #2854 — $title"
  rm -rf "$worktree/playground/.lab-pages-app"
}

build "$before" before before

git -C "$after" apply "$inert_patch"
git -C "$after" apply "$activation_patch"
build "$after" after "after (both fixes)"

git -C "$after" checkout -- "packages/react/src/components/SideMenu/DefaultButtons/AddBlockButton.tsx"
build "$after" after-inert "after (inert only)"

git -C "$after" checkout -- "packages/react/src/components/Popovers/GenericPopover.tsx"
git -C "$after" apply "$activation_patch"
build "$after" after-activation "after (activation only)"

git -C "$after" checkout -- "${files[@]}"
echo "Rebuilt pages/before, pages/after, pages/after-inert and pages/after-activation; restored the After worktree."
