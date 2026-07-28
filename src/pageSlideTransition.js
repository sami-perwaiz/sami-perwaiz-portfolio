import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./smoothScroll.js";

gsap.registerPlugin(ScrollTrigger);

export const SLIDE_EXIT_DURATION = 0.58;
export const SLIDE_ENTER_DURATION = 0.68;
export const SLIDE_OFFSET_PERCENT = 100;

const state = {
  active: false,
  direction: null,
  entering: false,
};

export function isPageSlideTransitionActive() {
  return state.active;
}

export function isPageSlideEntering() {
  return state.entering;
}

export function getPageSlideDirection() {
  return state.direction;
}

function lockScroll() {
  document.documentElement.classList.add("page-slide-active");
  const viewport = document.querySelector("[data-page-slide-viewport]");
  if (viewport) viewport.classList.add("page-slide-viewport--active");
}

function unlockScroll() {
  document.documentElement.classList.remove("page-slide-active");
  const viewport = document.querySelector("[data-page-slide-viewport]");
  if (viewport) viewport.classList.remove("page-slide-viewport--active");
}

function refreshScrollSystems() {
  getLenis()?.resize?.();
  ScrollTrigger.refresh();
}

function getLayer() {
  return document.querySelector("[data-page-slide-layer]");
}

/**
 * Slide current page out horizontally, then navigate.
 * Forward: exit left. Back: exit right.
 */
export function pageSlideExit({ direction, reduceMotion = false, onNavigate }) {
  const layer = getLayer();
  if (reduceMotion || !layer) {
    onNavigate?.();
    return Promise.resolve(false);
  }

  if (state.active) return Promise.resolve(false);

  state.active = true;
  state.direction = direction;
  state.entering = false;
  lockScroll();

  const xOut = direction === "forward" ? -SLIDE_OFFSET_PERCENT : SLIDE_OFFSET_PERCENT;

  return new Promise((resolve) => {
    gsap.to(layer, {
      xPercent: xOut,
      opacity: 0.92,
      duration: SLIDE_EXIT_DURATION,
      ease: "power3.in",
      force3D: true,
      onComplete: () => {
        onNavigate?.();
        resolve(true);
      },
    });
  });
}

/**
 * Slide newly mounted page in from the opposite edge.
 */
export function pageSlideEnter({ direction, reduceMotion = false }) {
  const layer = getLayer();
  if (!layer) {
    state.active = false;
    state.direction = null;
    state.entering = false;
    unlockScroll();
    return Promise.resolve(false);
  }

  if (reduceMotion || !state.active || !direction) {
    state.active = false;
    state.direction = null;
    state.entering = false;
    unlockScroll();
    gsap.set(layer, { clearProps: "transform,opacity" });
    return Promise.resolve(false);
  }

  state.entering = true;
  const xIn = direction === "forward" ? SLIDE_OFFSET_PERCENT : -SLIDE_OFFSET_PERCENT;

  gsap.set(layer, { xPercent: xIn, opacity: 0.92, force3D: true });

  return new Promise((resolve) => {
    gsap.to(layer, {
      xPercent: 0,
      opacity: 1,
      duration: SLIDE_ENTER_DURATION,
      ease: "power3.out",
      force3D: true,
      onComplete: () => {
        state.active = false;
        state.direction = null;
        state.entering = false;
        unlockScroll();
        gsap.set(layer, { clearProps: "transform,opacity" });
        requestAnimationFrame(refreshScrollSystems);
        resolve(true);
      },
    });
  });
}
