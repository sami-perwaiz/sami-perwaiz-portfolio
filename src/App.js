import {
  createElement as h,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CaseStudyNavbar } from "./CaseStudyNavbar.js";
import { CASE_STUDIES } from "./projectData.js";
import { destroySmoothScroll, getLenis, initSmoothScroll } from "./smoothScroll.js";
import {
  destroyScrollHoverSync,
  initScrollHoverSync,
} from "./scrollHoverSync.js";
import {
  scrollToHero,
  scrollToId,
  syncHomeRestoreAfterScroll,
} from "./scrollToHero.js";
import { CustomCursor, isCursorRevealActive } from "./CustomCursor.js";
import { ShinyPill } from "./ShinyPill.js";
import {
  clearHomeContactRestore,
  clearHomeProjectsRestore,
  ensureHomeContactRestorePending,
  ensureHomeProjectsRestorePending,
  getSuppressHomeEntrance,
  hasPendingHomeContactRestore,
  hasPendingHomeProjectsRestore,
  resetCaseStudyScrollToTop,
  resetHomeScrollToTop,
  restoreHomeToContactNow,
  restoreHomeToProjectsNow,
} from "./routeScroll.js";
import { useAppNavigate } from "./hooks/useAppNavigate.js";
import { usePageSlideTransition } from "./hooks/usePageSlideTransition.js";
import { preloadSelectedWorkAssets } from "./AppHome.js";
import { prefetchHomeBelowFold, resetHomeBelowFoldPrefetch } from "./prefetchHomeBelowFold.js";
import { Home } from "./pages/Home.jsx";
import { CaseStudy } from "./pages/CaseStudy.jsx";
import { Privacy } from "./pages/Privacy.jsx";
import { NotFound } from "./pages/NotFound.jsx";

gsap.registerPlugin(ScrollTrigger);

function SiteNav({
  reduceMotion,
  pathname,
  onNavigateHome,
  isCaseStudy,
  isPrivacyPage,
}) {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const logoShakeTimerRef = useRef(0);
  const showBack = Boolean(isCaseStudy || isPrivacyPage);
  const backHref = isPrivacyPage ? "/#contact" : "/#projects";
  const backLabel = isPrivacyPage ? "Back" : "Back to Projects";

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    const navInner = nav.querySelector(".nav__inner");
    if (
      pathname === "/" &&
      !reduceMotion &&
      !showBack &&
      navInner &&
      navInner.style.opacity !== "" &&
      navInner.style.opacity !== "1"
    ) {
      return undefined;
    }
    gsap.set(nav, { clearProps: "transform,opacity,visibility" });
    if (navInner) {
      gsap.set(navInner, { clearProps: "transform,opacity,visibility" });
    }
    return undefined;
  }, [pathname, reduceMotion, showBack]);

  useEffect(
    () => () => {
      window.clearTimeout(logoShakeTimerRef.current);
    },
    []
  );

  const brandTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: [0.22, 1, 0.36, 1] };

  const shakeLogo = () => {
    const logo = logoRef.current;
    if (!logo || reduceMotion) return;

    logo.classList.remove("logo--shake");
    void logo.offsetWidth;
    logo.classList.add("logo--shake");

    window.clearTimeout(logoShakeTimerRef.current);
    logoShakeTimerRef.current = window.setTimeout(() => {
      logo.classList.remove("logo--shake");
    }, 420);
  };

  const handleLogoClick = (event) => {
    event.preventDefault();
    shakeLogo();
  };

  const handleLogoKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    shakeLogo();
  };

  return h(
    "header",
    {
      ref: navRef,
      className: ["nav", showBack ? "nav--case-study" : ""]
        .filter(Boolean)
        .join(" "),
      "aria-label": "Primary",
    },
    h(
      "div",
      { className: "nav__inner" },
      h(
        AnimatePresence,
        { mode: "wait", initial: false },
        showBack
          ? h(
              motion.a,
              {
                key: "nav-back",
                className: "nav-back",
                href: backHref,
                initial: reduceMotion ? false : { opacity: 0, x: -10 },
                animate: { opacity: 1, x: 0 },
                exit: reduceMotion ? undefined : { opacity: 0, x: -10 },
                transition: brandTransition,
                onClick: (event) => {
                  if (!onNavigateHome) return;
                  event.preventDefault();
                  onNavigateHome(backHref, { reduceMotion });
                },
              },
              h("img", {
                className: "nav-back__icon",
                src: "/assets/icons/nav-back-arrow.svg",
                alt: "",
                width: 24,
                height: 24,
                "aria-hidden": true,
              }),
              h("span", { className: "nav-back__label" }, backLabel)
            )
          : h(
              motion.span,
              {
                key: "nav-logo",
                initial: reduceMotion ? false : { opacity: 0, x: -10 },
                animate: { opacity: 1, x: 0 },
                exit: reduceMotion ? undefined : { opacity: 0, x: -10 },
                transition: brandTransition,
              },
              h(
                "span",
                {
                  ref: logoRef,
                  className: "logo",
                  role: "button",
                  tabIndex: 0,
                  "aria-label": "Sami Perwaiz",
                  onClick: handleLogoClick,
                  onKeyDown: handleLogoKeyDown,
                },
                "Sami Perwaiz"
              )
            )
      ),
      h(
        "a",
        {
          className: "say-hello",
          href: "/#contact",
          onClick: (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (pathname === "/") {
              scrollToId("contact", {
                reduceMotion,
                immediate: false,
                duration: 2.75,
              });
              return;
            }
            if (!onNavigateHome) return;
            onNavigateHome("/#contact", { reduceMotion });
          },
        },
        isCaseStudy
          ? h("span", { className: "say-hello__label" }, "Say Hello")
          : h(ShinyPill, {
              className: "say-hello__label",
              text: pathname === "/" ? "Say Hello" : "Contact Me",
              textColor: "currentColor",
              shineColor: "rgba(255, 255, 255, 0.85)",
              interval: 6,
            })
      )
    )
  );
}

/** Single expanding ring on click — does not change the cursor. */
function useClickRing(reduceMotion) {
  useEffect(() => {
    if (reduceMotion) return undefined;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return undefined;

    let ring = null;
    let tween = null;

    const clearRing = () => {
      if (tween) {
        tween.kill();
        tween = null;
      }
      if (ring) {
        ring.remove();
        ring = null;
      }
    };

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      if (isCursorRevealActive()) return;
      if (event.target?.closest?.("input, textarea, select, [contenteditable='true']")) {
        return;
      }

      clearRing();

      ring = document.createElement("span");
      ring.className = "click-ring";
      ring.setAttribute("aria-hidden", "true");
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
      document.body.appendChild(ring);

      gsap.set(ring, { xPercent: -50, yPercent: -50 });
      tween = gsap.fromTo(
        ring,
        { width: 8, height: 8, opacity: 0.18 },
        {
          width: 48,
          height: 48,
          opacity: 0,
          duration: 0.35,
          ease: "power2.out",
          onComplete: clearRing,
        }
      );
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      clearRing();
    };
  }, [reduceMotion]);
}

/** Native scroll when reduced-motion or on case-study tablet/mobile (avoids Lenis jank). */
function usePreferNativeScroll(isCaseStudyRoute) {
  const [preferNative, setPreferNative] = useState(false);

  useEffect(() => {
    if (!isCaseStudyRoute) {
      setPreferNative(false);
      return undefined;
    }

    const mq = window.matchMedia("(max-width: 1024px)");
    const update = () => setPreferNative(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [isCaseStudyRoute]);

  return preferNative;
}

/** Native scroll when reduced-motion; otherwise global Lenis (Apple-style). */
function useSiteSmoothScroll(reduceMotion, skipHomeEntrance, preferNativeScroll) {
  useEffect(() => {
    initScrollHoverSync();

    if (reduceMotion || preferNativeScroll) {
      destroySmoothScroll();
      return () => {
        destroyScrollHoverSync();
      };
    }

    let cancelled = false;
    let fallbackTimer = 0;

    const start = () => {
      if (cancelled) return;
      initSmoothScroll();
    };

    // Skip path: Lenis before first interaction.
    if (skipHomeEntrance) {
      start();
      return () => {
        cancelled = true;
        destroySmoothScroll();
        destroyScrollHoverSync();
      };
    }

    // Normal home load: start Lenis when hero entrance finishes so the first
    // scroll off the pinned hero is already on the shared GSAP ticker.
    const onHeroDone = () => start();
    window.addEventListener("hero-entrance-complete", onHeroDone, { once: true });
    fallbackTimer = window.setTimeout(start, 1600);

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("hero-entrance-complete", onHeroDone);
      destroySmoothScroll();
      destroyScrollHoverSync();
    };
  }, [reduceMotion, skipHomeEntrance, preferNativeScroll]);
}

export function App() {
  const reduceMotion = useReducedMotion();
  const skipHomeEntrance = Boolean(getSuppressHomeEntrance());
  const location = useLocation();
  const navigationType = useNavigationType();
  const pathname = location.pathname;
  const navigate = useAppNavigate({ reduceMotion });
  usePageSlideTransition(pathname, reduceMotion);
  const prevPathRef = useRef(pathname);

  const isPrivacyPage = pathname === "/privacy-policy";
  const isProjectRoute = pathname.startsWith("/projects/");
  const projectSlug = isProjectRoute
    ? decodeURIComponent(pathname.slice("/projects/".length)).replace(/\/+$/, "")
    : "";
  const caseStudy =
    projectSlug && CASE_STUDIES[projectSlug] ? CASE_STUDIES[projectSlug] : null;
  const isNotFound =
    pathname !== "/" && !isPrivacyPage && !(isProjectRoute && caseStudy);
  const isHome = pathname === "/";

  const deferCursorUntilHero =
    isHome && !reduceMotion && !skipHomeEntrance;

  const [showCursor, setShowCursor] = useState(
    () => Boolean(reduceMotion || skipHomeEntrance)
  );
  const [showRestOfHome, setShowRestOfHome] = useState(
    () => Boolean(reduceMotion || skipHomeEntrance)
  );
  const [HomeBelowFold, setHomeBelowFold] = useState(null);
  const [homeKeepAlive, setHomeKeepAlive] = useState(false);
  const belowFoldLoadRef = useRef(false);
  const homeRootRef = useRef(null);

  const importHomeBelowFoldChunk = useCallback(({ immediate = false } = {}) => {
    if (belowFoldLoadRef.current) return;

    const applyModule = (mod) => {
      if (belowFoldLoadRef.current) return;
      belowFoldLoadRef.current = true;
      setHomeBelowFold(() => mod.HomeBelowFold);
      window.dispatchEvent(new CustomEvent("home-below-fold-ready"));
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    const runImport = () => {
      prefetchHomeBelowFold().then(applyModule).catch(() => {
        belowFoldLoadRef.current = false;
        resetHomeBelowFoldPrefetch();
      });
    };

    if (immediate) {
      runImport();
      return;
    }

    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(runImport, { timeout: 800 });
    } else {
      window.setTimeout(runImport, 120);
    }
  }, []);

  const loadHomeBelowFold = useCallback(
    ({ immediate = false } = {}) => {
      setHomeKeepAlive(true);
      importHomeBelowFoldChunk({ immediate });
    },
    [importHomeBelowFoldChunk]
  );

  const onHeroEntranceComplete = useCallback(() => {
    setShowRestOfHome(true);
    loadHomeBelowFold({ immediate: true });
  }, [loadHomeBelowFold]);

  // Warm Selected Work + below-fold chunk during hero entrance so the first
  // scroll off the pinned hero does not parse a 1MB chunk or shift layout.
  useEffect(() => {
    if (!isHome || skipHomeEntrance || reduceMotion) return undefined;

    const onHeroStart = () => {
      prefetchHomeBelowFold();
      preloadSelectedWorkAssets();
      setShowRestOfHome(true);
    };

    window.addEventListener("hero-entrance-start", onHeroStart, { once: true });
    return () => {
      window.removeEventListener("hero-entrance-start", onHeroStart);
    };
  }, [isHome, skipHomeEntrance, reduceMotion]);

  useEffect(() => {
    if (!showRestOfHome) return undefined;

    preloadSelectedWorkAssets();
    return undefined;
  }, [showRestOfHome]);

  // Below-fold home: after entrance, on skip, or when Contact is requested early.
  // Do NOT tear down HomeBelowFold when leaving — remounting causes ~1s freeze on Back.
  useEffect(() => {
    if (!isHome) return undefined;

    setHomeKeepAlive(true);

    if (skipHomeEntrance || reduceMotion) {
      loadHomeBelowFold({ immediate: true });
      return undefined;
    }

    const onEnsure = () => loadHomeBelowFold({ immediate: true });
    window.addEventListener("ensure-home-below-fold", onEnsure);
    const timer = window.setTimeout(
      () => loadHomeBelowFold({ immediate: true }),
      5500
    );

    return () => {
      window.removeEventListener("ensure-home-below-fold", onEnsure);
      window.clearTimeout(timer);
    };
  }, [isHome, skipHomeEntrance, reduceMotion, loadHomeBelowFold]);

  useEffect(() => {
    if (reduceMotion) {
      setShowCursor(true);
      return undefined;
    }
    if (!deferCursorUntilHero) {
      setShowCursor(true);
      return undefined;
    }

    const onDone = () => setShowCursor(true);
    window.addEventListener("hero-entrance-complete", onDone, { once: true });
    return () => {
      window.removeEventListener("hero-entrance-complete", onDone);
    };
  }, [deferCursorUntilHero, reduceMotion]);

  const preferNativeScroll = usePreferNativeScroll(isProjectRoute);
  useSiteSmoothScroll(reduceMotion, skipHomeEntrance, preferNativeScroll);
  useClickRing(reduceMotion);

  useEffect(() => {
    if (navigationType !== "POP") {
      prevPathRef.current = pathname;
      return;
    }

    const prevPath = prevPathRef.current;
    const nextPath = pathname;
    const hash = location.hash.replace(/^#/, "");
    const leavingCaseStudy =
      prevPath.startsWith("/projects/") && !nextPath.startsWith("/projects/");
    const goingHomeToContact =
      nextPath === "/" && hash === "contact" && prevPath !== "/";

    if (goingHomeToContact) {
      ensureHomeContactRestorePending();
      prevPathRef.current = nextPath;
      return;
    }

    if (leavingCaseStudy) {
      ensureHomeProjectsRestorePending();
      if (!hash) {
        window.history.replaceState({}, "", "/#projects");
      }
      prevPathRef.current = nextPath;
      return;
    }

    prevPathRef.current = nextPath;

    if (nextPath.startsWith("/projects/") || nextPath === "/privacy-policy") {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (hash === "projects" || hasPendingHomeProjectsRestore()) {
          ensureHomeProjectsRestorePending();
          return;
        }
        if (hash === "contact" || hasPendingHomeContactRestore()) {
          ensureHomeContactRestorePending();
          return;
        }
        if (hash) {
          scrollToId(hash, { immediate: false });
          return;
        }
        scrollToHero({ immediate: false });
      });
    });
  }, [location.hash, navigationType, pathname]);

  // Returning to Contact/Projects: kick chunk load immediately (cold path only).
  useLayoutEffect(() => {
    if (!isHome) return;
    if (
      hasPendingHomeContactRestore() ||
      hasPendingHomeProjectsRestore()
    ) {
      loadHomeBelowFold({ immediate: true });
    }
  }, [isHome, pathname, loadHomeBelowFold]);

  // Scroll past hero → load below-fold early (user intent beats idle defer).
  useEffect(() => {
    if (!isHome || skipHomeEntrance || reduceMotion) return undefined;
    if (belowFoldLoadRef.current) return undefined;

    const onScroll = () => {
      if (window.scrollY > 120) {
        loadHomeBelowFold({ immediate: true });
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, skipHomeEntrance, reduceMotion, loadHomeBelowFold]);

  // Park home ScrollTriggers while off-route so they don't fight case-study scroll.
  useLayoutEffect(() => {
    const root = homeRootRef.current;
    if (!root || !homeKeepAlive) return undefined;

    const homeTriggers = () =>
      ScrollTrigger.getAll().filter((st) => {
        const trigger = st.trigger;
        const pin = st.pin;
        return (
          (trigger instanceof Element && root.contains(trigger)) ||
          (pin instanceof Element && root.contains(pin))
        );
      });

    if (!isHome) {
      homeTriggers().forEach((st) => st.disable(false));
      return undefined;
    }

    homeTriggers().forEach((st) => st.enable(false));
    getLenis()?.resize?.();
    ScrollTrigger.refresh();
    ScrollTrigger.update();

    if (
      hasPendingHomeContactRestore() ||
      hasPendingHomeProjectsRestore()
    ) {
      syncHomeRestoreAfterScroll({
        forcePastAbout:
          hasPendingHomeContactRestore() || hasPendingHomeProjectsRestore(),
      });
    }
    return undefined;
  }, [isHome, homeKeepAlive, HomeBelowFold]);

  // Snap scroll only after below-fold DOM exists (pre-paint — avoid Hero flash).
  // With keep-alive, HomeBelowFold is already mounted on return — no async gap.
  useLayoutEffect(() => {
    if (!isHome || !HomeBelowFold) return;

    if (hasPendingHomeContactRestore()) {
      restoreHomeToContactNow({ reduceMotion: Boolean(reduceMotion) });
      return;
    }

    if (hasPendingHomeProjectsRestore()) {
      restoreHomeToProjectsNow({ reduceMotion: Boolean(reduceMotion) });
    }
  }, [isHome, HomeBelowFold, reduceMotion]);

  // Clear restore flags only after Home has painted at the target offset.
  useEffect(() => {
    if (!isHome || !HomeBelowFold) return;

    if (hasPendingHomeContactRestore()) {
      syncHomeRestoreAfterScroll({ forcePastAbout: true });
      clearHomeContactRestore();
      return;
    }

    if (hasPendingHomeProjectsRestore() || getSuppressHomeEntrance()) {
      syncHomeRestoreAfterScroll({ forcePastAbout: true });
      clearHomeProjectsRestore();
    }
  }, [isHome, HomeBelowFold, reduceMotion]);

  // Home Hero: always open at scroll 0 on fresh load — never inherit stale Y.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/") return;
    if (hasPendingHomeContactRestore() || hasPendingHomeProjectsRestore()) {
      return;
    }
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && hash !== "hero") return;
    resetHomeScrollToTop({ reduceMotion: Boolean(reduceMotion) });
  }, [reduceMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/") return;
    if (hasPendingHomeContactRestore() || hasPendingHomeProjectsRestore()) {
      return undefined;
    }
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && hash !== "hero") return undefined;

    resetHomeScrollToTop({ reduceMotion: Boolean(reduceMotion) });
    const raf = requestAnimationFrame(() => {
      resetHomeScrollToTop({ reduceMotion: Boolean(reduceMotion) });
    });
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  // Case Study / Privacy / 404: always open at scroll 0 — never restore a prior offset.
  // Layout (pre-paint) + effect (post-paint) so Lenis/ST layout settle can't leave a stale Y.
  useLayoutEffect(() => {
    if (!caseStudy && !isPrivacyPage && !isNotFound) return;
    resetCaseStudyScrollToTop({ reduceMotion: Boolean(reduceMotion) });
  }, [caseStudy?.slug, isPrivacyPage, isNotFound, pathname, reduceMotion]);

  useEffect(() => {
    if (!caseStudy && !isPrivacyPage && !isNotFound) return;
    resetCaseStudyScrollToTop({ reduceMotion: Boolean(reduceMotion) });
    const raf = requestAnimationFrame(() => {
      resetCaseStudyScrollToTop({ reduceMotion: Boolean(reduceMotion) });
    });
    return () => cancelAnimationFrame(raf);
  }, [caseStudy?.slug, isPrivacyPage, isNotFound, pathname, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    const isEditableTarget = (target) => {
      if (!target) return false;
      const el = /** @type {HTMLElement} */ (target);
      const tag = el.tagName?.toLowerCase?.() ?? "";
      return (
        el.isContentEditable ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        tag === "button"
      );
    };

    const POWER4_IN_OUT = (t) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

    const onKeyDown = (event) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableTarget(event.target)) return;

      const lenis = getLenis() || initSmoothScroll();
      if (!lenis) return;

      const key = event.key;

      if (key === "Home") {
        event.preventDefault();
        scrollToHero({ immediate: false });
        return;
      }

      if (key === "End") {
        event.preventDefault();
        lenis.scrollTo(lenis.limit, {
          offset: 0,
          immediate: false,
          duration: 0.9,
          easing: POWER4_IN_OUT,
          lock: false,
          force: true,
          programmatic: true,
        });
        return;
      }

      const cur =
        typeof lenis.actualScroll === "number" ? lenis.actualScroll : lenis.scroll;

      let delta = 0;
      if (key === "PageDown" || key === " " || key === "Spacebar") {
        delta = window.innerHeight * 0.9;
      } else if (key === "PageUp") {
        delta = -window.innerHeight * 0.9;
      } else if (key === "ArrowDown") {
        delta = window.innerHeight * 0.2;
      } else if (key === "ArrowUp") {
        delta = -window.innerHeight * 0.2;
      } else {
        return;
      }

      event.preventDefault();

      const next = Math.max(0, Math.min(lenis.limit, cur + delta));
      lenis.scrollTo(next, {
        offset: 0,
        immediate: false,
        duration: 0.9,
        easing: POWER4_IN_OUT,
        lock: false,
        force: true,
        programmatic: true,
      });
    };

    const onClickCapture = (event) => {
      const a = event.target?.closest?.("a[href]");
      if (!a) return;
      // SiteNav CTA has its own smooth-scroll handler — avoid double scrollToId.
      if (a.classList.contains("say-hello") || a.classList.contains("nav-back")) {
        return;
      }

      const href = a.getAttribute("href") || "";
      if (!href) return;

      const currentPath = window.location.pathname;
      if (href.startsWith("#")) {
        const hashId = href.slice(1);
        if (!hashId) return;
        event.preventDefault();
        scrollToId(hashId, { reduceMotion, immediate: false });
        return;
      }

      if (href.startsWith("/#") && currentPath === "/") {
        const hashId = href.slice(2);
        if (!hashId) return;
        event.preventDefault();
        scrollToId(hashId, { reduceMotion, immediate: false });
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    document.addEventListener("click", onClickCapture, true);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClickCapture, true);
    };
  }, [reduceMotion]);

  useEffect(() => {
    document.title = caseStudy
      ? `${caseStudy.title} — Sami Perwaiz`
      : isPrivacyPage
        ? "Privacy Policy — Sami Perwaiz"
        : isNotFound
          ? "Page not found — Sami Perwaiz"
          : "Sami Perwaiz — Product Designer";
  }, [caseStudy, isPrivacyPage, isNotFound]);

  const renderHome = isHome || homeKeepAlive;
  const homeParked = renderHome && !isHome;

  return h(
    "main",
    {
      className:
        caseStudy || isPrivacyPage || isNotFound
          ? [
              "app-shell",
              "app-shell--case-study",
              isNotFound ? "app-shell--not-found" : "",
            ]
              .filter(Boolean)
              .join(" ")
          : "app-shell",
    },
    showCursor
      ? h(CustomCursor, {
          reduceMotion,
          deferUntilHeroEntrance: deferCursorUntilHero,
        })
      : null,
    isNotFound
      ? null
      : caseStudy
        ? h(CaseStudyNavbar, {
            reduceMotion,
            onNavigateHome: navigate,
          })
        : h(SiteNav, {
            reduceMotion,
            pathname,
            onNavigateHome: navigate,
            isCaseStudy: false,
            isPrivacyPage,
          }),
    h(
      "div",
      { className: "page-slide-viewport", "data-page-slide-viewport": "" },
      h(
        "div",
        {
          className: "page-slide-layer",
          "data-page-slide-layer": "",
        },
        h(
          Routes,
          null,
          renderHome
            ? h(Route, {
                path: "/",
                element: h(Home, {
                  reduceMotion,
                  skipHomeEntrance,
                  homeParked,
                  homeRootRef,
                  showRestOfHome,
                  HomeBelowFold,
                  onHeroEntranceComplete,
                  onNavigate: navigate,
                  contactRestoreInstant: hasPendingHomeContactRestore(),
                }),
              })
            : null,
          h(Route, {
            path: "/projects/:slug",
            element: h(CaseStudy, {
              reduceMotion,
              onNavigateHome: navigate,
            }),
          }),
          h(Route, { path: "/privacy-policy", element: h(Privacy) }),
          h(Route, {
            path: "*",
            element: h(NotFound, { onNavigate: navigate }),
          })
        )
      )
    )
  );
}
