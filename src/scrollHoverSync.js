import { getLenis } from "./smoothScroll.js";

/**
 * Hover roots that use pointerenter/leave (not CSS :hover alone).
 * During Lenis scroll the pointer stays fixed while content moves, so
 * browsers skip enter/leave until scroll stops — we re-sync on scroll.
 */
const HOVER_ROOT_SELECTOR = [
  ".projects-card",
  ".work-item--video",
  ".about-section__role-hit",
].join(",");

let clientX = -1;
let clientY = -1;
let activeRoot = null;
let initialized = false;
let lenisHandler = null;

function findHoverRoot() {
  if (clientX < 0 || clientY < 0) return null;
  const hit = document.elementFromPoint(clientX, clientY);
  if (!hit) return null;
  return hit.closest(HOVER_ROOT_SELECTOR);
}

function dispatchPointerTransition(from, to) {
  const detail = {
    bubbles: false,
    cancelable: true,
    clientX,
    clientY,
    pointerId: 1,
    pointerType: "mouse",
    view: window,
  };

  if (from && from !== to) {
    from.dispatchEvent(new PointerEvent("pointerleave", detail));
  }
  if (to && to !== from) {
    to.dispatchEvent(new PointerEvent("pointerenter", detail));
  }
}

function syncHoverOnScroll() {
  const next = findHoverRoot();
  if (next === activeRoot) return;
  dispatchPointerTransition(activeRoot, next);
  activeRoot = next;
}

function onPointerMove(event) {
  if (typeof event.clientX !== "number" || typeof event.clientY !== "number") {
    return;
  }
  clientX = event.clientX;
  clientY = event.clientY;
  // While the pointer is moving, native enter/leave events are authoritative.
  activeRoot = findHoverRoot();
}

function attachLenisScroll() {
  const lenis = getLenis();
  if (!lenis || lenisHandler) return;
  lenisHandler = () => syncHoverOnScroll();
  lenis.on("scroll", lenisHandler);
}

function detachLenisScroll() {
  const lenis = getLenis();
  if (!lenis || !lenisHandler) return;
  lenis.off("scroll", lenisHandler);
  lenisHandler = null;
}

export function initScrollHoverSync() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("scroll", syncHoverOnScroll, { passive: true });
  attachLenisScroll();

  // Lenis may init after this runs — retry on the next frame.
  requestAnimationFrame(attachLenisScroll);
}

export function destroyScrollHoverSync() {
  if (!initialized || typeof window === "undefined") return;
  initialized = false;

  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("scroll", syncHoverOnScroll);
  detachLenisScroll();

  clientX = -1;
  clientY = -1;
  activeRoot = null;
}

/** Call when Lenis is created so scroll sync hooks the instance. */
export function refreshScrollHoverSync() {
  if (!initialized) return;
  detachLenisScroll();
  attachLenisScroll();
}
