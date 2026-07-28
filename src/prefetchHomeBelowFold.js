/** Shared dynamic-import promise — parse during hero, mount when ready. */
let homeBelowFoldImportPromise = null;

export function prefetchHomeBelowFold() {
  if (!homeBelowFoldImportPromise) {
    homeBelowFoldImportPromise = import("./HomeBelowFold.js");
  }
  return homeBelowFoldImportPromise;
}

export function resetHomeBelowFoldPrefetch() {
  homeBelowFoldImportPromise = null;
}
