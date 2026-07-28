import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, initSmoothScroll } from "./smoothScroll.js";
import {
  withAboutScrollTriggerSuspended,
  getContactSection,
  syncHomeRestoreAfterScroll,
} from "./scrollToHero.js";

/** Saved Home scroll Y while visiting a case study (Projects area only). */
let savedProjectsScrollY = null;
/** When true, next Home mount(s) should snap to Projects — no intermediate flash. */
let pendingHomeProjectsRestore = false;
/** When true, next Home mount(s) should land on Contact — no Hero flash. */
let pendingHomeContactRestore = false;
/** Skip Home Framer entrance animations for the restore cycle. */
let suppressHomeEntrance = false;

export function getCurrentScrollY() {
  const lenis = getLenis();
  if (lenis && typeof lenis.scroll === "number") return lenis.scroll;
  return window.scrollY || window.pageYOffset || 0;
}

/**
 * Call when leaving Home → Case Study so Back can restore Projects only.
 */
export function saveProjectsScrollForReturn() {
  savedProjectsScrollY = Math.max(0, getCurrentScrollY());
  pendingHomeProjectsRestore = true;
  suppressHomeEntrance = true;
}

export function hasPendingHomeProjectsRestore() {
  return pendingHomeProjectsRestore;
}

export function getSuppressHomeEntrance() {
  return suppressHomeEntrance;
}

/**
 * Ensure a restore is pending when returning from a case study
 * (e.g. browser Back with no prior save, or /#projects without save).
 */
export function ensureHomeProjectsRestorePending() {
  pendingHomeProjectsRestore = true;
  pendingHomeContactRestore = false;
  suppressHomeEntrance = true;
}

/**
 * Next Home mount should land on #contact (e.g. nav CTA from a subpage).
 */
export function ensureHomeContactRestorePending() {
  pendingHomeContactRestore = true;
  pendingHomeProjectsRestore = false;
  suppressHomeEntrance = true;
}

export function hasPendingHomeContactRestore() {
  return pendingHomeContactRestore;
}

/**
 * Absolute document Y for #projects (after layout is ready).
 */
export function measureProjectsScrollY() {
  const el = document.getElementById("projects");
  if (!el) return savedProjectsScrollY ?? 0;
  const scroll = getCurrentScrollY();
  return Math.max(0, el.getBoundingClientRect().top + scroll);
}

/**
 * Target Y for Home restore: prior Projects scroll if saved, else #projects top.
 */
export function resolveHomeProjectsRestoreY() {
  if (typeof savedProjectsScrollY === "number") {
    return savedProjectsScrollY;
  }
  return measureProjectsScrollY();
}

/**
 * After Home DOM + About ScrollTriggers exist: snap to Projects and sync ST.
 * Must run inside useLayoutEffect (before paint) to avoid Hero/About flash.
 * Does NOT clear the pending flag — call clearHomeProjectsRestore() after paint
 * so React StrictMode remounts can re-apply the same snap.
 */
export function restoreHomeToProjectsNow({ reduceMotion = false } = {}) {
  if (!pendingHomeProjectsRestore) return false;

  return withAboutScrollTriggerSuspended(() => {
    const y = resolveHomeProjectsRestoreY();
    const lenis = reduceMotion ? null : getLenis() || initSmoothScroll();
    lenis?.resize?.();

    const apply = (value) => {
      if (lenis) {
        const target = Math.max(0, Math.min(value, lenis.limit || value));
        lenis.scrollTo(target, {
          offset: 0,
          immediate: true,
          force: true,
          programmatic: true,
          lock: false,
        });
        return;
      }
      window.scrollTo(0, value);
    };

    // Apply → refresh (pins/layout) → re-apply so ST doesn't leave us at 0.
    apply(y);
    ScrollTrigger.refresh();
    lenis?.resize?.();
    apply(y);
    ScrollTrigger.update();
    syncHomeRestoreAfterScroll({ forcePastAbout: true });
    return true;
  });
}

/** Clear restore flags after Home has painted at the Projects offset. */
export function clearHomeProjectsRestore() {
  pendingHomeProjectsRestore = false;
  suppressHomeEntrance = false;
}

/**
 * After Home DOM exists: snap to #contact before paint (no Hero flash), then
 * caller reveals. Smooth scroll is used when already on Home.
 */
export function restoreHomeToContactNow({ reduceMotion = false } = {}) {
  if (!pendingHomeContactRestore) return false;

  const el = getContactSection();
  if (!el) return false;

  return withAboutScrollTriggerSuspended(() => {
    const preferNative =
      reduceMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = preferNative ? null : getLenis() || initSmoothScroll();
    lenis?.resize?.();

    const apply = () => {
      if (lenis) {
        lenis.scrollTo(el, {
          offset: 0,
          immediate: true,
          force: true,
          programmatic: true,
          lock: false,
        });
        return;
      }
      const top = el.getBoundingClientRect().top + getCurrentScrollY();
      window.scrollTo(0, top);
    };

    apply();
    ScrollTrigger.refresh();
    lenis?.resize?.();
    apply();
    ScrollTrigger.update();
    syncHomeRestoreAfterScroll({ forcePastAbout: true });
    return true;
  });
}

export function clearHomeContactRestore() {
  pendingHomeContactRestore = false;
  suppressHomeEntrance = false;
}

/**
 * Home Hero must open at absolute top on every fresh load / reload.
 * Skipped when a Contact/Projects restore is pending or a hash target exists.
 */
export function resetHomeScrollToTop({ reduceMotion = false } = {}) {
  const preferNative =
    reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = preferNative ? null : getLenis() || initSmoothScroll();
  lenis?.resize?.();

  const applyTop = () => {
    if (lenis) {
      lenis.scrollTo(0, {
        offset: 0,
        immediate: true,
        force: true,
        programmatic: true,
        lock: false,
      });
      return;
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  applyTop();
  ScrollTrigger.refresh();
  lenis?.resize?.();
  applyTop();
  ScrollTrigger.update();
}

/**
 * Case Study pages always open at absolute top — never restore prior CS scroll.
 * Mirrors Home restore: apply → ScrollTrigger.refresh → re-apply, so ST/Lenis
 * resize cannot leave the page at the previous Home/CS offset.
 */
export function resetCaseStudyScrollToTop({ reduceMotion = false } = {}) {
  const preferNative =
    reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = preferNative ? null : getLenis() || initSmoothScroll();
  lenis?.resize?.();

  const applyTop = () => {
    if (lenis) {
      lenis.scrollTo(0, {
        offset: 0,
        immediate: true,
        force: true,
        programmatic: true,
        lock: false,
      });
      return;
    }
    window.scrollTo(0, 0);
  };

  applyTop();
  ScrollTrigger.refresh();
  lenis?.resize?.();
  applyTop();
  ScrollTrigger.update();
}
