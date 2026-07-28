import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-triggered reveals for case study sections below the hero.
 */
export function useCaseStudyScrollReveal({ pageRef, reduceMotion }) {
  useLayoutEffect(() => {
    const page = pageRef?.current;
    if (!page) return undefined;

    const sections = gsap.utils.toArray(
      page.querySelectorAll(
        ".cs-page__inner > section:not(.cs-hero), .cs-page__inner > figure"
      )
    );

    if (!sections.length) return undefined;

    const triggers = [];

    if (reduceMotion) {
      gsap.set(sections, { clearProps: "transform,opacity" });
      return undefined;
    }

    sections.forEach((section, index) => {
      gsap.set(section, {
        y: 36,
        opacity: 0,
        force3D: true,
      });

      const tween = gsap.to(section, {
        y: 0,
        opacity: 1,
        duration: 0.72,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          once: true,
        },
        delay: index % 3 === 0 ? 0 : 0.04,
      });

      triggers.push(tween.scrollTrigger);
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      triggers.forEach((trigger) => trigger?.kill());
      gsap.killTweensOf(sections);
      gsap.set(sections, { clearProps: "transform,opacity" });
    };
  }, [pageRef, reduceMotion]);
}
