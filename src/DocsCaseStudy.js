import { createElement as h, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useCaseStudyDocsEntrance } from "./useCaseStudyDocsEntrance.js";
import { getLenis, initSmoothScroll } from "./smoothScroll.js";
import { isDesktopHoverEnabled } from "./hoverEffects.js";

/** power4.inOut — matches scrollToHero programmatic scroll feel. */
const POWER4_IN_OUT = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

const DOCS_ARROW_PATH =
  "M3.70719 11.7072V6.37386H1.31653C1.18469 6.37383 1.05583 6.33472 0.946219 6.26146C0.836613 6.1882 0.751186 6.08409 0.70074 5.96229C0.650293 5.84049 0.637091 5.70647 0.662803 5.57717C0.688514 5.44787 0.751985 5.32909 0.845192 5.23586L5.23586 0.845191C5.36088 0.72021 5.53042 0.65 5.70719 0.65C5.88397 0.65 6.05351 0.72021 6.17852 0.845191L10.5692 5.23586C10.6624 5.32909 10.7259 5.44787 10.7516 5.57717C10.7773 5.70647 10.7641 5.84049 10.7136 5.96229C10.6632 6.08409 10.5778 6.1882 10.4682 6.26146C10.3586 6.33472 10.2297 6.37383 10.0979 6.37386H7.70719V11.7072C7.70719 11.884 7.63695 12.0536 7.51193 12.1786C7.38691 12.3036 7.21734 12.3739 7.04053 12.3739H4.37386C4.19705 12.3739 4.02748 12.3036 3.90245 12.1786C3.77743 12.0536 3.70719 11.884 3.70719 11.7072Z";

function DocsArrowGraphic() {
  return h(
    "svg",
    {
      className: "cs-docs__nav-btn-arrow",
      viewBox: "0 0 11.4144 13.0239",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": true,
    },
    h("path", {
      d: DOCS_ARROW_PATH,
      stroke: "currentColor",
      strokeWidth: 1.3,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  );
}

function DocsNavIcon({ direction = "up" }) {
  const rotateClass =
    direction === "left" ? "cs-docs__nav-btn-icon-rotate--left" : "";

  return h(
    "span",
    {
      className: "cs-docs__nav-btn-icon",
      "aria-hidden": true,
    },
    h(
      "span",
      {
        className: ["cs-docs__nav-btn-icon-rotate", rotateClass]
          .filter(Boolean)
          .join(" "),
      },
      h(
        "span",
        { className: "cs-docs__nav-btn-icon-graphic" },
        h(DocsArrowGraphic)
      )
    )
  );
}

function DocsSplitLabel({ muted, emphasis }) {
  return h(
    "span",
    { className: "cs-docs__nav-btn-label" },
    h("span", { className: "cs-docs__nav-btn-label-muted" }, muted),
    h("span", { className: "cs-docs__nav-btn-label-emphasis" }, emphasis)
  );
}

function getDocsAsset(study) {
  return study.docsAsset || `/assets/projects/case-study/${study.slug}/figma/docs`;
}

function scrollDocsToTop(reduceMotion) {
  const motionOff = Boolean(reduceMotion);
  const lenis = motionOff ? null : getLenis() || initSmoothScroll();

  if (lenis) {
    lenis.scrollTo("top", {
      offset: 0,
      immediate: motionOff,
      duration: motionOff ? undefined : 0.9,
      easing: motionOff ? undefined : POWER4_IN_OUT,
      lock: false,
      force: true,
      programmatic: true,
    });
    return;
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: motionOff ? "auto" : "smooth",
  });
}

function DocsParagraphs({ paragraphs }) {
  return paragraphs.map((text, index) =>
    h("p", { key: index, className: "cs-docs__p" }, text)
  );
}

function DocsProse({ paragraphs }) {
  return h("div", { className: "cs-docs__prose" }, h(DocsParagraphs, { paragraphs }));
}

function DocsMetaGrid({ items }) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return h(
    "div",
    { className: "cs-docs__meta" },
    ...rows.map((row, index) =>
      h(
        "div",
        { key: index, className: "cs-docs__meta-row" },
        ...row.map((item) =>
          h(
            "div",
            { key: item.label, className: "cs-docs__meta-card" },
            h("p", { className: "cs-docs__meta-label" }, item.label),
            h("p", { className: "cs-docs__meta-value" }, item.value)
          )
        )
      )
    )
  );
}

function DocsCardGrid({ cards }) {
  const rows = [];
  for (let i = 0; i < cards.length; i += 2) {
    rows.push(cards.slice(i, i + 2));
  }
  return h(
    "div",
    { className: "cs-docs__card-grid" },
    ...rows.map((row, index) =>
      h(
        "div",
        { key: index, className: "cs-docs__card-row" },
        ...row.map((card) =>
          h(
            "article",
            { key: card.title, className: "cs-docs__card" },
            h("h3", { className: "cs-docs__card-title" }, card.title),
            h("p", { className: "cs-docs__card-body" }, card.body)
          )
        )
      )
    )
  );
}

function DocsBenefitCard({ title, intro, items }) {
  return h(
    "article",
    { className: "cs-docs__benefit" },
    h(
      "div",
      { className: "cs-docs__benefit-header" },
      h("h3", { className: "cs-docs__benefit-title" }, title),
      h("p", { className: "cs-docs__benefit-intro" }, intro)
    ),
    h(
      "div",
      { className: "cs-docs__benefit-items" },
      ...items.map((item) =>
        h(
          "div",
          { key: item.title, className: "cs-docs__benefit-item" },
          h("p", { className: "cs-docs__benefit-item-title" }, item.title),
          h("p", { className: "cs-docs__benefit-item-body" }, item.body)
        )
      )
    )
  );
}

function docsAssetUrl(assetBase, fileName, cacheKey) {
  const q = cacheKey ? `?v=${cacheKey}` : "";
  return `${assetBase}/${fileName}${q}`;
}

function docsWebpVariants(assetBase, pngFile, cacheKey) {
  if (!/\.png$/i.test(pngFile)) return null;
  const base = pngFile.replace(/\.png$/i, "");
  const q = cacheKey ? `?v=${cacheKey}` : "";
  return {
    full: `${assetBase}/${base}.webp${q}`,
    w480: `${assetBase}/${base}-480.webp${q}`,
    w768: `${assetBase}/${base}-768.webp${q}`,
  };
}

function DocsImg({ assetBase, file, alt, width, height, className, cacheKey }) {
  const pngSrc = docsAssetUrl(assetBase, file, cacheKey);
  const webp = docsWebpVariants(assetBase, file, cacheKey);
  const imgProps = {
    className,
    alt,
    width,
    ...(height != null ? { height } : {}),
    loading: "lazy",
    decoding: "async",
    fetchPriority: "low",
  };

  if (!webp) {
    return h("img", { ...imgProps, src: pngSrc });
  }

  const srcSet = [
    `${webp.w480} 480w`,
    `${webp.w768} 768w`,
    `${webp.full} ${width || 1472}w`,
  ].join(", ");

  return h(
    "picture",
    null,
    h("source", {
      type: "image/webp",
      srcSet,
      sizes: "(max-width: 767px) min(92vw, 480px), (max-width: 1024px) min(92vw, 768px), 736px",
    }),
    h("img", { ...imgProps, src: pngSrc })
  );
}

function DocsVideoPlayIcon() {
  return h(
    "svg",
    {
      className: "cs-docs-showcase__video-play-icon",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": true,
    },
    h(
      "g",
      { transform: "translate(6, 3)" },
      h("path", {
        d: "M0 1.00028V17.0003C0 17.1782 0.0473748 17.3529 0.137382 17.5064C0.227388 17.6599 0.356717 17.7866 0.512024 17.8734C0.667332 17.9602 0.842993 18.0041 1.02088 18.0003C1.19878 17.9966 1.37245 17.9455 1.524 17.8523L14.524 9.85228C14.6696 9.76281 14.7898 9.63752 14.8733 9.48837C14.9567 9.33922 15 9.17117 15 9.00028C15 8.82939 14.9567 8.66135 14.8733 8.51219C14.7898 8.36304 14.6696 8.23775 14.524 8.14828L1.524 0.148282C1.37245 0.0550465 1.19878 0.00393412 1.02088 0.000218156C0.842993 0 0.667332 0.0403172 0.512024 0.127143C0.356717 0.213968 0.227388 0.340659 0.137382 0.494145C0.0473748 0.647631 0 0.822352 0 1.00028Z",
        fill: "white",
      })
    )
  );
}

function DocsVideoPauseIcon() {
  return h(
    "svg",
    {
      className: "cs-docs-showcase__video-play-icon",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": true,
    },
    h(
      "g",
      { transform: "translate(5, 4)" },
      h("path", {
        d: "M4 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V14C0 14.5304 0.210714 15.0391 0.585786 15.4142C0.960859 15.7893 1.46957 16 2 16H4C4.53043 16 5.03914 15.7893 5.41421 15.4142C5.78929 15.0391 6 14.5304 6 14V2C6 1.46957 5.78929 0.960859 5.41421 0.585786C5.03914 0.210714 4.53043 0 4 0Z",
        fill: "white",
      }),
      h("path", {
        d: "M12 0H10C9.46957 0 8.96086 0.210714 8.58579 0.585786C8.21071 0.960859 8 1.46957 8 2V14C8 14.5304 8.21071 15.0391 8.58579 15.4142C8.96086 15.7893 9.46957 16 10 16H12C12.5304 16 13.0391 15.7893 13.4142 15.4142C13.7893 15.0391 14 14.5304 14 14V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0Z",
        fill: "white",
      })
    )
  );
}

function DocsVideoReplayIcon() {
  return h(
    "svg",
    {
      className: "cs-docs-showcase__video-play-icon",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": true,
    },
    h("path", {
      d: "M19.933 13.041C19.7442 14.481 19.1669 15.8423 18.2632 16.9792C17.3594 18.116 16.1633 18.9854 14.803 19.494C13.4427 20.0027 11.9696 20.1315 10.5417 19.8666C9.11374 19.6017 7.78486 18.9531 6.69755 17.9903C5.61024 17.0276 4.80551 15.787 4.36967 14.4016C3.93383 13.0163 3.88332 11.5385 4.22355 10.1266C4.56379 8.71472 5.28194 7.4221 6.30097 6.38736C7.32001 5.35261 8.6015 4.61478 10.008 4.253C13.907 3.253 17.943 5.26 19.433 9",
      stroke: "white",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
    h("path", {
      d: "M20 4V9H15",
      stroke: "white",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  );
}

function DocsVideoPlayer({
  assetBase,
  file,
  poster,
  alt,
  layout = "phone",
  previewAtEnd = false,
  cacheKey,
  loop = true,
  replayOnEnd = false,
  flashControls = false,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const flashTimeoutRef = useRef(null);
  const pendingPlayRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [previewReady, setPreviewReady] = useState(!previewAtEnd);
  const [controlFlash, setControlFlash] = useState(null);
  const [flashOverlayVisible, setFlashOverlayVisible] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const isFullBleed = layout === "full";
  const baseFile = file.replace(/\.(mov|mp4)$/i, "");
  const videoQuery = cacheKey ? `?v=${cacheKey}` : "";
  const mp4Src = `${assetBase}/${baseFile}.mp4${videoQuery}`;
  const movSrc = `${assetBase}/${baseFile}.mov${videoQuery}`;
  const controlHoldMs = 480;
  const controlFadeMs = 420;

  const seekToPreview = (video) => {
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.max(0, video.duration - 1);
  };

  const clearControlFlash = () => {
    if (flashTimeoutRef.current) {
      clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = null;
    }
    setFlashOverlayVisible(false);
    setControlFlash(null);
  };

  const flashControl = (type) => {
    if (!flashControls) return;
    clearControlFlash();
    setControlFlash(type);
    setFlashOverlayVisible(true);
    flashTimeoutRef.current = setTimeout(() => {
      setFlashOverlayVisible(false);
      flashTimeoutRef.current = setTimeout(() => {
        setControlFlash(null);
        flashTimeoutRef.current = null;
      }, controlFadeMs);
    }, controlHoldMs);
  };

  const preparePreview = () => {
    if (!previewAtEnd || playing || hasStarted || hasEnded) return;

    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    const onSeeked = () => {
      video.pause();
      setPreviewReady(true);
      video.removeEventListener("seeked", onSeeked);
    };

    video.addEventListener("seeked", onSeeked);
    seekToPreview(video);
  };

  useEffect(() => {
    if (shouldLoadVideo) return undefined;

    const el = containerRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoadVideo]);

  useEffect(() => {
    if (!previewAtEnd) return undefined;

    setPreviewReady(false);
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return undefined;

    if (video.readyState >= 1) {
      preparePreview();
    }

    return undefined;
  }, [previewAtEnd, shouldLoadVideo]);

  useEffect(() => {
    return () => {
      clearControlFlash();
    };
  }, []);

  useEffect(() => {
    const stopVideo = () => {
      const video = videoRef.current;
      if (!video) return;

      clearControlFlash();
      video.pause();
      video.loop = false;
      if (previewAtEnd && Number.isFinite(video.duration)) {
        seekToPreview(video);
      } else {
        video.currentTime = 0;
      }
      setHasStarted(false);
      setHasEnded(false);
      setPlaying(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stopVideo();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", stopVideo);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", stopVideo);
      stopVideo();
    };
  }, [previewAtEnd, shouldLoadVideo]);

  const startPlayback = ({ fromStart = false } = {}) => {
    const isFirstPlay = !hasStarted || fromStart;
    if (isFirstPlay) {
      setHasStarted(true);
      setHasEnded(false);
    }
    setPlaying(true);
    flashControl("play");

    requestAnimationFrame(() => {
      const video = videoRef.current;
      if (!video) return;
      video.muted = false;
      video.loop = loop;
      if (isFirstPlay) video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          setPlaying(false);
          clearControlFlash();
          if (isFirstPlay) {
            setHasStarted(false);
            setHasEnded(false);
          }
        });
      }
    });
  };

  useEffect(() => {
    if (!shouldLoadVideo || !pendingPlayRef.current) return undefined;

    const pending = pendingPlayRef.current;
    pendingPlayRef.current = null;
    const video = videoRef.current;
    if (!video) return undefined;

    const run = () => startPlayback(pending);
    if (video.readyState >= 2) {
      run();
      return undefined;
    }

    video.addEventListener("canplay", run, { once: true });
    return () => video.removeEventListener("canplay", run);
  }, [shouldLoadVideo, hasStarted, loop]);

  const playVideo = ({ fromStart = false } = {}) => {
    if (!shouldLoadVideo) {
      pendingPlayRef.current = { fromStart };
      setShouldLoadVideo(true);
      return;
    }
    startPlayback({ fromStart });
  };

  const pauseVideo = () => {
    const video = videoRef.current;
    if (video) video.pause();
    setPlaying(false);
    flashControl("pause");
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.loop = false;
    }
    setPlaying(false);
    clearControlFlash();
    if (replayOnEnd) {
      requestAnimationFrame(() => {
        setHasEnded(true);
        setHasStarted(true);
      });
    } else if (previewAtEnd) {
      seekToPreview(video);
      setPlaying(false);
    }
  };

  const handleToggle = () => {
    if (hasEnded) {
      playVideo({ fromStart: true });
      return;
    }
    if (!isDesktopHoverEnabled()) {
      if (!playing) playVideo();
      return;
    }
    if (playing) pauseVideo();
    else playVideo();
  };

  const showPosterImage = poster && (!previewAtEnd || !previewReady) && !hasStarted && !hasEnded;
  const showPersistentControls =
    !playing &&
    ((!hasStarted && !hasEnded) ||
      hasEnded ||
      (!flashControls && hasStarted && !hasEnded));
  const showControlsOverlay = showPersistentControls || flashOverlayVisible;
  const showControls = flashControls ? true : showPersistentControls || controlFlash !== null;
  const showControlsVisible = flashControls ? showControlsOverlay : showControls;
  const showReplayIcon = hasEnded;
  const showPlayIcon =
    !hasEnded &&
    (controlFlash === "play" ||
      (showPersistentControls && !hasStarted) ||
      (!flashControls && hasStarted && !playing));
  const showPauseIcon =
    !hasEnded &&
    (controlFlash === "pause" || (!flashControls && hasStarted && !playing));

  const videoControls = [
    h("div", { className: "cs-docs-showcase__video-overlay", "aria-hidden": true }),
    h(
      "div",
      {
        className: "cs-docs-showcase__video-play",
        "aria-hidden": true,
      },
      h(
        "div",
        { className: "cs-docs-showcase__video-play-icons" },
        h(
          "div",
          {
            className: [
              "cs-docs-showcase__video-play-icon-wrap",
              showPlayIcon ? "cs-docs-showcase__video-play-icon-wrap--active" : "",
            ]
              .filter(Boolean)
              .join(" "),
          },
          h(DocsVideoPlayIcon)
        ),
        h(
          "div",
          {
            className: [
              "cs-docs-showcase__video-play-icon-wrap",
              showPauseIcon ? "cs-docs-showcase__video-play-icon-wrap--active" : "",
            ]
              .filter(Boolean)
              .join(" "),
          },
          h(DocsVideoPauseIcon)
        ),
        h(
          "div",
          {
            className: [
              "cs-docs-showcase__video-play-icon-wrap",
              showReplayIcon ? "cs-docs-showcase__video-play-icon-wrap--active" : "",
            ]
              .filter(Boolean)
              .join(" "),
          },
          h(DocsVideoReplayIcon)
        )
      )
    ),
  ];

  return h(
    "div",
    {
      ref: containerRef,
      className: [
        "cs-docs-showcase",
        "cs-docs-showcase--uf-design-premium-video",
        isFullBleed ? "cs-docs-showcase--uf-design-premium-video--full" : "",
        previewAtEnd && !playing && !hasStarted && !hasEnded
          ? "cs-docs-showcase--uf-design-premium-video--preview-frame"
          : "",
        playing ? "cs-docs-showcase--uf-design-premium-video--playing" : "",
        hasStarted && !playing && !hasEnded ? "cs-docs-showcase--uf-design-premium-video--paused" : "",
        hasEnded ? "cs-docs-showcase--uf-design-premium-video--ended" : "",
        showControlsVisible ? "cs-docs-showcase--uf-design-premium-video--controls-visible" : "",
        controlFlash ? "cs-docs-showcase--uf-design-premium-video--control-flash" : "",
      ]
        .filter(Boolean)
        .join(" "),
      onClick: handleToggle,
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleToggle();
        }
      },
      role: "button",
      tabIndex: 0,
      "aria-label": hasEnded
        ? "Replay video"
        : playing
          ? "Pause video"
          : hasStarted
            ? "Resume video"
            : "Play video",
    },
    showPosterImage
      ? h(DocsImg, {
          className: [
            "cs-docs-showcase__video-poster",
            isFullBleed ? "cs-docs-showcase__video-poster--full" : "cs-docs-showcase__img cs-docs-showcase__img--phone",
          ]
            .filter(Boolean)
            .join(" "),
          assetBase,
          file: poster,
          alt,
          width: 466,
          height: 1014,
        })
      : null,
    h(
      "video",
      {
        key: shouldLoadVideo ? mp4Src : "pending",
        ref: videoRef,
        className: [
          "cs-docs-showcase__video",
          isFullBleed ? "cs-docs-showcase__video--full" : "cs-docs-showcase__img cs-docs-showcase__img--phone",
        ]
          .filter(Boolean)
          .join(" "),
        playsInline: true,
        muted: true,
        preload: shouldLoadVideo ? (previewAtEnd ? "metadata" : "none") : "none",
        disablePictureInPicture: true,
        controlsList: "nodownload nofullscreen noremoteplayback",
        "aria-label": alt,
        onLoadedMetadata: preparePreview,
        onLoadedData: preparePreview,
        onEnded: handleEnded,
      },
      shouldLoadVideo
        ? [
            h("source", { key: "mp4", src: mp4Src, type: "video/mp4" }),
            h("source", { key: "mov", src: movSrc, type: "video/quicktime" }),
          ]
        : null
    ),
    ...(showControls ? videoControls : [])
  );
}

function DocsShowcase({ variant, assetBase, studySlug }) {
  const AXIS_ASSET_VERSION = "8415-frames-4x";

  /** Full Figma showcase frames (736×H) — aspect-ratio container + bleed image. */
  const docsFullFrame = (file, alt, width, height, cacheKey) =>
    h(
      "div",
      {
        className: "cs-docs-showcase cs-docs-showcase--full-frame",
        style: { aspectRatio: `${width} / ${height}` },
      },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--full-frame",
        assetBase,
        file,
        alt,
        width,
        height,
        ...(cacheKey ? { cacheKey } : {}),
      })
    );

  const axisFrame = (file, alt, width, height) =>
    docsFullFrame(file, alt, width, height, AXIS_ASSET_VERSION);

  const shipflexShowcases = {
    login: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--login" },
      h(DocsImg, {
        assetBase,
        file: "login.png",
        alt: "ShipFlex login experience",
        width: 669,
        height: 476,
      })
    ),
    dashboard: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--dashboard" },
      h(DocsImg, {
        assetBase,
        file: "dashboard.png",
        alt: "ShipFlex analytics dashboard",
        width: 663,
        height: 472,
      })
    ),
    shipments: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--shipments" },
      h(DocsImg, {
        assetBase,
        file: "shipments.png",
        alt: "ShipFlex shipment management table",
        width: 661,
        height: 561,
      })
    ),
    "design-dual": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--design-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--typography",
        assetBase,
        file: "design-typography.png",
        alt: "ShipFlex typography system",
        width: 320,
        height: 506,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--colors",
        assetBase,
        file: "design-colors.png",
        alt: "ShipFlex color palette",
        width: 240,
        height: 247,
      })
    ),
    "design-forms": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--design-forms" },
      h(DocsImg, {
        assetBase,
        file: "design-forms.png",
        alt: "ShipFlex form components",
        width: 610,
        height: 468,
      })
    ),
    "design-buttons": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--design-buttons" },
      h(DocsImg, {
        assetBase,
        file: "design-buttons.png",
        alt: "ShipFlex button styles",
        width: 510,
        height: 258,
      })
    ),
    "design-toggles": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--design-toggles" },
      h(DocsImg, {
        assetBase,
        file: "design-toggles.png",
        alt: "ShipFlex toggle components",
        width: 160,
        height: 228,
      })
    ),
    "design-icons": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--design-icons" },
      h(DocsImg, {
        assetBase,
        file: "design-icons.png",
        alt: "ShipFlex icon set",
        width: 269,
        height: 159,
      })
    ),
    sidebar: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--sidebar" },
      h(DocsImg, {
        assetBase,
        file: "design-sidebar.png",
        alt: "ShipFlex sidebar navigation",
        width: 536,
        height: 2611,
      })
    ),
  };

  const unflappableShowcases = {
    welcome: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-welcome" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone",
        assetBase,
        file: "welcome.png",
        alt: "Unflappable welcome screen",
        width: 466,
        height: 1014,
      })
    ),
    "onboarding-dual-1": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--left",
        assetBase,
        file: "onboarding-01.png",
        alt: "Unflappable onboarding role selection",
        width: 307,
        height: 667,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--right",
        assetBase,
        file: "onboarding-02.png",
        alt: "Unflappable onboarding challenge selection",
        width: 307,
        height: 667,
      })
    ),
    "onboarding-dual-2": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--left",
        assetBase,
        file: "onboarding-03.png",
        alt: "Unflappable onboarding goals selection",
        width: 307,
        height: 667,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--right",
        assetBase,
        file: "onboarding-04.png",
        alt: "Unflappable onboarding reminders preference",
        width: 307,
        height: 667,
      })
    ),
    "home-dual-1": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--left",
        assetBase,
        file: "home-01.png",
        alt: "Unflappable home dashboard",
        width: 307,
        height: 667,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--right",
        assetBase,
        file: "home-02.png",
        alt: "Unflappable daily mission setup",
        width: 307,
        height: 667,
      })
    ),
    "home-dual-2": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--left",
        assetBase,
        file: "home-03.png",
        alt: "Unflappable mission progress",
        width: 307,
        height: 667,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--right",
        assetBase,
        file: "home-04.png",
        alt: "Unflappable weekly review",
        width: 307,
        height: 667,
      })
    ),
    "reset-tall": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-welcome" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone",
        assetBase,
        file: "reset-tall.png",
        alt: "Unflappable reset flow intro",
        width: 466,
        height: 1014,
      })
    ),
    "reset-dual": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--left",
        assetBase,
        file: "reset-dual-a.png",
        alt: "Unflappable reset trigger selection",
        width: 307,
        height: 667,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--right",
        assetBase,
        file: "reset-dual-b.png",
        alt: "Unflappable reset feeling selection",
        width: 307,
        height: 667,
      })
    ),
    "reset-card": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-reset-card" },
      h(DocsImg, {
        className: "cs-docs-showcase__img",
        assetBase,
        file: "reset-card.png",
        alt: "Unflappable reset reframe card",
        width: 400,
        height: 446,
      })
    ),
    "reset-phone": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-phone-center" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone",
        assetBase,
        file: "reset-phone.png",
        alt: "Unflappable reset history",
        width: 263,
        height: 572,
        cacheKey: "19619",
      })
    ),
    "progress-phone": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-phone-center" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone",
        assetBase,
        file: "progress-phone.png",
        alt: "Unflappable progress tracking",
        width: 263,
        height: 572,
      })
    ),
    "design-dual": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-design-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--typography",
        assetBase,
        file: "design-typography.png",
        alt: "Unflappable typography system",
        width: 324,
        height: 506,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--colors",
        assetBase,
        file: "design-colors.png",
        alt: "Unflappable color palette",
        width: 239,
        height: 105,
      })
    ),
    "design-forms": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-design-forms" },
      h(DocsImg, {
        assetBase,
        file: "design-forms.png",
        alt: "Unflappable form components",
        width: 570,
        height: 356,
      })
    ),
    "design-buttons": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-design-buttons" },
      h(DocsImg, {
        assetBase,
        file: "design-buttons.png",
        alt: "Unflappable button styles",
        width: 516,
        height: 266,
      })
    ),
    "design-toggles": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-design-toggles" },
      h(DocsImg, {
        assetBase,
        file: "design-toggles.png",
        alt: "Unflappable toggle components",
        width: 158,
        height: 214,
      })
    ),
    "design-icons": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-design-icons" },
      h(DocsImg, {
        assetBase,
        file: "design-icons.png",
        alt: "Unflappable icon set",
        width: 243,
        height: 249,
      })
    ),
    "design-status": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-design-status" },
      h(DocsImg, {
        assetBase,
        file: "design-status.png",
        alt: "Unflappable status indicators",
        width: 587,
        height: 141,
      })
    ),
    "design-premium": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-design-premium" },
      h(DocsImg, {
        className: "cs-docs-showcase__img",
        assetBase,
        file: "design-premium.png",
        alt: "Unflappable premium feature upsell",
        width: 421,
        height: 244,
      })
    ),
  };

  const rentAiShowcases = {
    landing: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--ra-landing" },
      h(DocsImg, {
        assetBase,
        file: "landing.png",
        alt: "RentAI landing page",
        width: 648,
        height: 527,
      })
    ),
    "getting-started-01": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--ra-desktop" },
      h(DocsImg, {
        className: "cs-docs-showcase__img",
        assetBase,
        file: "getting-started-01.png",
        alt: "RentAI welcome screen",
        width: 669,
        height: 476,
      })
    ),
    "getting-started-02": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--ra-desktop" },
      h(DocsImg, {
        className: "cs-docs-showcase__img",
        assetBase,
        file: "getting-started-02.png",
        alt: "RentAI sign-in experience",
        width: 669,
        height: 476,
      })
    ),
    dashboard: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--ra-dashboard" },
      h(DocsImg, {
        className: "cs-docs-showcase__img",
        assetBase,
        file: "dashboard.png",
        alt: "RentAI analytics dashboard",
        width: 665,
        height: 655,
      })
    ),
    referrals: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--ra-desktop" },
      h(DocsImg, {
        className: "cs-docs-showcase__img",
        assetBase,
        file: "referrals.png",
        alt: "RentAI referral and partner program",
        width: 669,
        height: 476,
      })
    ),
    reconciliation: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--ra-desktop" },
      h(DocsImg, {
        className: "cs-docs-showcase__img",
        assetBase,
        file: "reconciliation.png",
        alt: "RentAI AI-powered reconciliation",
        width: 669,
        height: 476,
      })
    ),
    tenants: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--ra-desktop" },
      h(DocsImg, {
        className: "cs-docs-showcase__img",
        assetBase,
        file: "tenants.png",
        alt: "RentAI tenant management",
        width: 669,
        height: 476,
      })
    ),
    billing: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--ra-desktop" },
      h(DocsImg, {
        className: "cs-docs-showcase__img",
        assetBase,
        file: "billing.png",
        alt: "RentAI subscription and billing",
        width: 669,
        height: 476,
      })
    ),
  };

  const flareShowcases = {
    splash: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-phone-center" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone",
        assetBase,
        file: "splash.png",
        alt: "Flare splash screen",
        width: 263,
        height: 572,
      })
    ),
    "onboarding-dual": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--left",
        assetBase,
        file: "onboarding-01.png",
        alt: "Flare onboarding screen one",
        width: 307,
        height: 667,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--right",
        assetBase,
        file: "onboarding-02.png",
        alt: "Flare onboarding screen two",
        width: 307,
        height: 667,
      })
    ),
    "onboarding-single": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-phone-center" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone",
        assetBase,
        file: "onboarding-03.png",
        alt: "Flare get started screen",
        width: 263,
        height: 572,
      })
    ),
    "auth-dual": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--left",
        assetBase,
        file: "auth-01.png",
        alt: "Flare sign up screen",
        width: 307,
        height: 667,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--right",
        assetBase,
        file: "auth-02.png",
        alt: "Flare sign in screen",
        width: 307,
        height: 667,
      })
    ),
    home: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-phone-center" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone",
        assetBase,
        file: "home.png",
        alt: "Flare home screen",
        width: 263,
        height: 572,
      })
    ),
    "home-detail": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--fl-home-tall" },
      h(DocsImg, {
        className: "cs-docs-showcase__img",
        assetBase,
        file: "home-detail.png",
        alt: "Flare coaching style selection",
        width: 353,
        height: 1150,
      })
    ),
    "coaching-session": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-phone-center" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone",
        assetBase,
        file: "coaching-session.png",
        alt: "Flare AI coaching session",
        width: 263,
        height: 572,
      })
    ),
    "coaching-complete": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--fl-card" },
      h(DocsImg, {
        className: "cs-docs-showcase__img",
        assetBase,
        file: "coaching-complete.png",
        alt: "Flare session completion screen",
        width: 337,
        height: 357,
      })
    ),
    history: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-phone-center" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone",
        assetBase,
        file: "history.png",
        alt: "Flare session history",
        width: 263,
        height: 572,
      })
    ),
    "history-delete": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--fl-card" },
      h(DocsImg, {
        className: "cs-docs-showcase__img",
        assetBase,
        file: "history-delete.png",
        alt: "Flare delete session confirmation",
        width: 337,
        height: 357,
      })
    ),
    insights: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-phone-center" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone",
        assetBase,
        file: "insights.png",
        alt: "Flare AI session insights",
        width: 263,
        height: 572,
      })
    ),
    profile: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--fl-profile" },
      h(DocsImg, {
        assetBase,
        file: "profile.png",
        alt: "Flare profile and preferences",
        width: 736,
        height: 692,
        cacheKey: "20150-4x",
      })
    ),
    "design-dual": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--fl-design-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--typography",
        assetBase,
        file: "design-typography.png",
        alt: "Flare typography system",
        width: 324,
        height: 506,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--colors",
        assetBase,
        file: "design-colors.png",
        alt: "Flare color palette",
        width: 239,
        height: 166,
      })
    ),
    "design-forms": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--fl-design-forms" },
      h(DocsImg, {
        assetBase,
        file: "design-forms.png",
        alt: "Flare form components",
        width: 526,
        height: 264,
      })
    ),
    "design-buttons": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--fl-design-buttons" },
      h(DocsImg, {
        assetBase,
        file: "design-buttons.png",
        alt: "Flare button styles",
        width: 473,
        height: 391,
      })
    ),
    "design-toggles": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--fl-design-toggles" },
      h(DocsImg, {
        assetBase,
        file: "design-toggles.png",
        alt: "Flare toggle components",
        width: 169,
        height: 234,
      })
    ),
    "design-icons": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--fl-design-icons" },
      h(DocsImg, {
        assetBase,
        file: "design-icons.png",
        alt: "Flare icon set",
        width: 473,
        height: 336,
      })
    ),
    "design-premium": h(DocsVideoPlayer, {
      assetBase,
      file: "design-premium.mp4",
      poster: "coaching-session.png",
      alt: "Flare coaching session demo",
      layout: "full",
      previewAtEnd: true,
      cacheKey: "20260727-2021",
      loop: false,
      replayOnEnd: true,
      flashControls: true,
    }),
  };

  const ralamuliShowcases = {
    splash: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-phone-center" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone",
        assetBase,
        file: "splash.png",
        alt: "Ralamuli splash screen",
        width: 263,
        height: 572,
      })
    ),
    "translate-dual-1": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--left",
        assetBase,
        file: "translate-01.png",
        alt: "Ralamuli translation language selection",
        width: 307,
        height: 667,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--right",
        assetBase,
        file: "translate-02.png",
        alt: "Ralamuli translation input",
        width: 307,
        height: 667,
      })
    ),
    "translate-dual-2": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--left",
        assetBase,
        file: "translate-03.png",
        alt: "Ralamuli translation loading state",
        width: 307,
        height: 667,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--right",
        assetBase,
        file: "translate-04.png",
        alt: "Ralamuli translation result",
        width: 307,
        height: 667,
      })
    ),
    "translate-screen": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-phone-center" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone",
        assetBase,
        file: "translate-screen.png",
        alt: "Ralamuli translation screen",
        width: 263,
        height: 572,
      })
    ),
    "learning-dual": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--uf-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--left",
        assetBase,
        file: "learning-01.png",
        alt: "Ralamuli learning mode progress",
        width: 307,
        height: 667,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--phone cs-docs-showcase__img--right",
        assetBase,
        file: "learning-02.png",
        alt: "Ralamuli vocabulary card",
        width: 307,
        height: 667,
      })
    ),
    "design-dual": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--rm-design-dual" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--typography",
        assetBase,
        file: "design-typography.png",
        alt: "Ralamuli typography system",
        width: 324,
        height: 506,
      }),
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--colors",
        assetBase,
        file: "design-colors.png",
        alt: "Ralamuli color palette",
        width: 239,
        height: 165,
      })
    ),
    "design-forms": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--rm-design-forms" },
      h(DocsImg, {
        assetBase,
        file: "design-forms.png",
        alt: "Ralamuli form components",
        width: 400,
        height: 460,
      })
    ),
    "design-buttons": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--rm-design-buttons" },
      h(DocsImg, {
        assetBase,
        file: "design-buttons.png",
        alt: "Ralamuli button styles",
        width: 536,
        height: 334,
      })
    ),
    "design-toggles": docsFullFrame(
      "design-toggles-showcase.png",
      "Ralamuli language selection and interface controls",
      736,
      528,
      "20260728-toggles"
    ),
    "design-icons": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--rm-design-icons" },
      h(DocsImg, {
        assetBase,
        file: "design-icons.png",
        alt: "Ralamuli icon set",
        width: 402,
        height: 596,
      })
    ),
    "design-status": h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--rm-design-status" },
      h(DocsImg, {
        assetBase,
        file: "design-status.png",
        alt: "Ralamuli status indicators",
        width: 497,
        height: 275,
      })
    ),
  };

  const axisShowcases = {
    "onboarding-dual-1": axisFrame(
      "frame-onboarding-1.png",
      "AxisHealth account creation and health profile setup screens",
      736,
      528
    ),
    "onboarding-dual-2": axisFrame(
      "frame-onboarding-2.png",
      "AxisHealth fitness goals and nutritional targets screens",
      736,
      528
    ),
    dashboard: axisFrame(
      "frame-dashboard.png",
      "AxisHealth dashboard",
      736,
      692
    ),
    nutrition: axisFrame(
      "frame-nutrition.png",
      "AxisHealth calorie and nutrition tracking",
      736,
      692
    ),
    exercise: axisFrame(
      "frame-exercise.png",
      "AxisHealth exercise and activity tracking",
      736,
      692
    ),
    peptides: axisFrame(
      "frame-peptides.png",
      "AxisHealth peptides and treatment management",
      736,
      692
    ),
    "progress-side": axisFrame(
      "frame-progress.png",
      "AxisHealth progress and side effects tracking",
      736,
      692
    ),
    vitals: axisFrame(
      "frame-vitals.png",
      "AxisHealth vitals and health monitoring",
      736,
      692
    ),
    "design-dual": axisFrame(
      "frame-design-dual.png",
      "AxisHealth typography system and color palette",
      736,
      620
    ),
    "design-forms": axisFrame(
      "frame-design-forms.png",
      "AxisHealth navigation components",
      736,
      581
    ),
    "design-palette": axisFrame(
      "frame-design-palette.png",
      "AxisHealth form field components",
      736,
      518
    ),
    "design-buttons": axisFrame(
      "frame-design-buttons.png",
      "AxisHealth button styles",
      736,
      528
    ),
    "design-icons": axisFrame(
      "frame-design-icons.png",
      "AxisHealth icon set",
      736,
      731
    ),
    "design-status": axisFrame(
      "frame-design-status.png",
      "AxisHealth status indicators and charts",
      736,
      424
    ),
  };

  const keepupShowcases = {
    workflow: h(
      "div",
      { className: "cs-docs-showcase cs-docs-showcase--keepup-workflow" },
      h(DocsImg, {
        className: "cs-docs-showcase__img cs-docs-showcase__img--workflow",
        assetBase,
        file: "workflow-diagram.png",
        alt: "KEEPUP end-to-end operational workflow diagram",
        width: 688,
        height: 1528,
      })
    ),
  };

  const showcaseMaps = {
    shipflex: shipflexShowcases,
    unflappable: unflappableShowcases,
    "rent-ai": rentAiShowcases,
    flare: flareShowcases,
    ralamuli: ralamuliShowcases,
    axis: axisShowcases,
    keepup: keepupShowcases,
  };
  const showcases = showcaseMaps[studySlug] || shipflexShowcases;
  return showcases[variant] || null;
}

function renderBlock(block, assetBase, studySlug) {
  switch (block.type) {
    case "overview":
      return h(
        "section",
        { key: block.title, className: "cs-docs__section cs-docs__section--overview" },
        h("h2", { className: "cs-docs__section-title cs-docs__section-title--lg" }, block.title),
        h(DocsProse, { paragraphs: block.paragraphs })
      );
    case "approach":
      return h(
        "section",
        { key: block.title, className: "cs-docs__section cs-docs__section--approach" },
        h(
          "div",
          { className: "cs-docs__subsection" },
          h("h2", { className: "cs-docs__section-title" }, block.title),
          h("p", { className: "cs-docs__p" }, block.intro)
        ),
        h(DocsCardGrid, { cards: block.cards })
      );
    case "feature":
      return [
        h(
          "section",
          { key: `${block.title}-text`, className: "cs-docs__section cs-docs__section--feature" },
          h("h2", { className: "cs-docs__section-title" }, block.title),
          h(DocsProse, { paragraphs: block.paragraphs })
        ),
        block.showcase
          ? h(DocsShowcase, {
              key: `${block.title}-showcase`,
              variant: block.showcase,
              assetBase,
              studySlug,
            })
          : null,
        ...(block.extraShowcases || []).map((variant, index) =>
          h(DocsShowcase, {
            key: `${block.title}-showcase-${index}`,
            variant,
            assetBase,
            studySlug,
          })
        ),
      ].filter(Boolean);
    case "benefits":
      return [
        h(
          "section",
          { key: block.title, className: "cs-docs__section cs-docs__section--benefits" },
          h(
            "div",
            { className: "cs-docs__subsection" },
            h("h2", { className: "cs-docs__section-title" }, block.title),
            h("p", { className: "cs-docs__p" }, block.intro)
          ),
          h(DocsBenefitCard, { key: block.cards[0].title, ...block.cards[0] })
        ),
        h(DocsBenefitCard, { key: block.cards[1].title, ...block.cards[1] }),
      ];
    case "showcase":
      return h(DocsShowcase, {
        key: block.variant,
        variant: block.variant,
        assetBase,
        studySlug,
      });
    case "note":
      return h(
        "p",
        { key: "note", className: "cs-docs__note" },
        h("strong", null, "Note:"),
        ` ${block.text}`
      );
    case "takeaways":
      return h(
        "section",
        { key: block.title, className: "cs-docs__section cs-docs__section--takeaways" },
        h("h2", { className: "cs-docs__section-title cs-docs__section-title--lg" }, block.title),
        block.body
          ? h("p", { className: "cs-docs__takeaways-body" }, block.body)
          : h(
              "div",
              { className: "cs-docs__takeaways-body" },
              block.intro ? h("p", null, block.intro) : null,
              block.lead ? h("p", null, block.lead) : null,
              block.items?.length
                ? h(
                    "ul",
                    { className: "cs-docs__takeaways-list" },
                    ...block.items.map((item) => h("li", { key: item }, item))
                  )
                : null
            )
      );
    case "closing":
      return h(
        "section",
        { key: block.title, className: "cs-docs__section cs-docs__section--closing" },
        h("h2", { className: "cs-docs__section-title" }, block.title),
        h(DocsProse, { paragraphs: block.paragraphs })
      );
    default:
      return null;
  }
}

export function DocsCaseStudy({ study, reduceMotion, onNavigateHome }) {
  const prefersReduced = useReducedMotion();
  const motionOff = Boolean(reduceMotion ?? prefersReduced);
  const heroRef = useRef(null);
  const assetBase = getDocsAsset(study);

  useCaseStudyDocsEntrance({
    heroRef,
    reduceMotion: motionOff,
    studySlug: study.slug,
  });

  const handleBackHome = () => {
    if (onNavigateHome) {
      onNavigateHome("/", { reduceMotion: motionOff });
      return;
    }
    window.location.href = "/";
  };

  return h(
    "div",
    { className: `cs-docs cs-docs--${study.slug}` },
    h("div", { className: "cs-docs__guide", "aria-hidden": true }),
    h(
      "div",
      { className: "cs-docs__container" },
      h(
        "header",
        { ref: heroRef, className: "cs-docs__header" },
        h(
          "div",
          { className: "cs-docs__header-inner" },
          h(
            "div",
            { className: "cs-docs__header-block cs-docs__header-block--title" },
            h("hr", { className: "cs-docs__rule", "aria-hidden": true }),
            h(
              "div",
              { className: "cs-docs__header-content cs-docs__header-content--title" },
              h("p", { className: "cs-docs__eyebrow" }, study.eyebrow),
              h("h1", { className: "cs-docs__title" }, study.title)
            ),
            h("hr", { className: "cs-docs__rule", "aria-hidden": true })
          ),
          h(
            "div",
            { className: "cs-docs__header-block cs-docs__header-block--intro" },
            h("hr", { className: "cs-docs__rule", "aria-hidden": true }),
            h(
              "div",
              { className: "cs-docs__header-content cs-docs__header-content--intro" },
              h("p", { className: "cs-docs__tagline" }, study.tagline),
              ...(Array.isArray(study.intro)
                ? study.intro.map((paragraph, index) =>
                    h("p", { key: index, className: "cs-docs__intro" }, paragraph)
                  )
                : [h("p", { className: "cs-docs__intro" }, study.intro)])
            )
          )
        )
      ),
      h(
        "div",
        { className: "cs-docs__playground" },
        h("hr", { className: "cs-docs__rule", "aria-hidden": true }),
        h(
          "div",
          { className: "cs-docs__preview" },
          h(
            "div",
            { className: "cs-docs__content" },
            h(DocsMetaGrid, { items: study.meta }),
            ...study.blocks.flatMap((block) => {
              const rendered = renderBlock(block, assetBase, study.slug);
              if (rendered == null) return [];
              return Array.isArray(rendered) ? rendered : [rendered];
            })
          )
        ),
        h("hr", { className: "cs-docs__rule", "aria-hidden": true })
      ),
      h(
        "div",
        { className: "cs-docs__back-home" },
        h(
          "button",
          {
            type: "button",
            className: "cs-docs__back-home-btn",
            onClick: handleBackHome,
          },
          h(DocsNavIcon, { direction: "left" }),
          h(DocsSplitLabel, { muted: "Back to", emphasis: " Home" })
        ),
        h(
          "button",
          {
            type: "button",
            className: "cs-docs__back-home-btn cs-docs__back-home-btn--top",
            onClick: () => scrollDocsToTop(motionOff),
          },
          h(DocsNavIcon, { direction: "up" }),
          h(DocsSplitLabel, { muted: "Return to", emphasis: " Top" })
        )
      ),
      h(
        "div",
        { className: "cs-docs__footer-wrap" },
        h("hr", { className: "cs-docs__rule", "aria-hidden": true }),
        h(
          "footer",
          { className: "cs-docs__footer" },
          h("p", null, study.footer)
        ),
        h("hr", { className: "cs-docs__rule", "aria-hidden": true })
      )
    )
  );
}
