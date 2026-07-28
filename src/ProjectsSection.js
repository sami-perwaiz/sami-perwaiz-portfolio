import { createElement as h, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CASE_STUDIES, PROJECTS } from "./projectData.js";
import { saveProjectsScrollForReturn } from "./routeScroll.js";
import { isDesktopHoverEnabled } from "./hoverEffects.js";
import {
  isAboutGlassComplete,
  onAboutGlassComplete,
} from "./aboutProjectsHandoff.js";

/** Figma card preview frame — assets exported @4x (2536×1600) for Retina. */
const PREVIEW_WIDTH = 634;
const PREVIEW_HEIGHT = 400;

function ProjectCategoryMeta({ category, platform, showPlatform = false }) {
  if (!showPlatform || !platform) {
    return h("span", { className: "projects-card__category" }, category);
  }

  return h(
    "span",
    { className: "projects-card__meta" },
    h("span", { className: "projects-card__category" }, category),
    h("span", {
      className: "projects-card__meta-dot",
      "aria-hidden": true,
    }),
    h("span", { className: "projects-card__platform" }, platform)
  );
}

/**
 * Thumbnail by default. On card hover: thumbnail fades out, video plays once.
 * After the video ends, hold the last frame while still hovering.
 * On leave: reset video and restore the thumbnail.
 */
function ProjectPreview({
  item,
  eager = false,
  reduceMotion = false,
}) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [showingVideo, setShowingVideo] = useState(false);
  const showingVideoRef = useRef(false);
  const previewVideoOnly = Boolean(item.previewVideoOnly && item.previewVideo);
  const hasVideo = Boolean(item.previewVideo) && !reduceMotion;

  const seekToPreview = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }
    video.currentTime = Math.max(0, video.duration - 0.001);
    video.pause();
  };

  const showThumbnail = () => {
    const video = videoRef.current;
    if (!video) return;
    if (previewVideoOnly) {
      seekToPreview();
      showingVideoRef.current = false;
      setShowingVideo(false);
      return;
    }
    video.pause();
    video.currentTime = 0;
    showingVideoRef.current = false;
    setShowingVideo(false);
  };

  const playVideo = () => {
    if (!hasVideo) return;
    if (showingVideoRef.current && !previewVideoOnly) return;
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    showingVideoRef.current = true;
    setShowingVideo(true);
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        showingVideoRef.current = false;
        setShowingVideo(false);
        if (previewVideoOnly) seekToPreview();
      });
    }
  };

  const onEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    if (previewVideoOnly) {
      seekToPreview();
      showingVideoRef.current = false;
      setShowingVideo(false);
      return;
    }
    if (Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = video.duration;
    }
  };

  useLayoutEffect(() => {
    if (!hasVideo || previewVideoOnly) return undefined;
    const card = (wrapRef.current || videoRef.current)?.closest(".projects-card");
    if (!card) return undefined;

    const onEnter = () => {
      if (!isDesktopHoverEnabled()) return;
      playVideo();
    };
    const onLeave = () => showThumbnail();
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      showThumbnail();
    };
  }, [hasVideo, previewVideoOnly]);

  if (previewVideoOnly && hasVideo) {
    return h(
      "div",
      {
        className:
          "projects-card__preview-wrap projects-card__preview-wrap--video-only",
      },
      h("video", {
        ref: videoRef,
        className: "projects-card__preview projects-card__preview--video-only",
        src: item.previewVideo,
        muted: true,
        loop: true,
        autoPlay: true,
        playsInline: true,
        preload: "auto",
        "aria-label": `${item.name} preview`,
        tabIndex: -1,
      })
    );
  }

  if (!hasVideo) {
    return h("img", {
      className: "projects-card__preview",
      src: item.preview,
      alt: `${item.name} case study preview`,
      width: PREVIEW_WIDTH,
      height: PREVIEW_HEIGHT,
      decoding: "async",
      loading: eager ? "eager" : "lazy",
      fetchPriority: eager ? "high" : "auto",
    });
  }

  return h(
    "span",
    {
      ref: wrapRef,
      className: [
        "projects-card__preview-wrap",
        showingVideo ? "is-playing" : "",
      ]
        .filter(Boolean)
        .join(" "),
    },
    h("img", {
      className: "projects-card__preview projects-card__preview--thumb",
      src: item.preview,
      alt: `${item.name} case study preview`,
      width: PREVIEW_WIDTH,
      height: PREVIEW_HEIGHT,
      decoding: "async",
      loading: eager ? "eager" : "lazy",
      fetchPriority: eager ? "high" : "auto",
    }),
    h("video", {
      ref: videoRef,
      className: "projects-card__preview projects-card__preview--video",
      src: item.previewVideo,
      muted: true,
      loop: false,
      playsInline: true,
      preload: "auto",
      "aria-hidden": true,
      tabIndex: -1,
      onEnded,
    })
  );
}

const APPLE_SPINNER_BLADES = 12;
const APPLE_SPINNER_DURATION = 1.2;

function ProjectPendingSpinner() {
  return h(
    "span",
    {
      className:
        "projects-card__arrow projects-card__spinner projects-card__spinner--apple",
      role: "status",
      "aria-label": "Loading",
    },
    Array.from({ length: APPLE_SPINNER_BLADES }, (_, index) =>
      h("span", {
        key: index,
        className: "projects-card__spinner-blade",
        style: {
          transform: `rotate(${(360 / APPLE_SPINNER_BLADES) * index}deg)`,
          animationDelay: `${-(APPLE_SPINNER_DURATION * (1 - index / APPLE_SPINNER_BLADES))}s`,
        },
      })
    )
  );
}

function ProjectArrowIcon() {
  const arrowSrc = "/assets/projects/arrow-up-right.svg";
  return h(
    "span",
    {
      className: "projects-card__arrow",
      "aria-hidden": true,
    },
    h("img", {
      className: "projects-card__arrow-icon projects-card__arrow-icon--out",
      src: arrowSrc,
      alt: "",
      width: 24,
      height: 24,
      decoding: "async",
    }),
    h("img", {
      className: "projects-card__arrow-icon projects-card__arrow-icon--in",
      src: arrowSrc,
      alt: "",
      width: 24,
      height: 24,
      decoding: "async",
    })
  );
}

export function ProjectsSection({
  reduceMotion = false,
  onNavigate,
  // Duplicate variant: hide preview images (keeps logos + title/text/arrow).
  showThumbnails = true,
  sectionId = "projects",
  description = "Design isn't just how something looks it's how it works, how it feels, and why people choose to come back.",
}) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const markReady = () => {
      section.classList.add("projects-section--chapter-ready");
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const markPending = () => {
      section.classList.remove("projects-section--chapter-ready");
    };

    if (reduceMotion || isAboutGlassComplete()) {
      markReady();
    } else {
      onAboutGlassComplete(markReady);
    }

    window.addEventListener("about-glass-reset", markPending);
    return () => {
      window.removeEventListener("about-glass-reset", markPending);
    };
  }, [reduceMotion]);

  return h(
    "section",
    {
      ref: sectionRef,
      className: [
        "projects-section",
        showThumbnails ? null : "projects-section--compact",
      ]
        .filter(Boolean)
        .join(" "),
      id: sectionId,
      "aria-label": "Every pixel has a purpose. Every experience tells a story.",
      "data-scroll-section": sectionId,
    },
    h(
      "div",
      { className: "projects-section__inner" },
      h(
        "div",
        { className: "projects-section__header" },
        h(
          "h2",
          {
            ref: titleRef,
            className: "projects-section__title",
            "data-scroll-title": sectionId,
          },
          "Every pixel has a purpose. Every experience tells a story."
        ),
        h(
          "p",
          { className: "projects-section__desc" },
          description
        )
      ),
      h(
        "div",
        { ref: gridRef, className: "projects-section__grid" },
        ...[0, 1, 2, 3].map((row) =>
          h(
            "div",
            {
              key: `row-${row}`,
              className: "projects-section__row",
            },
            ...PROJECTS.slice(row * 2, row * 2 + 2).map((item, col) => {
              const index = row * 2 + col;
              const href = `/projects/${item.slug}`;
              const hasCaseStudy = Boolean(CASE_STUDIES[item.slug]) && !item.pending;
              const cardClassName = [
                "projects-card",
                item.pending ? "projects-card--pending" : null,
                showThumbnails ? null : "projects-card--compact",
              ]
                .filter(Boolean)
                .join(" ");
              const cardLabel = item.platform
                ? `${item.name} — ${item.category}, ${item.platform}`
                : `${item.name} — ${item.category}`;
              const content = [
                h(
                  "div",
                  { className: "projects-card__top" },
                  h(
                    "div",
                    { className: "projects-card__main" },
                    item.pending
                      ? null
                      : h("img", {
                          className: "projects-card__icon",
                          src: item.icon,
                          alt: `${item.name} logo`,
                          width: 80,
                          height: 80,
                          decoding: "async",
                          loading: "lazy",
                        }),
                    h(
                      "div",
                      { className: "projects-card__text" },
                      h(
                        "span",
                        { className: "projects-card__name" },
                        h(
                          "span",
                          { className: "projects-card__name-track" },
                          h(
                            "span",
                            { className: "projects-card__name-line" },
                            item.name
                          ),
                          h(
                            "span",
                            {
                              className: "projects-card__name-line",
                              "aria-hidden": true,
                            },
                            item.name
                          )
                        )
                      ),
                      h(ProjectCategoryMeta, {
                        category: item.category,
                        platform: item.platform,
                        showPlatform: !showThumbnails,
                      })
                    )
                  ),
                  item.pending ? h(ProjectPendingSpinner) : h(ProjectArrowIcon)
                ),
                showThumbnails
                  ? h(ProjectPreview, {
                      item,
                      eager: index < 2,
                      reduceMotion: Boolean(reduceMotion),
                    })
                  : null,
              ];

              if (!hasCaseStudy) {
                return h(
                  "div",
                  {
                    key: `${item.name}-${index}`,
                    className: cardClassName,
                    "aria-label": cardLabel,
                  },
                  ...content
                );
              }

              return h(
                Link,
                {
                  key: `${item.name}-${index}`,
                  to: href,
                  className: cardClassName,
                  "aria-label": cardLabel,
                  onClick: (event) => {
                    if (onNavigate) {
                      event.preventDefault();
                      onNavigate(href);
                      return;
                    }
                    saveProjectsScrollForReturn();
                  },
                },
                ...content
              );
            })
          )
        )
      )
    )
  );
}
