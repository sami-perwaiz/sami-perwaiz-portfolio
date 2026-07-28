import { useLayoutEffect } from "react";
import gsap from "gsap";

/**
 * One-shot first-viewport entrance for ShipFlex docs layout.
 * Opacity + translate only — no blur.
 */
export function useCaseStudyDocsEntrance({ heroRef, reduceMotion, studySlug }) {
  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    const nav = document.querySelector(".cs-navbar");
    const eyebrow = hero.querySelector(".cs-docs__eyebrow");
    const title = hero.querySelector(".cs-docs__title");
    const tagline = hero.querySelector(".cs-docs__tagline");
    const intro = hero.querySelector(".cs-docs__intro");

    const animated = [nav, eyebrow, title, tagline, intro].filter(Boolean);

    const clearAnimatedProps = () => {
      gsap.set(animated, { clearProps: "transform,opacity" });
    };

    if (reduceMotion) {
      clearAnimatedProps();
      return undefined;
    }

    if (nav) gsap.set(nav, { y: -20, opacity: 0, force3D: true });
    if (eyebrow) gsap.set(eyebrow, { y: 14, opacity: 0, force3D: true });
    if (title) gsap.set(title, { y: 36, opacity: 0, force3D: true });
    if (tagline) gsap.set(tagline, { y: 22, opacity: 0, force3D: true });
    if (intro) gsap.set(intro, { y: 22, opacity: 0, force3D: true });

    const tl = gsap.timeline({ defaults: { force3D: true } });

    if (nav) {
      tl.to(nav, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0);
    }

    if (eyebrow) {
      tl.to(eyebrow, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, 0.1);
    }

    if (title) {
      tl.to(title, { y: 0, opacity: 1, duration: 0.78, ease: "power4.out" }, 0.16);
    }

    if (tagline) {
      tl.to(tagline, { y: 0, opacity: 1, duration: 0.62, ease: "power3.out" }, 0.3);
    }

    if (intro) {
      tl.to(intro, { y: 0, opacity: 1, duration: 0.62, ease: "power3.out" }, 0.4);
    }

    return () => {
      tl.kill();
      clearAnimatedProps();
    };
  }, [heroRef, reduceMotion, studySlug]);
}
