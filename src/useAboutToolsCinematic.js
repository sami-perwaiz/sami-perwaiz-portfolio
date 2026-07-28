import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  markAboutGlassComplete,
  resetAboutGlassComplete,
  unmarkAboutGlassComplete,
} from "./aboutProjectsHandoff.js";
import { HOME_RESTORE_SYNC_EVENT } from "./scrollToHero.js";

gsap.registerPlugin(ScrollTrigger);

const BLUR_SOFT = "blur(12px)";
const BLUR_NONE = "blur(0px)";
const CHAPTER_SCRUB = true;
/** Scroll runway beyond the pinned viewport (×100vh). */
const CHAPTER_SCROLL_VH = 6.5;

const ABOUT_TITLE_RISE_DUR = 0.85;
const ABOUT_TITLE_HOLD_DUR = 0.25;
const ABOUT_MORPH_DUR = 1;
const ABOUT_MORPH_HOLD_DUR = 0.35;
const ABOUT_TITLE_EXIT_DUR = 0.5;

const CARDS_ENTER_DUR = 0.9;
const CARDS_HOLD_DUR = 0.55;
const CARD_ENTER_ITEM_DUR = 0.36;
const CARD_ENTER_STAGGER = 0.22;
const CARD_EXIT_DUR = 0.32;
const CARD_EXIT_STAGGER = 0.22;
const CHAPTER_RELEASE_DUR = 0.25;

const ABOUT_STATS_COUNT_EVENT = "about-stats-count";
const ABOUT_STATS_RESET_EVENT = "about-stats-reset";
const CHAPTER_ST_ID = "about-tools-chapter";
const COMPACT_CHAPTER_MQ = "(max-width: 1024px)";

function isCompactChapter() {
  return window.matchMedia(COMPACT_CHAPTER_MQ).matches;
}

function setMorphWords({ wordA, wordB, active = "a" }) {
  if (wordA) {
    gsap.set(wordA, {
      opacity: active === "a" ? 1 : 0,
      filter: active === "a" ? BLUR_NONE : BLUR_SOFT,
      scale: active === "a" ? 1 : 1.2,
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "center center",
      force3D: true,
    });
  }
  if (wordB) {
    gsap.set(wordB, {
      opacity: active === "b" ? 1 : 0,
      filter: active === "b" ? BLUR_NONE : BLUR_SOFT,
      scale: active === "b" ? 1 : 0.8,
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "center center",
      force3D: true,
    });
  }
}

/**
 * Scroll-scrub chapter: About title → cards → Projects.
 */
export function useAboutToolsCinematic(
  { sectionRef, trackRef, aboutTitleRef, cardsRef },
  { disabled = false } = {}
) {
  useLayoutEffect(() => {
    resetAboutGlassComplete();

    const section = sectionRef?.current;
    const track = trackRef?.current;
    const aboutTitle = aboutTitleRef?.current;
    const cards = cardsRef?.current;
    const pin = track?.querySelector(".about-section__body-pin") ?? null;

    if (!section || !track || !aboutTitle || !cards || !pin) {
      return undefined;
    }

    const aboutWords = Array.from(
      aboutTitle.querySelectorAll(".text-morph__word")
    );
    const aboutA = aboutWords[0] || null;
    const aboutB = aboutWords[1] || null;

    const intro = cards.querySelector(".about-section__intro-block");
    const stats = Array.from(cards.querySelectorAll(".about-section__stat"));
    const roles = Array.from(
      cards.querySelectorAll(
        ".about-section__role-hit, .about-section__roles > .about-section__role"
      )
    );
    const detailRules = Array.from(
      cards.querySelectorAll(".about-section__details-rule")
    );
    const sideGuides = track.querySelector(".about-section__side-guides");
    const cardTargets = [intro, ...stats, ...roles].filter(Boolean);

    const reduceMotion =
      disabled ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      section.classList.add("about-tools-chapter--reduced");
      gsap.set(
        [
          aboutTitle,
          cards,
          ...aboutWords,
          ...cardTargets,
          ...detailRules,
          ...(sideGuides ? [sideGuides] : []),
        ],
        {
          clearProps:
            "opacity,filter,transform,y,scale,visibility,willChange,height,overflow",
        }
      );
      gsap.set(cardTargets, { autoAlpha: 1 });
      gsap.set(detailRules, { opacity: 1 });
      if (sideGuides) gsap.set(sideGuides, { autoAlpha: 1 });
      markAboutGlassComplete();
      return () => {
        section.classList.remove("about-tools-chapter--reduced");
        resetAboutGlassComplete();
      };
    }

    section.classList.remove("about-tools-chapter--reduced");

    let cancelled = false;
    let started = false;
    let tl = null;
    let io = null;
    let onResize = null;
    let glassMarked = false;
    let statsCounted = false;
    let cachedCardsInset = null;
    let chapterReleased = false;

    const syncCardsLayout = ({ force = false } = {}) => {
      if (!pin || !cards) return 0;

      if (cachedCardsInset !== null && !force) {
        cards.style.setProperty("--about-body-inset", `${cachedCardsInset}px`);
        return cachedCardsInset;
      }

      const styles = getComputedStyle(pin);
      const padY =
        parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      const available = pin.clientHeight - padY;
      const cardsH = cards.offsetHeight;
      let inset = Math.max(0, Math.round((available - cardsH) / 2));
      if (isCompactChapter() && cardsH > available) {
        inset = 0;
      }
      cachedCardsInset = inset;
      cards.style.setProperty("--about-body-inset", `${inset}px`);
      return inset;
    };

    const getDetailsEl = () =>
      cards.querySelector(".about-section__details");

    const getCardsRevealOverflow = () => {
      if (!pin || !cards || !isCompactChapter()) return 0;

      const details = getDetailsEl();
      if (!details) return 0;

      const styles = getComputedStyle(pin);
      const padY =
        parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      const bodyHeightStyle = cards.style.getPropertyValue("--about-body-height");
      const clipHeight = bodyHeightStyle
        ? parseFloat(bodyHeightStyle)
        : cards.clientHeight || pin.clientHeight - padY;
      const contentHeight = details.offsetHeight;

      return Math.max(0, Math.round(contentHeight - clipHeight));
    };

    const syncCompactClipHeight = () => {
      if (!pin || !cards || !isCompactChapter()) return;

      const styles = getComputedStyle(pin);
      const padY =
        parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      const bodyHeight = Math.max(0, Math.round(pin.clientHeight - padY));
      cards.style.setProperty("--about-body-height", `${bodyHeight}px`);
    };

    const cardsEnterY = () => Math.round(window.innerHeight * 0.55);

    const cardExitRunway = () =>
      CARD_EXIT_DUR + CARD_EXIT_STAGGER * Math.max(0, cardTargets.length - 1);

    const chapterScrollDistance = () => {
      let distance = window.innerHeight * CHAPTER_SCROLL_VH;
      if (isCompactChapter()) {
        distance += getCardsRevealOverflow();
      }
      return Math.round(distance);
    };

    const markGlassOnce = () => {
      if (glassMarked || cancelled) return;
      glassMarked = true;
      markAboutGlassComplete();
    };

    const triggerStatsCount = () => {
      if (cancelled || statsCounted) return;
      statsCounted = true;
      cards.dispatchEvent(
        new CustomEvent(ABOUT_STATS_COUNT_EVENT, { bubbles: true })
      );
    };

    const titleRiseY = () => Math.round(window.innerHeight * 0.42);

    const snapInitial = () => {
      setMorphWords({ wordA: aboutA, wordB: aboutB, active: "a" });

      gsap.set(aboutTitle, {
        opacity: 0,
        y: titleRiseY(),
        visibility: "visible",
      });
      gsap.set(cards, {
        y: cardsEnterY(),
        opacity: 0,
        autoAlpha: 1,
        visibility: "visible",
      });
      gsap.set(cardTargets, {
        opacity: 0,
        scale: 0.88,
        y: 16,
        autoAlpha: 1,
      });
      gsap.set(detailRules, { opacity: 0 });
      if (sideGuides) gsap.set(sideGuides, { autoAlpha: 0 });
      const details = getDetailsEl();
      if (details) gsap.set(details, { y: 0 });
    };

    const applyScrollProgress = () => {
      const st = tl?.scrollTrigger;
      if (!st || !tl) return;
      tl.progress(st.progress, false);
    };

    const releaseChapter = () => {
      if (chapterReleased || cancelled) return;
      const st = tl?.scrollTrigger;
      if (st && st.progress < 0.985) return;

      chapterReleased = true;
      tl?.progress(1, false);
      markGlassOnce();
    };

    const restoreChapter = () => {
      if (!chapterReleased || cancelled) return;
      chapterReleased = false;
      glassMarked = false;
      unmarkAboutGlassComplete();
      applyScrollProgress();
    };

    const resetChapterToStart = () => {
      statsCounted = false;
      cards.dispatchEvent(
        new CustomEvent(ABOUT_STATS_RESET_EVENT, { bubbles: true })
      );
      tl?.progress(0, false);
    };

    const teardown = () => {
      if (onResize) window.removeEventListener("resize", onResize);
      onResize = null;
      cards.style.removeProperty("--about-body-inset");
      cards.style.removeProperty("--about-body-height");
      cachedCardsInset = null;
      chapterReleased = false;
      section.classList.remove(
        "about-tools-chapter--scroll-driven",
        "about-tools-chapter--reduced"
      );
      tl?.kill();
      tl = null;
      const details = getDetailsEl();
      gsap.set(
        [
          aboutTitle,
          cards,
          ...(details ? [details] : []),
          ...aboutWords,
          ...cardTargets,
          ...detailRules,
          ...(sideGuides ? [sideGuides] : []),
        ],
        {
          clearProps:
            "opacity,filter,transform,y,scale,visibility,willChange,height,overflow",
        }
      );
      gsap.set(cardTargets, { autoAlpha: 1 });
      resetAboutGlassComplete();
    };

    const start = () => {
      if (cancelled || started) return;
      started = true;

      snapInitial();
      section.classList.add("about-tools-chapter--scroll-driven");
      syncCardsLayout({ force: true });
      syncCompactClipHeight();

      tl = gsap.timeline({
        defaults: { ease: "none", force3D: true, overwrite: "auto" },
        scrollTrigger: {
          id: CHAPTER_ST_ID,
          trigger: track,
          start: "top top",
          end: () => `+=${chapterScrollDistance()}`,
          pin,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: CHAPTER_SCRUB,
          invalidateOnRefresh: true,
          onEnter: applyScrollProgress,
          onRefresh: applyScrollProgress,
          onUpdate: (self) => {
            if (self.direction > 0 && self.progress >= 0.998) {
              releaseChapter();
            }
          },
          onLeave: (self) => {
            if (self.progress >= 0.985) releaseChapter();
          },
          onEnterBack: restoreChapter,
          onLeaveBack: () => {
            if (chapterReleased) restoreChapter();
            resetChapterToStart();
          },
        },
      });

      tl.to(aboutTitle, {
        y: 0,
        opacity: 1,
        duration: ABOUT_TITLE_RISE_DUR,
        ease: "power3.out",
      });
      tl.to({}, { duration: ABOUT_TITLE_HOLD_DUR });

      if (aboutA && aboutB) {
        tl.to(
          aboutA,
          {
            opacity: 0,
            filter: BLUR_SOFT,
            scale: 1.2,
            duration: ABOUT_MORPH_DUR,
          },
          "aboutMorph"
        );
        tl.to(
          aboutB,
          {
            opacity: 1,
            filter: BLUR_NONE,
            scale: 1,
            duration: ABOUT_MORPH_DUR,
          },
          "aboutMorph"
        );
        tl.to({}, { duration: ABOUT_MORPH_HOLD_DUR });
        tl.to(aboutB, {
          opacity: 0,
          filter: BLUR_SOFT,
          scale: 1.05,
          duration: ABOUT_TITLE_EXIT_DUR,
        });
        tl.to(
          aboutTitle,
          { opacity: 0, duration: ABOUT_TITLE_EXIT_DUR * 0.65 },
          "<0.15"
        );
      }

      tl.addLabel("cardEnter", "-=0.12");
      tl.to(
        cards,
        {
          y: 0,
          opacity: 1,
          duration: CARDS_ENTER_DUR * 0.42,
          ease: "power3.out",
          roundProps: "y",
        },
        "cardEnter"
      );

      const cardEnterTween = {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: CARD_ENTER_ITEM_DUR,
        ease: "power2.out",
      };

      const ruleEnterTween = {
        opacity: 1,
        duration: CARD_ENTER_ITEM_DUR,
        ease: "power2.out",
      };

      const cardEnterOffset = (step) =>
        CARDS_ENTER_DUR * 0.12 + CARD_ENTER_STAGGER * step;

      const introEnterAt = `cardEnter+=${cardEnterOffset(0)}`;
      if (intro) {
        tl.to(intro, cardEnterTween, introEnterAt);
      }
      if (detailRules[0]) {
        tl.to(detailRules[0], ruleEnterTween, introEnterAt);
      }
      if (detailRules[1]) {
        tl.to(detailRules[1], ruleEnterTween, introEnterAt);
      }
      if (sideGuides) {
        tl.to(
          sideGuides,
          {
            autoAlpha: 1,
            duration: CARDS_ENTER_DUR * 0.75,
            ease: "power2.out",
          },
          introEnterAt
        );
      }

      stats.forEach((stat, index) => {
        const at = `cardEnter+=${cardEnterOffset(index + 1)}`;
        tl.to(stat, cardEnterTween, at);
        if (index === stats.length - 1 && detailRules[2]) {
          tl.to(detailRules[2], ruleEnterTween, at);
        }
      });

      roles.forEach((role, index) => {
        const at = `cardEnter+=${cardEnterOffset(stats.length + 1 + index)}`;
        tl.to(role, cardEnterTween, at);
        if (index === roles.length - 1 && detailRules[3]) {
          tl.to(detailRules[3], ruleEnterTween, at);
        }
      });

      tl.call(
        triggerStatsCount,
        null,
        `cardEnter+=${cardEnterOffset(stats.length)}`
      );

      const holdStart =
        cardEnterOffset(stats.length + roles.length) + CARD_ENTER_ITEM_DUR;
      const details = getDetailsEl();
      const cardsOverflow = getCardsRevealOverflow();
      const revealScrollDur =
        cardsOverflow > 0
          ? Math.max(0.85, (cardsOverflow / window.innerHeight) * 1.05)
          : 0;
      let holdCursor = holdStart;

      if (cardsOverflow > 0 && details) {
        tl.to(
          details,
          {
            y: -cardsOverflow,
            duration: revealScrollDur,
            ease: "none",
          },
          `cardEnter+=${holdCursor}`
        );
        holdCursor += revealScrollDur;
      }

      tl.to({}, { duration: CARDS_HOLD_DUR }, `cardEnter+=${holdCursor}`);
      holdCursor += CARDS_HOLD_DUR;

      tl.addLabel("cardExit", `cardEnter+=${holdCursor}`);

      const cardExitTween = {
        opacity: 0,
        scale: 0.88,
        duration: CARD_EXIT_DUR,
        ease: "power2.inOut",
      };

      const ruleExitTween = {
        opacity: 0,
        duration: CARD_EXIT_DUR,
        ease: "power2.inOut",
      };

      if (intro) {
        tl.to(intro, cardExitTween, "cardExit");
      }
      if (detailRules[0]) {
        tl.to(detailRules[0], ruleExitTween, "cardExit");
      }
      if (detailRules[1]) {
        tl.to(detailRules[1], ruleExitTween, "cardExit");
      }
      if (sideGuides) {
        tl.to(
          sideGuides,
          {
            autoAlpha: 0,
            duration: cardExitRunway(),
            ease: "power2.inOut",
          },
          "cardExit"
        );
      }

      stats.forEach((stat, index) => {
        const at = `cardExit+=${CARD_EXIT_STAGGER * (index + 1)}`;
        tl.to(stat, cardExitTween, at);
        if (index === stats.length - 1 && detailRules[2]) {
          tl.to(detailRules[2], ruleExitTween, at);
        }
      });

      roles.forEach((role, index) => {
        const at = `cardExit+=${CARD_EXIT_STAGGER * (stats.length + 1 + index)}`;
        tl.to(role, cardExitTween, at);
        if (index === roles.length - 1 && detailRules[3]) {
          tl.to(detailRules[3], ruleExitTween, at);
        }
      });

      tl.to(
        cards,
        {
          autoAlpha: 0,
          duration: 0.01,
        },
        `cardExit+=${cardExitRunway()}`
      );

      tl.to({}, { duration: CHAPTER_RELEASE_DUR }, `cardExit+=${cardExitRunway()}`);
      tl.addLabel("chapterEnd");

      onResize = () => {
        if (cancelled) return;
        cachedCardsInset = null;
        syncCardsLayout({ force: true });
        syncCompactClipHeight();
        ScrollTrigger.refresh(true);
        applyScrollProgress();
      };
      window.addEventListener("resize", onResize);

      ScrollTrigger.refresh();
      applyScrollProgress();
      requestAnimationFrame(() => {
        if (cancelled || !tl) return;
        syncCompactClipHeight();
        ScrollTrigger.refresh();
        applyScrollProgress();
      });
    };

    const onHomeRestoreSync = () => {
      if (cancelled) return;
      if (!started) {
        start();
      }
      if (!tl) return;

      const st = tl.scrollTrigger;
      if (!st) return;

      syncCompactClipHeight();
      ScrollTrigger.refresh();
      if (st.progress >= 0.985) {
        chapterReleased = true;
        markGlassOnce();
        tl.progress(1, false);
        return;
      }

      chapterReleased = false;
      applyScrollProgress();
    };

    window.addEventListener(HOME_RESTORE_SYNC_EVENT, onHomeRestoreSync);

    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            start();
            io?.disconnect();
            io = null;
          }
        },
        { rootMargin: "120% 0px", threshold: 0 }
      );
      io.observe(track);

      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh * 2.2 && rect.bottom > -vh * 0.5) {
        start();
        io?.disconnect();
        io = null;
      }
    } else {
      start();
    }

    return () => {
      cancelled = true;
      window.removeEventListener(HOME_RESTORE_SYNC_EVENT, onHomeRestoreSync);
      io?.disconnect();
      teardown();
    };
  }, [sectionRef, trackRef, aboutTitleRef, cardsRef, disabled]);
}

/** Exported for nav visibility sync in AboutSection. */
export {
  CHAPTER_SCROLL_VH,
  CARD_EXIT_DUR,
  CARD_EXIT_STAGGER,
  CHAPTER_ST_ID,
};
