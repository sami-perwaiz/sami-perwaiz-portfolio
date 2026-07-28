import {
  createElement as h,
  useLayoutEffect,
  useRef,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ToolsGrid } from "./ToolsGrid.js";

gsap.registerPlugin(ScrollTrigger);

const EASE = "power4.out";
const DURATION = 0.8;
const BLUR_FROM = "blur(16px)";
const BLUR_TO = "blur(0px)";

let toolkitRevealPlayed = false;

export function resetToolkitReveal() {
  toolkitRevealPlayed = false;
}

function clearRevealProps(els) {
  const list = (Array.isArray(els) ? els : [els]).filter(Boolean);
  if (!list.length) return;
  gsap.set(list, {
    clearProps: "opacity,transform,filter,visibility,willChange",
  });
}

function hideBlurred(el) {
  if (!el) return;
  gsap.set(el, {
    opacity: 0,
    y: 24,
    filter: BLUR_FROM,
    force3D: true,
    willChange: "transform, opacity, filter",
  });
}

const TOOLKIT_TITLE = "The Tools Behind the Process";
const TOOLKIT_DESCRIPTION =
  "Every tool has a purpose. Together, they support a workflow focused on clarity, collaboration, and creating exceptional product experiences.";

function useToolkitBlurReveal(
  sectionRef,
  titleRef,
  gridRef,
  { disabled = false } = {}
) {
  useLayoutEffect(() => {
    const section = sectionRef?.current;
    const title = titleRef?.current;
    const grid = gridRef?.current;
    if (!section || disabled) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const desc = section.querySelector(".toolkit-section__desc");
    const headerTargets = [title, desc].filter(Boolean);
    const items = grid
      ? Array.from(grid.querySelectorAll(".tools-section__item"))
      : [];
    const revealTargets = [...headerTargets, ...items];

    if (reduceMotion) {
      clearRevealProps(revealTargets);
      return undefined;
    }

    if (toolkitRevealPlayed) {
      clearRevealProps(revealTargets);
      return undefined;
    }

    let cancelled = false;
    let played = false;
    let st = null;
    let tl = null;

    revealTargets.forEach(hideBlurred);

    const play = () => {
      if (cancelled || played) return;
      if (toolkitRevealPlayed) {
        clearRevealProps(revealTargets);
        played = true;
        return;
      }
      played = true;
      st?.kill();

      tl = gsap.timeline({
        defaults: { ease: EASE, force3D: true },
        onComplete: () => {
          toolkitRevealPlayed = true;
          clearRevealProps(revealTargets);
        },
      });

      if (headerTargets.length) {
        tl.to(headerTargets, {
          opacity: 1,
          y: 0,
          filter: BLUR_TO,
          duration: DURATION,
        });
      }

      if (items.length) {
        tl.to(
          items,
          {
            opacity: 1,
            y: 0,
            filter: BLUR_TO,
            duration: DURATION,
            stagger: 0.08,
          },
          headerTargets.length ? "-=0.45" : 0
        );
      }
    };

    st = ScrollTrigger.create({
      id: "toolkit-blur-reveal",
      trigger: section,
      start: "20% bottom",
      once: true,
      onEnter: play,
      refreshPriority: -1,
    });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (cancelled || toolkitRevealPlayed) {
        if (toolkitRevealPlayed) {
          clearRevealProps(revealTargets);
        }
        return;
      }
      if (st && typeof st.start === "number" && st.scroll() >= st.start) {
        play();
      }
    });

    return () => {
      cancelled = true;
      st?.kill();
      tl?.kill();
      if (!toolkitRevealPlayed) clearRevealProps(revealTargets);
    };
  }, [sectionRef, titleRef, gridRef, disabled]);
}

/**
 * Standalone tools grid — visible after Services with scroll blur reveal.
 */
export function ToolkitSection({ reduceMotion = false }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  useToolkitBlurReveal(sectionRef, titleRef, gridRef, {
    disabled: Boolean(reduceMotion),
  });

  return h(
    "section",
    {
      ref: sectionRef,
      className: "toolkit-section",
      id: "toolkit",
      "aria-label": TOOLKIT_TITLE,
      "data-scroll-section": "toolkit",
    },
    h(
      "div",
      { className: "toolkit-section__inner" },
      h(
        "div",
        { className: "toolkit-section__header" },
        h(
          "h2",
          {
            ref: titleRef,
            className: "toolkit-section__title",
            "data-scroll-title": "toolkit",
          },
          TOOLKIT_TITLE
        ),
        h("p", { className: "toolkit-section__desc" }, TOOLKIT_DESCRIPTION)
      ),
      h(
        "div",
        {
          ref: gridRef,
          className: "tools-section__grid",
          role: "list",
          "aria-label": "Design and product tools",
        },
        h(ToolsGrid)
      )
    )
  );
}
