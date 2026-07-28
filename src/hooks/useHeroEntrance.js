import { useLayoutEffect } from "react";
import gsap from "gsap";
import {
  beginHeroEntrance,
  endHeroEntrance,
} from "../heroEntranceGate.js";
import {
  setupHeroScrollExit,
  teardownHeroScrollExit,
} from "../heroScrollExit.js";

const EASE = "power3.out";
const TOTAL_DURATION = 1.2;

/** Nav enters in parallel — same timeline, does not extend total duration. */
const NAV_DURATION = 0.85;
const NAV_Y = -28;

/** Strict Mode safe — play once per session. */
let heroEntrancePlayed = false;

function clearVisual(els) {
  const list = (Array.isArray(els) ? els : [els]).filter(Boolean);
  if (!list.length) return;
  gsap.set(list, {
    clearProps: "opacity,transform,scale,filter,visibility,willChange",
  });
}

/**
 * Premium first-load hero entrance — single GSAP timeline (~1.2s).
 * Hero fade → I'm / avatar / Sami → staggered subtitle lines → statement.
 */
export function useHeroEntrance(
  {
    heroRef,
    imRef,
    avatarRef,
    samiRef,
    subtitleRef,
    statementRef,
  },
  { skip = false, reduceMotion = false, onComplete } = {}
) {
  useLayoutEffect(() => {
    const hero = heroRef?.current;
    const im = imRef?.current;
    const avatar = avatarRef?.current;
    const sami = samiRef?.current;
    const subtitle = subtitleRef?.current;
    const statement = statementRef?.current || null;
    const subtitleLines = subtitle
      ? gsap.utils.toArray(subtitle.querySelectorAll(".tagline__line"))
      : [];
    const nav = document.querySelector("header.nav:not(.nav--case-study)");
    const navInner = nav?.querySelector(".nav__inner") || null;

    if (!hero) return undefined;

    const animated = [hero, im, avatar, sami, statement, ...subtitleLines, navInner].filter(
      Boolean
    );

    const mountScrollExit = () => {
      if (reduceMotion) return;
      const heroCenter = hero.querySelector(".hero-center");
      setupHeroScrollExit({ hero, heroCenter, statement, reduceMotion });
    };

    const finishSkip = () => {
      clearVisual(animated);
      if (nav) {
        gsap.set(nav, {
          y: 0,
          opacity: 1,
          visibility: "visible",
          clearProps: "transform,opacity,visibility,willChange",
        });
      }
      mountScrollExit();
      endHeroEntrance();
      if (typeof onComplete === "function") onComplete();
    };

    if (skip || reduceMotion) {
      finishSkip();
      heroEntrancePlayed = true;
      return undefined;
    }

    if (heroEntrancePlayed) {
      finishSkip();
      return undefined;
    }

    beginHeroEntrance();
    let finished = false;

    gsap.set(hero, { opacity: 0, force3D: true, willChange: "opacity" });

    if (im) {
      gsap.set(im, {
        x: -30,
        opacity: 0,
        force3D: true,
        willChange: "transform, opacity",
      });
    }

    if (avatar) {
      gsap.set(avatar, {
        scale: 0.8,
        opacity: 0,
        transformOrigin: "center center",
        force3D: true,
        willChange: "transform, opacity",
      });
    }

    if (sami) {
      gsap.set(sami, {
        x: 30,
        opacity: 0,
        force3D: true,
        willChange: "transform, opacity",
      });
    }

    if (subtitleLines.length) {
      gsap.set(subtitleLines, {
        y: 20,
        opacity: 0,
        force3D: true,
        willChange: "transform, opacity",
      });
    }

    if (statement) {
      gsap.set(statement, {
        opacity: 0,
        force3D: true,
        willChange: "opacity",
      });
    }

    if (nav) {
      gsap.set(nav, {
        y: 0,
        opacity: 1,
        visibility: "visible",
        force3D: true,
      });
    }

    if (navInner) {
      gsap.set(navInner, {
        opacity: 0,
        y: NAV_Y,
        force3D: true,
        willChange: "transform, opacity",
      });
    }

    const tl = gsap.timeline({
      defaults: { ease: EASE, force3D: true },
      onComplete: () => {
        finished = true;
        heroEntrancePlayed = true;
        clearVisual(animated);
        if (nav) {
          gsap.set(nav, {
            y: 0,
            opacity: 1,
            visibility: "visible",
            clearProps: "willChange",
          });
        }
        mountScrollExit();
        if (typeof onComplete === "function") onComplete();
        endHeroEntrance();
      },
    });

    tl.to(hero, { opacity: 1, duration: 0.35 }, 0);

    if (navInner) {
      tl.to(
        navInner,
        { opacity: 1, y: 0, duration: NAV_DURATION },
        0.05
      );
    }

    if (im) {
      tl.to(im, { x: 0, opacity: 1, duration: 0.58 }, 0.1);
    }

    if (avatar) {
      tl.to(
        avatar,
        { scale: 1, opacity: 1, duration: 0.62, transformOrigin: "center center" },
        0.16
      );
    }

    if (sami) {
      tl.to(sami, { x: 0, opacity: 1, duration: 0.58 }, 0.22);
    }

    if (subtitleLines.length) {
      tl.to(
        subtitleLines,
        {
          y: 0,
          opacity: 1,
          duration: 0.48,
          stagger: 0.12,
        },
        0.38
      );
    }

    if (statement) {
      tl.to(statement, { opacity: 1, duration: 0.4 }, 0.78);
    }

    tl.to({}, { duration: 0.01 }, TOTAL_DURATION);

    return () => {
      tl.kill();
      teardownHeroScrollExit();
      endHeroEntrance();
      if (!finished) {
        clearVisual(animated);
        if (nav) {
          gsap.set(nav, {
            y: 0,
            opacity: 1,
            visibility: "visible",
            clearProps: "willChange",
          });
        }
      }
    };
  }, [
    heroRef,
    imRef,
    avatarRef,
    samiRef,
    subtitleRef,
    statementRef,
    skip,
    reduceMotion,
    onComplete,
  ]);
}
