import { createElement as h, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { scrollToHero } from "./scrollToHero.js";

/**
 * Fixed viewport "Back to Top" control for case study pages.
 */
export function BackToHeroButton({ heroRef, reduceMotion }) {
  const btnRef = useRef(null);

  useLayoutEffect(() => {
    const btn = btnRef.current;
    const hero = heroRef?.current;
    if (!btn || !hero) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        btn.classList.toggle("cs-back-to-hero--visible", !entry.isIntersecting);
      },
      { root: null, threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroRef]);

  if (typeof document === "undefined") return null;

  return createPortal(
    h(
      "button",
      {
        ref: btnRef,
        type: "button",
        className: "cs-back-to-hero",
        "aria-label": "Back to Top",
        onClick: () => scrollToHero({ reduceMotion }),
      },
      h(
        "span",
        { className: "cs-back-to-hero__hit" },
        h("img", {
          className: "cs-back-to-hero__icon",
          src: "/assets/icons/back-to-hero-arrow.svg",
          alt: "",
          width: 28,
          height: 28,
          decoding: "async",
          "aria-hidden": true,
        })
      )
    ),
    document.body
  );
}
