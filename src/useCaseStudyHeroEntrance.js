import { useLayoutEffect } from "react";
import gsap from "gsap";

/**
 * One-shot premium case-study hero entrance.
 * Animates opacity + translate only (no scale/size/blur on the hero image).
 */
export function useCaseStudyHeroEntrance({ heroRef, pageRef, reduceMotion, studySlug }) {
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const page = pageRef?.current;
    const shell = document.querySelector(".app-shell--case-study");
    if (!hero) return;

    const nav =
      document.querySelector(".cs-navbar") ||
      document.querySelector(".nav--case-study");
    const title = hero.querySelector(".cs-hero__title");
    const tagline = hero.querySelector(".cs-hero__tagline");
    const intro = hero.querySelector(".cs-hero__intro");
    const description = [tagline, intro].filter(Boolean);
    const metaCards = gsap.utils.toArray(hero.querySelectorAll(".cs-meta__card"));
    const thumb = hero.querySelector(".cs-hero__thumb img");
    const decorative = [
      hero.querySelector(".cs-hero__copy > .cs-tag"),
      hero.querySelector(".cs-hero__logo"),
    ].filter(Boolean);

    const animated = [nav, title, ...description, ...metaCards, thumb, ...decorative].filter(
      Boolean
    );

    const clearPending = () => {
      page?.classList.remove("cs-page--hero-pending");
      shell?.classList.remove("cs-hero-entrance-pending");
    };

    const clearAnimatedProps = () => {
      gsap.set(animated, { clearProps: "transform,opacity" });
    };

    if (reduceMotion) {
      clearPending();
      clearAnimatedProps();
      return;
    }

    page?.classList.add("cs-page--hero-pending");
    shell?.classList.add("cs-hero-entrance-pending");

    if (nav) gsap.set(nav, { y: -24, opacity: 0, force3D: true });
    if (title) gsap.set(title, { y: 40, opacity: 0, force3D: true });
    if (description.length) {
      gsap.set(description, { y: 20, opacity: 0, force3D: true });
    }
    if (metaCards.length) {
      gsap.set(metaCards, { y: 16, opacity: 0, force3D: true });
    }
    if (thumb) {
      gsap.set(thumb, {
        y: 16,
        opacity: 0,
        force3D: true,
      });
    }
    if (decorative.length) {
      gsap.set(decorative, { y: 12, opacity: 0, force3D: true });
    }

    // Reveal after initial sets so first paint isn't a flash of final state.
    clearPending();

    const titleStart = 0.12;
    const descriptionStart = titleStart + 0.12;

    const tl = gsap.timeline({
      defaults: { force3D: true },
    });

    if (nav) {
      tl.to(
        nav,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        0
      );
    }

    if (title) {
      tl.to(
        title,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
        },
        titleStart
      );
    }

    if (description.length) {
      tl.to(
        description,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.06,
        },
        descriptionStart
      );
    }

    if (metaCards.length) {
      tl.to(
        metaCards,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.08,
        },
        descriptionStart + 0.18
      );
    }

    if (thumb) {
      tl.to(
        thumb,
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
        },
        descriptionStart + 0.08
      );
    }

    if (decorative.length) {
      tl.to(
        decorative,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.06,
        },
        titleStart + 0.06
      );
    }

    return () => {
      tl.kill();
      clearPending();
      clearAnimatedProps();
    };
  }, [heroRef, pageRef, reduceMotion, studySlug]);
}
