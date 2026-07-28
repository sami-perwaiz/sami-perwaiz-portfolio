import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Scroll distance for the exit (~22% of viewport height). */
const SCRUB_VH = 0.22;

/** Soft blur at full exit — calm, not harsh. */
const BLUR_EXIT = "blur(12px)";
const BLUR_NONE = "blur(0px)";

/** Let hero entrance claim first frames before ScrollTrigger setup. */
const SETUP_DEFER_MS = 480;

function findSelectedWork(statement) {
  return (
    document.querySelector(
      'section.selected-work[data-scroll-section="selected-work"]'
    ) ||
    document.querySelector('section[data-scroll-section="selected-work"]') ||
    statement?.closest("main")?.querySelector("section.selected-work") ||
    null
  );
}

/**
 * Scroll-scrubbed blur + fade exit on the hero statement.
 * Whole line softens and fades as Selected Work enters — no word shatter.
 * Retries until Selected Work is mounted (it may load after hero entrance).
 */
export function useStatementGlassBreak(
  statementRef,
  { reduceMotion = false } = {}
) {
  useLayoutEffect(() => {
    const statement = statementRef?.current;
    if (!statement) return undefined;

    let cancelled = false;
    let tl = null;
    let idleId = 0;
    let timeoutId = 0;
    let retryId = 0;

    const scrubRange = () =>
      `+=${Math.round(window.innerHeight * SCRUB_VH)}`;

    const teardown = () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      tl = null;
      gsap.set(statement, {
        clearProps: "opacity,visibility,filter,transform,willChange",
      });
    };

    const setup = (nextSection) => {
      if (cancelled || !nextSection || tl) return;

      gsap.set(statement, {
        autoAlpha: 1,
        filter: BLUR_NONE,
        force3D: true,
        willChange: reduceMotion ? "opacity" : "opacity, filter",
      });

      tl = gsap.timeline({
        defaults: { ease: "none", force3D: true },
        scrollTrigger: {
          id: "hero-statement-exit",
          trigger: nextSection,
          start: "1% bottom",
          end: scrubRange,
          scrub: reduceMotion ? true : 0.5,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      if (reduceMotion) {
        tl.fromTo(
          statement,
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 1 }
        );
      } else {
        tl.fromTo(
          statement,
          { autoAlpha: 1, filter: BLUR_NONE },
          { autoAlpha: 0, filter: BLUR_EXIT, duration: 1 }
        );
      }
    };

    const trySetup = () => {
      if (cancelled || tl) return;
      const nextSection = findSelectedWork(statement);
      if (nextSection) {
        setup(nextSection);
        return;
      }
      retryId = window.setTimeout(trySetup, 200);
    };

    const start = () => {
      if (cancelled) return;
      trySetup();
    };

    if (typeof requestIdleCallback === "function") {
      idleId = requestIdleCallback(start, { timeout: SETUP_DEFER_MS + 400 });
    } else {
      timeoutId = window.setTimeout(start, SETUP_DEFER_MS);
    }

    return () => {
      cancelled = true;
      if (idleId && typeof cancelIdleCallback === "function") {
        cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
      if (retryId) window.clearTimeout(retryId);
      teardown();
    };
  }, [statementRef, reduceMotion]);
}
