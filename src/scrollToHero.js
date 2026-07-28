import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, initSmoothScroll } from "./smoothScroll.js";
import { markAboutGlassComplete, resetAboutGlassComplete } from "./aboutProjectsHandoff.js";

/** power4.inOut — premium, interruptible by user wheel/touch via Lenis. */
const POWER4_IN_OUT = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

const ABOUT_ST_ID = "about-tools-chapter";
const ABOUT_DETAILS_ST_ID = "about-tools-chapter";
const NAV_HIDE_ST_ID = "nav-hide-about";
const NAV_SHOW_ST_ID = "nav-show-projects";

export const HOME_RESTORE_SYNC_EVENT = "home-restore-sync";

const ABOUT_RESTORE_SELECTORS =
  ".about-section__title-morph, .about-section__body, .about-section__details, .about-section__details-rule, .about-section__side-guides, .about-section__intro-block, .about-section__avatar, .about-section__bio, .about-section__stat, .about-section__role";

/** Nested programmatic nav scrolls share one pin-bypass session. */
let navScrollDepth = 0;
let restoreTimer = 0;

function prefersReducedMotion(explicit) {
  if (typeof explicit === "boolean") return explicit;
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getAboutScrollTrigger() {
  return ScrollTrigger.getById(ABOUT_ST_ID);
}

function getAboutDetailsScrollTrigger() {
  return ScrollTrigger.getById(ABOUT_DETAILS_ST_ID);
}

function getHomeNav() {
  return document.querySelector("header.nav:not(.nav--case-study)");
}

function getCurrentScrollY() {
  const lenis = getLenis();
  if (lenis && typeof lenis.scroll === "number") return lenis.scroll;
  return window.scrollY || window.pageYOffset || 0;
}

/**
 * About uses a long scrubbed pin (title → content → Morph Fade exit).
 * Lenis programmatic scroll through that range fights ScrollTrigger and stutters.
 * Temporarily disable the About trigger for nav scrolls; restore after.
 */
function beginAboutPinBypass({ resetGlass = false } = {}) {
  navScrollDepth += 1;
  if (navScrollDepth !== 1) return;

  if (restoreTimer) {
    window.clearTimeout(restoreTimer);
    restoreTimer = 0;
  }

  getAboutScrollTrigger()?.disable(resetGlass);
  getAboutDetailsScrollTrigger()?.disable(resetGlass);
  if (resetGlass) {
    resetAboutGlassComplete();
  } else {
    markAboutGlassComplete();
  }
  gsap.killTweensOf(ABOUT_RESTORE_SELECTORS);

  if (!resetGlass) {
    applyAboutChapterPostReleaseVisuals();
  }
  getLenis()?.start?.();
}

function endAboutPinBypass(afterRestore) {
  navScrollDepth = Math.max(0, navScrollDepth - 1);
  if (navScrollDepth !== 0) {
    afterRestore?.();
    return;
  }

  const restore = () => {
    restoreTimer = 0;
    const about = getAboutScrollTrigger();
    const aboutDetails = getAboutDetailsScrollTrigger();
    if (about && !about.enabled) {
      about.enable(true);
    }
    if (aboutDetails && !aboutDetails.enabled) {
      aboutDetails.enable(true);
    }
    gsap.set(".about-section__title-morph", {
      opacity: 1,
      visibility: "visible",
      clearProps: "y,filter,willChange",
    });
    ScrollTrigger.refresh();
    ScrollTrigger.update();
    afterRestore?.();
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(restore);
  });
}

function suspendNavVisibilityTriggers() {
  ScrollTrigger.getById(NAV_HIDE_ST_ID)?.disable(false);
  ScrollTrigger.getById(NAV_SHOW_ST_ID)?.disable(false);
}

function applyNavHeroVisible(nav) {
  if (!nav) return;

  const navInner = nav.querySelector(".nav__inner");

  nav.classList.remove(
    "is-hidden",
    "nav--hidden",
    "nav-hidden",
    "hidden",
    "is-nav-hidden"
  );

  gsap.killTweensOf(navInner ? [nav, navInner] : nav);
  gsap.set(nav, {
    y: 0,
    opacity: 1,
    visibility: "visible",
    overwrite: true,
    force3D: true,
  });

  if (navInner) {
    gsap.set(navInner, {
      y: 0,
      opacity: 1,
      visibility: "visible",
      overwrite: true,
      force3D: true,
    });
  }

  nav.style.opacity = "1";
  nav.style.visibility = "visible";
  nav.style.transform = "translateY(0px)";
  if (navInner) {
    navInner.style.opacity = "1";
    navInner.style.visibility = "visible";
    navInner.style.transform = "translateY(0px)";
  }
}

function revealSiteNavAtHero() {
  const nav = getHomeNav();
  applyNavHeroVisible(nav);

  const hide = ScrollTrigger.getById(NAV_HIDE_ST_ID);
  const show = ScrollTrigger.getById(NAV_SHOW_ST_ID);
  if (hide && !hide.enabled) hide.enable(false);
  if (show && !show.enabled) show.enable(false);

  ScrollTrigger.refresh();
  ScrollTrigger.update();

  const assertIfHero = () => {
    if (!nav) return;
    if (getCurrentScrollY() > 80) return;
    applyNavHeroVisible(nav);
  };

  assertIfHero();
  requestAnimationFrame(() => {
    assertIfHero();
    requestAnimationFrame(assertIfHero);
  });
}

/**
 * Post-chapter About visuals when scroll lands past the cinematic pin.
 * Keeps Projects and below-fold sections visible after route restore.
 */
export function applyAboutChapterPostReleaseVisuals() {
  markAboutGlassComplete();
  gsap.killTweensOf(ABOUT_RESTORE_SELECTORS);
  gsap.set(".about-section__title-morph", {
    opacity: 0,
    visibility: "hidden",
    y: 0,
    filter: "blur(0px)",
    clearProps: "willChange",
  });
  gsap.set(
    ".about-section__body, .about-section__details, .about-section__details-rule, .about-section__side-guides",
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      visibility: "visible",
      clearProps: "willChange",
    }
  );
  gsap.set(
    ".about-section__intro-block, .about-section__avatar, .about-section__bio, .about-section__stat, .about-section__role",
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      visibility: "visible",
      clearProps: "willChange,transform,scale,rotation",
    }
  );
}

function ensureProjectsSectionVisible() {
  markAboutGlassComplete();
  document.querySelectorAll(".projects-section").forEach((section) => {
    section.classList.add("projects-section--chapter-ready");
  });
}

function syncNavForCurrentScroll() {
  const nav = getHomeNav();
  if (!nav) return;

  const hideSt = ScrollTrigger.getById(NAV_HIDE_ST_ID);
  if (hideSt) {
    hideSt.refresh?.();
    if (hideSt.isActive) {
      const hideY = -(nav.offsetHeight || 68);
      gsap.set(nav, {
        y: hideY,
        autoAlpha: 0,
        overwrite: true,
        force3D: true,
      });
      nav.style.pointerEvents = "none";
      return;
    }
  }

  applyNavHeroVisible(nav);
  nav.style.pointerEvents = "auto";
}

function isScrollPastAboutChapter() {
  const aboutSt = getAboutScrollTrigger();
  if (aboutSt && typeof aboutSt.end === "number") {
    return getCurrentScrollY() >= aboutSt.end - 2;
  }

  const track = document.querySelector(".about-section__body-track");
  if (!track) return false;

  const scroll = getCurrentScrollY();
  const rect = track.getBoundingClientRect();
  return rect.bottom + scroll < scroll + window.innerHeight * 0.35;
}

function syncOnceRevealTriggersInView() {
  ScrollTrigger.getAll().forEach((st) => {
    const onEnter = st.vars?.onEnter;
    if (!st.vars?.once || typeof onEnter !== "function") return;
    if (typeof st.start !== "number") return;

    try {
      if (st.scroll() >= st.start) {
        onEnter(st);
      }
    } catch (_) {
      /* ignore */
    }
  });
}

/**
 * After Home scroll restore: sync About chapter, Projects gate, nav, and ST.
 */
export function syncHomeRestoreAfterScroll({ forcePastAbout = false } = {}) {
  if (typeof window === "undefined") return;

  getLenis()?.resize?.();
  ScrollTrigger.refresh();
  ScrollTrigger.update();

  const aboutSt = getAboutScrollTrigger();
  const tl = aboutSt?.animation;
  const pastAbout =
    forcePastAbout ||
    isScrollPastAboutChapter() ||
    (aboutSt && aboutSt.progress >= 0.985);

  if (pastAbout) {
    if (tl) {
      tl.progress(1, false);
    }
    applyAboutChapterPostReleaseVisuals();
  } else if (tl && aboutSt) {
    tl.progress(aboutSt.progress, false);
  }

  ensureProjectsSectionVisible();
  syncNavForCurrentScroll();
  syncOnceRevealTriggersInView();

  window.dispatchEvent(new CustomEvent(HOME_RESTORE_SYNC_EVENT));

  ScrollTrigger.refresh();
  ScrollTrigger.update();

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    ScrollTrigger.update();
    syncNavForCurrentScroll();
  });
}

export function withAboutScrollTriggerSuspended(fn, { revert = false } = {}) {
  const about = getAboutScrollTrigger();
  const aboutDetails = getAboutDetailsScrollTrigger();
  const wasAboutEnabled = Boolean(about?.enabled);
  const wasDetailsEnabled = Boolean(aboutDetails?.enabled);
  about?.disable(revert);
  aboutDetails?.disable(revert);
  try {
    return fn();
  } finally {
    if (about && wasAboutEnabled) {
      about.enable(false);
    }
    if (aboutDetails && wasDetailsEnabled) {
      aboutDetails.enable(false);
    }
    ScrollTrigger.refresh();
    ScrollTrigger.update();
  }
}

function withAboutPinBypass(startScroll, { resetGlass = false } = {}) {
  beginAboutPinBypass({ resetGlass });

  let finished = false;
  const done = (afterRestore) => {
    if (finished) return;
    finished = true;
    if (restoreTimer) {
      window.clearTimeout(restoreTimer);
      restoreTimer = 0;
    }
    endAboutPinBypass(afterRestore);
  };

  restoreTimer = window.setTimeout(() => done(), 4000);
  startScroll(done);
}

/**
 * @param {{ reduceMotion?: boolean, immediate?: boolean, onComplete?: () => void }} [options]
 */
export function scrollToHero(options = {}) {
  const reduceMotion = prefersReducedMotion(options.reduceMotion);
  const immediate = Boolean(options.immediate) || reduceMotion;
  const lenis = reduceMotion ? null : getLenis() || initSmoothScroll();

  withAboutPinBypass((done) => {
    suspendNavVisibilityTriggers();

    const finish = () => {
      done(() => {
        revealSiteNavAtHero();
        options.onComplete?.();
      });
    };

    if (lenis) {
      lenis.scrollTo("top", {
        offset: 0,
        immediate,
        duration: immediate ? undefined : 0.9,
        easing: immediate ? undefined : POWER4_IN_OUT,
        lock: false,
        force: true,
        programmatic: true,
        onComplete: finish,
      });
      if (immediate) finish();
      return;
    }

    window.scrollTo(0, 0);
    finish();
  }, { resetGlass: true });
}

export function getContactSection() {
  return (
    document.querySelector("section.contact-section#contact") ||
    document.querySelector('section[data-scroll-section="contact"]') ||
    document.getElementById("contact")
  );
}

export function ensureHomeBelowFold() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("ensure-home-below-fold"));
}

const HOME_SECTION_HASHES = new Set([
  "about",
  "toolkit",
  "projects",
  "services",
  "contact",
]);

function isHomeSectionHash(hashId) {
  return HOME_SECTION_HASHES.has(hashId);
}

function getNavScrollOffset() {
  if (typeof window === "undefined") return -68;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--hero-nav-offset")
    .trim();
  const px = parseFloat(raw);
  return Number.isFinite(px) ? -px : -68;
}

function resolveHashElement(hashId) {
  if (!hashId) return null;
  if (hashId === "contact") return getContactSection();
  return (
    document.getElementById(hashId) ||
    document.querySelector(`section[data-scroll-section="${hashId}"]`)
  );
}

function measureElementScrollY(el, extraOffset = 0) {
  const scroll = getCurrentScrollY();
  const navOffset =
    typeof extraOffset === "number" && extraOffset !== 0
      ? extraOffset
      : getNavScrollOffset();
  return Math.max(0, el.getBoundingClientRect().top + scroll + navOffset);
}

function runLenisScrollToElement(lenis, el, options) {
  const {
    immediate = false,
    offset = 0,
    reduceMotion = false,
    duration,
    easing,
    lerp,
    programmatic,
    onComplete,
  } = options;

  const useDuration =
    typeof duration === "number" && duration > 0 && !immediate;
  const useProgrammatic =
    typeof programmatic === "boolean" ? programmatic : useDuration;

  const scrollToMeasuredY = (instant) => {
    const navOffset = typeof offset === "number" && offset !== 0 ? offset : getNavScrollOffset();
    const y = measureElementScrollY(el, navOffset);
    const limit = typeof lenis.limit === "number" ? lenis.limit : y;
    const target = Math.max(0, Math.min(y, limit));

    lenis.scrollTo(target, {
      offset: 0,
      immediate: instant,
      lock: false,
      force: true,
      programmatic: instant ? true : useProgrammatic,
      ...(instant
        ? {}
        : useDuration
          ? { duration, easing: easing ?? POWER4_IN_OUT }
          : { lerp: typeof lerp === "number" ? lerp : (lenis.options?.lerp ?? 0.1) }),
      onComplete: instant
        ? undefined
        : () => {
            ScrollTrigger.refresh();
            ScrollTrigger.update();
            onComplete?.();
          },
    });

    if (instant) {
      ScrollTrigger.refresh();
      lenis.resize?.();
      const y2 = measureElementScrollY(el, navOffset);
      const target2 = Math.max(0, Math.min(y2, lenis.limit ?? y2));
      lenis.scrollTo(target2, {
        offset: 0,
        immediate: true,
        force: true,
        programmatic: true,
        lock: false,
      });
      ScrollTrigger.update();
      onComplete?.();
    }
  };

  scrollToMeasuredY(immediate || reduceMotion);
}

/**
 * @param {string} hashId
 * @param {{ reduceMotion?: boolean, immediate?: boolean, offset?: number, lerp?: number, duration?: number, easing?: (t: number) => number, programmatic?: boolean, onComplete?: () => void }} [options]
 */
export function scrollToId(hashId, options = {}) {
  const homeSection = isHomeSectionHash(hashId);
  if (homeSection) {
    ensureHomeBelowFold();
  }

  const attempt = (triesLeft) => {
    const el = resolveHashElement(hashId);
    if (!el) {
      if (homeSection && triesLeft > 0) {
        ensureHomeBelowFold();
        window.setTimeout(() => attempt(triesLeft - 1), 50);
        return;
      }
      scrollToHero(options);
      return;
    }

    const reduceMotion = prefersReducedMotion(options.reduceMotion);
    const immediate = Boolean(options.immediate) || reduceMotion;

    const runScroll = (done) => {
      const lenis = reduceMotion ? null : getLenis() || initSmoothScroll();
      lenis?.resize?.();
      ScrollTrigger.refresh();

      const finish = () => {
        done?.();
        options.onComplete?.();
      };

      if (lenis) {
        runLenisScrollToElement(lenis, el, {
          immediate,
          offset: options.offset,
          reduceMotion,
          duration: options.duration,
          easing: options.easing,
          lerp: options.lerp,
          programmatic: options.programmatic,
          onComplete: finish,
        });
        return;
      }

      const top = measureElementScrollY(
        el,
        typeof options.offset === "number" ? options.offset : getNavScrollOffset()
      );
      window.scrollTo({
        top,
        left: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      finish();
    };

    if (homeSection) {
      withAboutPinBypass((done) => runScroll(done), {
        resetGlass: hashId === "about" && getCurrentScrollY() < 120,
      });
      return;
    }

    runScroll();
  };

  attempt(homeSection ? 40 : 0);
}
