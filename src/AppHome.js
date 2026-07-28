import {
  createElement as h,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "./Hero.jsx";
import { isDesktopHoverEnabled } from "./hoverEffects.js";

gsap.registerPlugin(ScrollTrigger);

/** Figma selected-work cards — 648×472 display, assets exported @4x (2592×1888). */
const WORK_IMAGE_WIDTH = 2592;
const WORK_IMAGE_HEIGHT = 1888;

const WORK_ITEMS = [
  {
    src: "/assets/work/work-1.png",
    alt: "Build Smarter with AI-Driven Innovation",
  },
  {
    src: "/assets/work/work-2.png",
    alt: "Transform Your Business with Intelligent AI Solutions",
  },
  {
    src: "/assets/work/work-3.png",
    alt: "Build Faster with AI-Powered Intelligence",
  },
  {
    src: "/assets/work/work-4.png",
    alt: "Empower Your Business with Next-Generation AI Innovation",
  },
  {
    src: "/assets/work/work-5.png",
    alt: "Redefining Everyday Simplicity",
  },
  {
    src: "/assets/work/work-6.png",
    alt: "Redefining Visual Storytelling",
  },
  {
    src: "/assets/work/work-7.png",
    alt: "Bespoke Cakes for Every Celebration",
  },
  {
    src: "/assets/work/work-8.png",
    alt: "Visual Gallery photography portfolio",
  },
  {
    src: "/assets/work/work-9.png",
    alt: "User portal login experience",
  },
  {
    src: "/assets/work/work-10.png",
    alt: "Hire world-class talent in 3 simple steps",
  },
  {
    type: "video",
    src: "/assets/work/work-11.mp4",
    poster: "/assets/work/work-11.png",
    alt: "Projects folder — purple glassmorphism UI",
  },
  {
    src: "/assets/work/work-12.png",
    alt: "Projects folder — teal glassmorphism UI",
  },
  {
    src: "/assets/work/work-13.png",
    alt: "3D sphere wireframe to render",
  },
  {
    type: "video",
    src: "/assets/work/work-14.mp4",
    poster: "/assets/work/work-14.png",
    alt: "Floating design toolbar",
  },
];
const WORK_REVEAL_DURATION = 0.95;
const WORK_REVEAL_EASE = "power4.out";

let selectedWorkRevealPlayed = false;

/** Warm the first tiles during hero entrance so first scroll stays smooth. */
export function preloadSelectedWorkAssets() {
  if (typeof window === "undefined") return;

  WORK_ITEMS.slice(0, 8).forEach((item) => {
    const src = item.poster || item.src;
    if (!src || /\.mp4$/i.test(src)) return;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  });
}

function clearWorkRevealProps(els) {
  const list = (Array.isArray(els) ? els : [els]).filter(Boolean);
  if (!list.length) return;
  // Leave opacity/transform at final values — clearing them mid-view flickers
  // compositor layers (especially under Lenis + image tiles).
  gsap.set(list, {
    clearProps: "willChange",
  });
}

/**
 * Viewport reveal for Selected Work title only.
 * Images stay static — no entrance animation on tiles.
 */
function useSelectedWorkBlurReveal(
  sectionRef,
  titleRef,
  { disabled = false } = {}
) {
  useLayoutEffect(() => {
    const section = sectionRef?.current;
    const title = titleRef?.current;
    if (!section || !title || disabled) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      clearWorkRevealProps(title);
      return undefined;
    }

    let cancelled = false;
    let played = false;
    let st = null;
    let tl = null;

    gsap.set(title, {
      opacity: 0,
      y: 20,
      force3D: true,
      willChange: "transform, opacity",
    });

    const play = () => {
      if (cancelled || played || selectedWorkRevealPlayed) return;
      played = true;
      selectedWorkRevealPlayed = true;

      tl = gsap.timeline({
        defaults: { ease: WORK_REVEAL_EASE, force3D: true },
        onComplete: () => {
          clearWorkRevealProps(title);
        },
      });

      tl.to(title, {
        opacity: 1,
        y: 0,
        duration: WORK_REVEAL_DURATION,
      });
    };

    st = ScrollTrigger.create({
      id: "selected-work-blur-reveal",
      trigger: section,
      start: "1% bottom",
      once: true,
      onEnter: play,
      refreshPriority: -1,
    });

    requestAnimationFrame(() => {
      if (cancelled || selectedWorkRevealPlayed) return;
      if (st && typeof st.start === "number" && st.scroll() >= st.start) {
        play();
      }
    });

    return () => {
      cancelled = true;
      st?.kill();
      tl?.kill();
      if (!selectedWorkRevealPlayed) {
        gsap.set(title, { opacity: 1, y: 0, clearProps: "willChange" });
      }
    };
  }, [sectionRef, titleRef, disabled]);
}

function WorkVideoCard({ item, reduceMotion = false }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const hoverActiveRef = useRef(false);
  const playingRef = useRef(false);
  const poster = item.poster || item.src.replace(/\.mp4$/i, ".png");

  const seekToPreview = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }
    video.currentTime = Math.max(0, video.duration - 0.001);
    playingRef.current = false;
    setPlaying(false);
  };

  const showPreviewFrame = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    seekToPreview();
  };

  const playFromStart = () => {
    if (reduceMotion) return;
    const video = videoRef.current;
    if (!video) return;
    playingRef.current = true;

    const start = () => {
      video.currentTime = 0;
      setPlaying(true);
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          playingRef.current = false;
          setPlaying(false);
          showPreviewFrame();
        });
      }
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      start();
      return;
    }

    const onReady = () => {
      video.removeEventListener("loadeddata", onReady);
      if (hoverActiveRef.current || playingRef.current) start();
    };
    video.addEventListener("loadeddata", onReady);
  };

  const onEnded = () => {
    seekToPreview();
  };

  useLayoutEffect(() => {
    if (reduceMotion) return undefined;
    const card = cardRef.current;
    if (!card) return undefined;

    if (isDesktopHoverEnabled()) {
      const onEnter = () => {
        if (hoverActiveRef.current) return;
        hoverActiveRef.current = true;
        playFromStart();
      };

      const onLeave = () => {
        hoverActiveRef.current = false;
        showPreviewFrame();
      };

      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
        hoverActiveRef.current = false;
        showPreviewFrame();
      };
    }

    const onTap = () => {
      const video = videoRef.current;
      if (!video) return;
      if (!video.paused && playingRef.current) return;
      playFromStart();
    };

    card.addEventListener("click", onTap);
    return () => {
      card.removeEventListener("click", onTap);
      playingRef.current = false;
      showPreviewFrame();
    };
  }, [reduceMotion]);

  return h(
    "figure",
    {
      ref: cardRef,
      className: [
        "work-item",
        "work-item--video",
        playing ? "is-playing" : "",
      ]
        .filter(Boolean)
        .join(" "),
      "aria-label": item.alt,
    },
    h(
      "div",
      { className: "work-item__media" },
      h("video", {
        ref: videoRef,
        className: "work-item__photo work-item__video",
        src: item.src,
        poster,
        width: WORK_IMAGE_WIDTH,
        height: WORK_IMAGE_HEIGHT,
        muted: true,
        loop: false,
        playsInline: true,
        preload: "auto",
        "aria-hidden": true,
        tabIndex: -1,
        onLoadedMetadata: seekToPreview,
        onLoadedData: seekToPreview,
        onEnded,
      })
    ),
    h(
      "span",
      {
        className: "work-item__play",
        "aria-hidden": true,
      },
      h("img", {
        className: "work-item__play-icon",
        src: "/assets/work/player-play.svg",
        alt: "",
        width: 24,
        height: 24,
        decoding: "async",
        draggable: false,
      })
    )
  );
}

function SelectedWork({ reduceMotion = false }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  useSelectedWorkBlurReveal(sectionRef, titleRef, {
    disabled: Boolean(reduceMotion),
  });

  return h(
    "section",
    {
      ref: sectionRef,
      className: "selected-work",
      "aria-label": "Selected work",
      "data-scroll-section": "selected-work",
    },
    h(
      "div",
      { className: "selected-work__side-guides", "aria-hidden": true },
      h("span", {
        className:
          "selected-work__side-guide selected-work__side-guide--left",
      }),
      h("span", {
        className:
          "selected-work__side-guide selected-work__side-guide--right",
      })
    ),
    h("hr", { className: "selected-work__rule", "aria-hidden": true }),
    h(
      "h2",
      { ref: titleRef, className: "selected-work__title" },
      "Where Ideas Take Shape"
    ),
    h("hr", { className: "selected-work__rule", "aria-hidden": true }),
    h(
      "div",
      { ref: gridRef, className: "selected-work__grid" },
      ...WORK_ITEMS.map((item, index) => {
        if (item.type === "video") {
          return h(WorkVideoCard, {
            key: `work-video-${index}`,
            item,
            reduceMotion,
          });
        }

        return h(
          "figure",
          {
            key: item.src,
            className: "work-item",
          },
          h(
            "div",
            { className: "work-item__media" },
            h("img", {
              className: "work-item__photo",
              src: item.src,
              alt: item.alt,
              width: WORK_IMAGE_WIDTH,
              height: WORK_IMAGE_HEIGHT,
              loading: index < 4 ? "eager" : "lazy",
              decoding: "async",
              fetchPriority: index < 2 ? "high" : "low",
            })
          )
        );
      })
    ),
    h("hr", { className: "selected-work__rule", "aria-hidden": true })
  );
}
export { Hero, SelectedWork };
