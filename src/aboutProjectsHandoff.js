/**
 * Shared handoff: About Stagger Dissolve exit → Projects blur reveal.
 * Projects must not start until About avatar + bio exit has completed.
 */
let aboutGlassComplete = false;
const LISTENERS = new Set();

export function isAboutGlassComplete() {
  return aboutGlassComplete;
}

export function markAboutGlassComplete() {
  if (aboutGlassComplete) return;
  aboutGlassComplete = true;
  LISTENERS.forEach((fn) => {
    try {
      fn();
    } catch (_) {
      /* ignore */
    }
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("about-glass-complete"));
  }
}

/** Allow a fresh About mount (route remount / HMR) to gate Projects again. */
export function resetAboutGlassComplete() {
  aboutGlassComplete = false;
}

/** Reverse-scroll back into the cinematic chapter — hide Projects until release again. */
export function unmarkAboutGlassComplete() {
  if (!aboutGlassComplete) return;
  aboutGlassComplete = false;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("about-glass-reset"));
  }
}

export function onAboutGlassComplete(fn) {
  if (typeof fn !== "function") return () => {};
  if (aboutGlassComplete) {
    fn();
    return () => {};
  }
  LISTENERS.add(fn);
  return () => LISTENERS.delete(fn);
}
