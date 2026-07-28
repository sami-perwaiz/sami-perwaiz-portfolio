import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { refreshScrollHoverSync } from "./scrollHoverSync.js";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let onTick = null;
let onScrollUpdate = null;
let onFormFieldWheel = null;

function hasOverflowY(el) {
  if (!(el instanceof HTMLElement)) return false;
  return el.scrollHeight - el.clientHeight > 1;
}

/**
 * Wheel belongs to the element under the cursor:
 * - text inputs → never capture (page scrolls via Lenis)
 * - overflowing textarea → keep wheel while hovered (even at edges)
 * - open dropdowns → their own listeners / data-lenis-prevent
 */
function attachFormFieldWheelPassthrough() {
  if (onFormFieldWheel) return;

  onFormFieldWheel = (event) => {
    const t = event.target;
    if (!(t instanceof Element)) return;

    // Open dropdown panels keep their own wheel handling.
    if (t.closest("[data-lenis-prevent], .phone-country__popover")) {
      return;
    }

    const textarea = t.closest("textarea");
    if (textarea instanceof HTMLTextAreaElement && hasOverflowY(textarea)) {
      // Keep Lenis from scrolling the page while the cursor is over this textarea.
      // overscroll-behavior: contain blocks native page chaining at the edges.
      event.stopPropagation();
      return;
    }

    // Inputs / non-overflowing textareas / selects: do not intercept.
  };

  // Bubble phase before window Lenis; passive — no preventDefault.
  document.addEventListener("wheel", onFormFieldWheel, {
    capture: false,
    passive: true,
  });
}

function detachFormFieldWheelPassthrough() {
  if (!onFormFieldWheel) return;
  document.removeEventListener("wheel", onFormFieldWheel, { capture: false });
  onFormFieldWheel = null;
}

/**
 * Premium Apple-style smooth scroll, locked to GSAP's ticker so
 * scrubbed ScrollTriggers stay jitter-free and frame-synced.
 *
 * Feel: calm (∼18% softer wheel), light lerp inertia, responsive — not syrupy.
 */
export function initSmoothScroll() {
  if (typeof window === "undefined") return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }
  if (lenis) return lenis;

  lenis = new Lenis({
    // Drive RAF from gsap.ticker so Lenis + ScrollTrigger share one clock.
    autoRaf: false,
    // Lerp (not long duration) = Apple-like inertia without input lag.
    lerp: 0.1,
    smoothWheel: true,
    // ∼18% calmer than Lenis default (1) — premium pace without feeling stuck.
    wheelMultiplier: 0.82,
    touchMultiplier: 0.88,
    // Native touch inertia stays snappy; wheel/trackpad get Lenis smoothing.
    syncTouch: false,
  });

  onScrollUpdate = () => ScrollTrigger.update();
  lenis.on("scroll", onScrollUpdate);

  onTick = (time) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  attachFormFieldWheelPassthrough();
  refreshScrollHoverSync();

  requestAnimationFrame(() => ScrollTrigger.refresh());

  return lenis;
}

export function destroySmoothScroll() {
  if (!lenis) return;

  if (onScrollUpdate) {
    lenis.off("scroll", onScrollUpdate);
    onScrollUpdate = null;
  }
  if (onTick) {
    gsap.ticker.remove(onTick);
    onTick = null;
  }

  detachFormFieldWheelPassthrough();

  lenis.destroy();
  lenis = null;
}

export function getLenis() {
  return lenis;
}
