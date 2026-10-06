import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Footer from "./Footer";
import HomeCta from "./HomeCta";
import ContactSection from "./ContactSection";
import FaqSection from "./FaqSection";
import ResponsiveImage from "./ResponsiveImage";
import FlareCaseStudyPage from "./FlareCaseStudy";
import ShipFlexCaseStudyPage from "./ShipFlexCaseStudy";
import UnflappableCaseStudyPage from "./UnflappableCaseStudy";
import AxisHealthCaseStudyPage from "./AxisHealthCaseStudy";
import { a } from "./assets";
import { isHomeSectionId, scrollToHomeSection, type HomeSectionId } from "./homeSectionNavigation";
import useNearViewportMedia from "./useNearViewportMedia";

function Stars() {
  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="star" key={i}>
          <img src={a.star} alt="" loading="lazy" decoding="async" />
        </div>
      ))}
    </div>
  );
}

const glowVariants = {
  a: { innerW: 231.535, innerH: 149.66, inset: "-196.27% -126.86%", rotate: -152.21, skew: -4.53 },
  b: { innerW: 336.074, innerH: 149.66, inset: "-196.27% -87.4%", rotate: 152.21, skew: 4.53 },
  c: { innerW: 341.98, innerH: 146.725, inset: "-200.2% -85.89%", rotate: -168.58, skew: -2.21 },
} as const;

function Glow({
  src,
  variant,
  style,
}: {
  src: string;
  variant: keyof typeof glowVariants;
  style?: CSSProperties;
}) {
  const v = glowVariants[variant];
  return (
    <div className="glow" style={style}>
      <div
        className="glow-rot"
        style={{ transform: `rotate(${v.rotate}deg) skewX(${v.skew}deg)` }}
      >
        <div className="glow-inner" style={{ width: v.innerW, height: v.innerH }}>
          <div className="glow-burst" style={{ inset: v.inset }}>
            <img src={src} alt="" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoLoadingSpinner() {
  return (
    <span className="video-loading-spinner" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, index) => (
        <span className="video-loading-spinner__segment" key={index} />
      ))}
    </span>
  );
}

function Play({
  left,
  top,
  hidden = false,
  loading = false,
}: {
  left: number;
  top: number;
  hidden?: boolean;
  loading?: boolean;
}) {
  return (
    <div
      className={`play${hidden ? " play--hidden" : ""}${loading ? " play--loading" : ""}`}
      style={{ left, top }}
    >
      {loading ? (
        <VideoLoadingSpinner />
      ) : (
        <img src={a.play} alt="" loading="lazy" decoding="async" />
      )}
    </div>
  );
}

function ProjectsVideoCard() {
  const videoSource = "/assets/projects-card-preview.mov";
  const videoPoster = "/assets/video-posters/projects-card-preview.webp";
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldLoadMedia = useNearViewportMedia(videoRef);
  const hasInteractedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isThumbnailReady, setIsThumbnailReady] = useState(true);

  const hasHoverPointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const updateLoading = (loading: boolean) => {
    isLoadingRef.current = loading;
    setIsLoading(loading);
  };

  const seekToFinalFrame = (video: HTMLVideoElement) => {
    if (hasInteractedRef.current || !Number.isFinite(video.duration) || video.duration <= 0) return;
    setIsThumbnailReady(false);
    video.pause();
    video.currentTime = Math.max(0, video.duration - 0.05);
  };

  const playVideo = () => {
    const video = videoRef.current;
    if (!video || isLoadingRef.current || (!video.paused && !video.ended)) return;

    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      video.currentTime = 0;
      setHasEnded(false);
      setIsThumbnailReady(true);
    } else if (hasEnded || video.ended) {
      video.currentTime = 0;
      setHasEnded(false);
    }

    updateLoading(true);
    const playRequest = video.play();
    if (playRequest) {
      void playRequest.catch(() => {
        updateLoading(false);
        setIsPlaying(false);
      });
    }
  };

  const pauseVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    updateLoading(false);
    video.pause();
  };

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) playVideo();
    else pauseVideo();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleVideo();
  };

  return (
    <div
      className="card-lg teal showcase-video-card"
      role="button"
      tabIndex={0}
      aria-label={isLoading ? "Loading Projects preview video" : isPlaying ? "Pause Projects preview video" : "Play Projects preview video"}
      aria-pressed={isPlaying}
      aria-busy={isLoading}
      onMouseEnter={() => hasHoverPointer() && playVideo()}
      onMouseLeave={() => hasHoverPointer() && pauseVideo()}
      onClick={() => !hasHoverPointer() && playVideo()}
      onKeyDown={handleKeyDown}
    >
      <video
        ref={videoRef}
        className={`showcase-video${isThumbnailReady ? " showcase-video--ready" : ""}`}
        src={videoSource}
        poster={shouldLoadMedia ? videoPoster : undefined}
        muted
        playsInline
        controls={false}
        preload="none"
        disablePictureInPicture
        onLoadedMetadata={(event) => seekToFinalFrame(event.currentTarget)}
        onDurationChange={(event) => seekToFinalFrame(event.currentTarget)}
        onSeeked={(event) => {
          if (hasInteractedRef.current) return;
          const video = event.currentTarget;
          const finalFrameTime = Math.max(0, video.duration - 0.05);
          if (Math.abs(video.currentTime - finalFrameTime) > 0.01) {
            seekToFinalFrame(video);
            return;
          }
          video.pause();
          setIsThumbnailReady(true);
        }}
        onPlay={() => setIsPlaying(true)}
        onPlaying={() => {
          updateLoading(false);
          setIsPlaying(true);
        }}
        onCanPlay={(event) => {
          if (!event.currentTarget.paused && !event.currentTarget.seeking) updateLoading(false);
        }}
        onWaiting={(event) => {
          if (hasInteractedRef.current && !event.currentTarget.paused && !event.currentTarget.ended) {
            updateLoading(true);
          }
        }}
        onStalled={(event) => {
          if (hasInteractedRef.current && !event.currentTarget.paused && !event.currentTarget.ended) {
            updateLoading(true);
          }
        }}
        onSeeking={(event) => {
          if (hasInteractedRef.current && !event.currentTarget.paused && !event.currentTarget.ended) {
            updateLoading(true);
          }
        }}
        onPause={() => {
          updateLoading(false);
          setIsPlaying(false);
        }}
        onEnded={() => {
          updateLoading(false);
          setHasEnded(true);
          setIsPlaying(false);
        }}
        onError={() => {
          updateLoading(false);
          setIsPlaying(false);
        }}
      />
      <Play left={1286} top={30} hidden={isPlaying && !isLoading} loading={isLoading} />
    </div>
  );
}

function PurpleNavigationVideoCard() {
  const videoSource = "/assets/purple-navigation-card-preview.mov";
  const videoPoster = "/assets/video-posters/purple-navigation-card-preview.webp";
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldLoadMedia = useNearViewportMedia(videoRef);
  const hasInteractedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isThumbnailReady, setIsThumbnailReady] = useState(true);

  const hasHoverPointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const updateLoading = (loading: boolean) => {
    isLoadingRef.current = loading;
    setIsLoading(loading);
  };

  const seekToFinalFrame = (video: HTMLVideoElement) => {
    if (hasInteractedRef.current || !Number.isFinite(video.duration) || video.duration <= 0) return;
    setIsThumbnailReady(false);
    video.pause();
    video.currentTime = Math.max(0, video.duration - 0.05);
  };

  const playVideo = () => {
    const video = videoRef.current;
    if (!video || isLoadingRef.current || (!video.paused && !video.ended)) return;

    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      video.currentTime = 0;
      setHasEnded(false);
      setIsThumbnailReady(true);
    } else if (hasEnded || video.ended) {
      video.currentTime = 0;
      setHasEnded(false);
    }

    updateLoading(true);
    const playRequest = video.play();
    if (playRequest) {
      void playRequest.catch(() => {
        updateLoading(false);
        setIsPlaying(false);
      });
    }
  };

  const pauseVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    updateLoading(false);
    video.pause();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    playVideo();
  };

  return (
    <div
      className="cell showcase-video-card"
      style={{ background: "#261639" }}
      role="button"
      tabIndex={0}
      aria-label={isLoading ? "Loading purple navigation preview video" : isPlaying ? "Purple navigation preview video playing" : "Play purple navigation preview video"}
      aria-pressed={isPlaying}
      aria-busy={isLoading}
      onMouseEnter={() => hasHoverPointer() && playVideo()}
      onMouseLeave={() => hasHoverPointer() && pauseVideo()}
      onClick={() => !hasHoverPointer() && playVideo()}
      onKeyDown={handleKeyDown}
    >
      <video
        ref={videoRef}
        className={`showcase-video${isThumbnailReady ? " showcase-video--ready" : ""}`}
        src={videoSource}
        poster={shouldLoadMedia ? videoPoster : undefined}
        muted
        playsInline
        controls={false}
        preload="none"
        disablePictureInPicture
        onLoadedMetadata={(event) => seekToFinalFrame(event.currentTarget)}
        onDurationChange={(event) => seekToFinalFrame(event.currentTarget)}
        onSeeked={(event) => {
          if (hasInteractedRef.current) return;
          const video = event.currentTarget;
          const finalFrameTime = Math.max(0, video.duration - 0.05);
          if (Math.abs(video.currentTime - finalFrameTime) > 0.01) {
            seekToFinalFrame(video);
            return;
          }
          video.pause();
          setIsThumbnailReady(true);
        }}
        onPlay={() => setIsPlaying(true)}
        onPlaying={() => {
          updateLoading(false);
          setIsPlaying(true);
        }}
        onCanPlay={(event) => {
          if (!event.currentTarget.paused && !event.currentTarget.seeking) updateLoading(false);
        }}
        onWaiting={(event) => {
          if (hasInteractedRef.current && !event.currentTarget.paused && !event.currentTarget.ended) {
            updateLoading(true);
          }
        }}
        onStalled={(event) => {
          if (hasInteractedRef.current && !event.currentTarget.paused && !event.currentTarget.ended) {
            updateLoading(true);
          }
        }}
        onSeeking={(event) => {
          if (hasInteractedRef.current && !event.currentTarget.paused && !event.currentTarget.ended) {
            updateLoading(true);
          }
        }}
        onPause={() => {
          updateLoading(false);
          setIsPlaying(false);
        }}
        onEnded={() => {
          updateLoading(false);
          setHasEnded(true);
          setIsPlaying(false);
        }}
        onError={() => {
          updateLoading(false);
          setIsPlaying(false);
        }}
      />
      <Play left={609} top={25} hidden={isPlaying && !isLoading} loading={isLoading} />
    </div>
  );
}

function JobCard({
  logo,
  name,
  role,
  href,
  accessibleLabel,
  bordered,
  arrow = a.arrow16,
}: {
  logo: string;
  name: string;
  role: string;
  href: string;
  accessibleLabel: string;
  bordered?: boolean;
  arrow?: string;
}) {
  return (
    <a
      className="job-card"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={accessibleLabel}
      data-external-label={name}
    >
      <div className="job-inner">
        <div className="job-top">
          <img className={`job-logo${bordered ? " bordered" : ""}`} src={logo} alt="" loading="lazy" decoding="async" />
          <img className="job-arrow" src={arrow} alt="" loading="lazy" decoding="async" />
        </div>
        <div>
          <p className="job-name sf sf-med">{name}</p>
          <p className="job-role sf sf-reg">{role}</p>
        </div>
      </div>
    </a>
  );
}

const navItems = [
  { icon: a.navHome, label: "Home", sectionId: "hero" },
  { icon: a.navUser, label: "About", sectionId: "about" },
  { icon: a.navFolder, label: "Projects", sectionId: "projects" },
  { icon: a.navDesign, label: "Tools", sectionId: "toolkit" },
  { icon: a.navCode, label: "Services", sectionId: "services" },
  { icon: a.navChat, label: "Reviews", sectionId: "testimonials" },
] as const;

const mobileNavItems = [
  { icon: a.mobileNavHome, label: "Home", sectionId: "hero" },
  { icon: a.mobileNavUser, label: "About Me", sectionId: "about" },
  { icon: a.mobileNavProjects, label: "Projects", sectionId: "projects" },
  { icon: a.mobileNavTools, label: "Tools", sectionId: "toolkit" },
  { icon: a.mobileNavServices, label: "Services", sectionId: "services" },
  { icon: a.mobileNavTestimonials, label: "Testimonials", sectionId: "testimonials" },
] as const;

function NavTooltip({ label }: { label: string }) {
  return <span className="nav-tooltip">{label}</span>;
}

function NavIcon({
  icon,
  label,
  sectionId,
  homeAnchors,
}: {
  icon: string;
  label: string;
  sectionId: HomeSectionId;
  homeAnchors: boolean;
}) {
  return (
    <a
      className="nav-item"
      href={homeAnchors ? `/#${sectionId}` : "/"}
      data-home-section={homeAnchors ? undefined : sectionId}
    >
      <img src={icon} alt="" width={22} height={22} />
      <NavTooltip label={label} />
    </a>
  );
}

function Nav({ homeAnchors = false, responsiveHome = false }: { homeAnchors?: boolean; responsiveHome?: boolean }) {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [waving, setWaving] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        lastScrollY.current = 0;
        setCompact(false);
        return;
      }

      const delta = currentScrollY - lastScrollY.current;
      if (delta === 0) return;

      setCompact(delta > 0);
      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const intervalId = window.setInterval(() => setWaving(true), 8000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!responsiveHome || !menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, responsiveHome]);

  useEffect(() => {
    if (!responsiveHome) return;

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, [responsiveHome]);

  const handleMobileNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      className={`nav${responsiveHome ? " home-nav" : ""}${compact ? " nav--scrolled" : ""}${menuOpen ? " home-nav--open" : ""}`}
      aria-label="Primary navigation"
    >
      <div className="home-nav-top">
        <p className="nav-name">Sami Perwaiz</p>
        {responsiveHome ? (
          <button
            className="home-nav-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="home-mobile-navigation"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <span className="home-nav-toggle-icon" aria-hidden="true">
              <span className="home-nav-toggle-line home-nav-toggle-line--top" />
              <span className="home-nav-toggle-line home-nav-toggle-line--bottom" />
            </span>
          </button>
        ) : null}
      </div>
      <div className="nav-icons">
        {navItems.map((item) => (
          <NavIcon
            key={item.sectionId}
            icon={item.icon}
            label={item.label}
            sectionId={item.sectionId}
            homeAnchors={homeAnchors}
          />
        ))}
      </div>
      <p className="nav-hello sf sf-reg">
        <a
          className="nav-hello-link"
          href={homeAnchors ? "/#contact" : "/"}
          data-home-section={homeAnchors ? undefined : "contact"}
        >
          Say Hello
        </a>{" "}
        <span
          className={`nav-hello-wave${waving ? " nav-hello-wave--animate" : ""}`}
          onAnimationEnd={() => setWaving(false)}
          aria-hidden="true"
        >
          👋
        </span>
      </p>
      {responsiveHome ? (
        <ul className="home-nav-menu" id="home-mobile-navigation" aria-hidden={!menuOpen}>
          {mobileNavItems.map((item) => (
            <li key={item.sectionId}>
              <a href="/" data-home-section={item.sectionId} onClick={handleMobileNavClick}>
                <img src={item.icon} alt="" width={22} height={22} />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}

const toolkitTools = [
  { name: "Figma", icon: a.image573 },
  { name: "Framer", icon: a.image574 },
  { name: "Cursor", icon: a.image583 },
  { name: "ChatGPT", icon: a.image579 },
  { name: "Claude", icon: a.image575 },
  { name: "Google Gemini", icon: a.image578 },
  { name: "Google AI Studio", icon: a.image580 },
  { name: "OpenAI Codex", icon: a.image621 },
  { name: "Lovable", icon: a.image576 },
  { name: "Replit", icon: a.image622 },
  { name: "Canva", icon: a.image577 },
  { name: "Google Flow", icon: a.image625 },
  { name: "Hugeicons", icon: a.image581 },
  { name: "Tabler Icons", icon: a.image582 },
  { name: "DeepSeek", icon: a.image627 },
] as const;

const toolkitRows = [toolkitTools.slice(0, 5), toolkitTools.slice(5, 10), toolkitTools.slice(10, 15)];

type ToolkitTool = (typeof toolkitTools)[number];

function ToolItem({ tool }: { tool: ToolkitTool }) {
  return (
    <div className="tool-item">
      <img className="tool-icon" src={tool.icon} alt={tool.name} loading="lazy" decoding="async" />
      <NavTooltip label={tool.name} />
    </div>
  );
}

type ServiceCardData = {
  icon: string;
  iconVariant?: "landing";
  title: string;
  description: string;
  previewBase: string;
};

const serviceCards: ServiceCardData[] = [
  {
    icon: a.iconBrand,
    title: "Branding Design",
    description: "We develop brands that resonate and build trust with your customers.",
    previewBase: "/assets/optimized/home/serviceBrandingPreview",
  },
  {
    icon: a.iconApp,
    title: "App Design",
    description: "We develop brands that resonate and build trust with your customers.",
    previewBase: "/assets/optimized/home/serviceAppPreview",
  },
  {
    icon: a.iconWeb,
    title: "Website Design",
    description: "We create stunning, user-friendly websites that drive growth.",
    previewBase: "/assets/optimized/home/serviceWebPreview",
  },
  {
    icon: a.iconLanding,
    iconVariant: "landing",
    title: "Landing Page Design",
    description: "We build landing pages that are simple, beautiful, and effective.",
    previewBase: "/assets/optimized/home/serviceLandingPreview",
  },
  {
    icon: a.iconNocode,
    title: "No-Code Development",
    description: "Quickly develop high-quality solutions using Framer and Webflow.",
    previewBase: "/assets/optimized/home/serviceNocodePreview",
  },
];

const SERVICE_SCROLL_SPEED = 32;
const SERVICE_TOUCH_AXIS_THRESHOLD = 8;

type TouchAxis = "undetermined" | "horizontal" | "vertical";

type TouchGesture = {
  axis: TouchAxis;
  animationTime: number;
  deltaX: number;
  deltaY: number;
  ignore: boolean;
  startX: number;
  startY: number;
};

function createTouchGesture(): TouchGesture {
  return {
    axis: "undetermined",
    animationTime: 0,
    deltaX: 0,
    deltaY: 0,
    ignore: false,
    startX: 0,
    startY: 0,
  };
}

function ServiceCard({ card }: { card: ServiceCardData }) {
  return (
    <article className="service-card">
      {card.iconVariant === "landing" ? (
        <div className="service-icon landing">
          <img src={card.icon} alt="" loading="lazy" decoding="async" />
        </div>
      ) : (
        <img className="service-icon" src={card.icon} alt="" loading="lazy" decoding="async" />
      )}
      <div className="service-body">
        <div className="service-copy">
          <h3 className="sf sf-med">{card.title}</h3>
          <p className="sf sf-reg">{card.description}</p>
        </div>
        <div className="service-preview">
          <ResponsiveImage
            base={card.previewBase}
            widths={[320, 640, 960]}
            sizes="302px"
            sourceWidth={1208}
            sourceHeight={536}
            alt=""
          />
        </div>
      </div>
    </article>
  );
}

function ServicesCarousel() {
  const rowRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const animationDurationRef = useRef(0);
  const animationPhaseRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isTouchingRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const touchGestureRef = useRef<TouchGesture>(createTouchGesture());

  const normalizeAnimationTime = (time: number) => {
    const duration = animationDurationRef.current;
    if (duration <= 0) return 0;
    return ((time % duration) + duration) % duration;
  };

  const rebuildAnimation = useCallback(() => {
    const row = rowRef.current;
    const sequence = sequenceRef.current;
    if (!row || !sequence) return;

    const previousAnimation = animationRef.current;
    const previousDuration = animationDurationRef.current;
    if (previousAnimation && previousDuration > 0 && typeof previousAnimation.currentTime === "number") {
      animationPhaseRef.current = normalizeAnimationTime(previousAnimation.currentTime) / previousDuration;
    }

    previousAnimation?.cancel();
    animationRef.current = null;
    animationDurationRef.current = 0;
    row.style.removeProperty("transform");

    if (reducedMotionRef.current) return;

    const sequenceWidth = sequence.getBoundingClientRect().width;
    if (sequenceWidth <= 0) return;

    const duration = (sequenceWidth / SERVICE_SCROLL_SPEED) * 1000;
    const animation = row.animate(
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: `translate3d(${-sequenceWidth}px, 0, 0)` },
      ],
      {
        duration,
        easing: "linear",
        iterations: Infinity,
      },
    );

    animationDurationRef.current = duration;
    animation.currentTime = animationPhaseRef.current * duration;
    animationRef.current = animation;

    if (isHoveredRef.current || isTouchingRef.current) animation.pause();
  }, []);

  useLayoutEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReducedMotionChange = () => {
      reducedMotionRef.current = reducedMotionQuery.matches;
      rebuildAnimation();
    };
    const resizeObserver = new ResizeObserver(rebuildAnimation);

    reducedMotionRef.current = reducedMotionQuery.matches;
    rebuildAnimation();
    if (sequenceRef.current) resizeObserver.observe(sequenceRef.current);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      resizeObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      animationRef.current?.cancel();
      animationRef.current = null;
    };
  }, [rebuildAnimation]);

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) return;

    isHoveredRef.current = true;
    animationRef.current?.pause();
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) return;

    isHoveredRef.current = false;
    if (!isTouchingRef.current && !reducedMotionRef.current) animationRef.current?.play();
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current || event.touches.length !== 1) {
      touchGestureRef.current = { ...createTouchGesture(), ignore: true };
      return;
    }

    const touch = event.touches[0];
    touchGestureRef.current = {
      ...createTouchGesture(),
      animationTime:
        typeof animationRef.current?.currentTime === "number" ? animationRef.current.currentTime : 0,
      startX: touch.clientX,
      startY: touch.clientY,
    };
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const gesture = touchGestureRef.current;
    if (gesture.ignore || event.touches.length !== 1) return;

    const touch = event.touches[0];
    gesture.deltaX = touch.clientX - gesture.startX;
    gesture.deltaY = touch.clientY - gesture.startY;

    if (gesture.axis === "undetermined") {
      if (
        Math.abs(gesture.deltaX) < SERVICE_TOUCH_AXIS_THRESHOLD &&
        Math.abs(gesture.deltaY) < SERVICE_TOUCH_AXIS_THRESHOLD
      ) return;
      gesture.axis = Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY) ? "horizontal" : "vertical";
    }

    if (gesture.axis !== "horizontal") return;

    if (!isTouchingRef.current) {
      isTouchingRef.current = true;
      animationRef.current?.pause();
      gesture.animationTime =
        typeof animationRef.current?.currentTime === "number" ? animationRef.current.currentTime : 0;
    }

    if (animationRef.current) {
      const dragTime = (gesture.deltaX / SERVICE_SCROLL_SPEED) * 1000;
      animationRef.current.currentTime = normalizeAnimationTime(gesture.animationTime - dragTime);
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const gesture = touchGestureRef.current;
    if (gesture.ignore) {
      touchGestureRef.current = createTouchGesture();
      return;
    }

    const touch = event.changedTouches[0];
    if (touch) {
      gesture.deltaX = touch.clientX - gesture.startX;
      gesture.deltaY = touch.clientY - gesture.startY;
    }

    if (isTouchingRef.current) {
      isTouchingRef.current = false;
      if (!isHoveredRef.current && !reducedMotionRef.current) animationRef.current?.play();
    }
    touchGestureRef.current = createTouchGesture();
  };

  const handleTouchCancel = () => {
    isTouchingRef.current = false;
    touchGestureRef.current = createTouchGesture();
    if (!isHoveredRef.current && !reducedMotionRef.current) animationRef.current?.play();
  };

  return (
    <div className="services-carousel">
      <div
        className="service-viewport"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        <div className="service-row" ref={rowRef}>
          <div className="service-sequence" ref={sequenceRef}>
            {serviceCards.map((card) => (
              <ServiceCard card={card} key={card.title} />
            ))}
          </div>
          <div className="service-sequence" aria-hidden="true">
            {serviceCards.map((card) => (
              <ServiceCard card={card} key={`next-${card.title}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Nav responsiveHome />
      <div className="page">

      <section className="home-hero">
        <div className="hero-title" id="hero">
          <div className="hero-name-row">
            <p className="hero-im sf sf-reg">I'm</p>
            <ResponsiveImage
              className="hero-photo"
              base="/assets/optimized/home/imgRectangle1410127957"
              widths={[64, 128, 192]}
              sizes="58px"
              sourceWidth={2000}
              sourceHeight={2000}
              alt=""
              loading="eager"
              fetchPriority="high"
            />
            <p className="hero-sami sf sf-reg">Sami</p>
          </div>
          <p className="hero-balance sf sf-reg">
            Designing Digital Products That <span className="black">Balance User</span> Needs and Business{" "}
            <span className="black">Goals</span>
          </p>
        </div>
        <p className="hero-tag sf sf-reg">
          I design people-focused interfaces that solve problems and create seamless user experiences.
        </p>
      </section>

      <section className="section vision">
        <div className="section-head vision-head">
          <h2 className="sf sf-med">From Vision to Interface</h2>
          <p className="sf sf-reg">
            Every exploration is an opportunity to challenge ideas, refine details, and transform concepts into
            experiences that feel intuitive, engaging, and purposeful.
          </p>
        </div>
        <div className="showcase">
          <div className="row-2">
            <div
              className="card-sm"
              style={{ backgroundImage: "linear-gradient(128.1deg, rgb(5, 0, 45) 0%, rgb(4, 8, 72) 100%)" }}
            >
              <ResponsiveImage className="inner-screen" base="/assets/optimized/home/imgSignUpScreen1" widths={[640, 1024, 1280]} sizes="(min-width: 1200px) 608px, calc(100vw - 80px)" sourceWidth={4096} sourceHeight={2913} alt="" />
            </div>
            <div
              className="card-sm"
              style={{ backgroundImage: "linear-gradient(128.1deg, rgb(24, 24, 24) 0%, rgb(9, 9, 9) 100%)" }}
            >
              <ResponsiveImage className="inner-screen border-dark" base="/assets/optimized/home/imgSignUpScreen2" widths={[640, 1024, 1280]} sizes="(min-width: 1200px) 608px, calc(100vw - 80px)" sourceWidth={4096} sourceHeight={2913} alt="" />
            </div>
          </div>
          <div
            className="card-lg"
            style={{ backgroundImage: "linear-gradient(128.11deg, rgb(21, 25, 10) 0%, rgb(13, 14, 6) 100%)" }}
          >
              <ResponsiveImage className="inner-lg" base="/assets/optimized/home/imgSignUpScreen3" widths={[768, 1024, 1440, 1920, 2304, 2560]} sizes="(min-width: 1200px) 1278px, calc(100vw - 80px)" sourceWidth={4096} sourceHeight={2913} alt="" />
          </div>
          <div className="row-2">
            <div
              className="card-sm"
              style={{ backgroundImage: "linear-gradient(128.1deg, rgb(255, 243, 248) 0%, rgb(255, 255, 255) 100%)" }}
            >
              <ResponsiveImage className="inner-screen border-f5" base="/assets/optimized/home/imgSignUpScreen4" widths={[640, 1024, 1280]} sizes="(min-width: 1200px) 608px, calc(100vw - 80px)" sourceWidth={4096} sourceHeight={2913} alt="" />
            </div>
            <div
              className="card-sm"
              style={{ backgroundImage: "linear-gradient(128.1deg, rgb(61, 14, 5) 0%, rgb(30, 11, 6) 100%)" }}
            >
              <ResponsiveImage className="inner-screen" base="/assets/optimized/home/imgSignUpScreen5" widths={[640, 1024, 1280]} sizes="(min-width: 1200px) 608px, calc(100vw - 80px)" sourceWidth={4096} sourceHeight={2913} alt="" />
            </div>
          </div>
          <div
            className="card-lg"
            style={{ backgroundImage: "linear-gradient(128.11deg, rgb(249, 249, 249) 0%, rgb(238, 238, 238) 100%)" }}
          >
            <ResponsiveImage className="inner-lg6" base="/assets/optimized/home/imgSignUpScreen6" widths={[768, 1024, 1440, 1920, 2304, 2560]} sizes="(min-width: 1200px) 1272px, calc(100vw - 80px)" sourceWidth={4096} sourceHeight={2913} alt="" />
          </div>
          <div className="row-2">
            <div
              className="card-sm"
              style={{
                backgroundImage: "linear-gradient(217.25deg, rgb(247, 247, 247) 12.079%, rgb(240, 240, 240) 87.921%)",
              }}
            >
              <ResponsiveImage className="inner-screen" base="/assets/optimized/home/imgDashboard3" widths={[640, 1024, 1280]} sizes="(min-width: 1200px) 608px, calc(100vw - 80px)" sourceWidth={4096} sourceHeight={2913} alt="" />
            </div>
            <div
              className="card-sm"
              style={{ backgroundImage: "linear-gradient(128.1deg, rgb(242, 242, 242) 0%, rgb(249, 249, 249) 100%)" }}
            >
              <ResponsiveImage className="inner-screen border-ea" base="/assets/optimized/home/imgSignUpScreen7" widths={[640, 1024, 1280]} sizes="(min-width: 1200px) 608px, calc(100vw - 80px)" sourceWidth={4096} sourceHeight={2913} alt="" />
            </div>
          </div>
          <ProjectsVideoCard />
          <div className="grid-4">
            <div className="cell" style={{ background: "#fafafa" }}>
              <ResponsiveImage
                base="/assets/optimized/home/imgImage69"
                widths={[256, 512, 768]}
                sizes="218px"
                sourceWidth={1424}
                sourceHeight={1430}
                alt=""
                style={{ position: "absolute", left: 62, top: 125, width: 218, height: 219, objectFit: "cover" }}
              />
              <div className="cross-h" style={{ top: 106 }}>
                <img src={a.line519} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="cross-h" style={{ top: 83 }}>
                <img src={a.line519} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="cross-h" style={{ top: 362 }}>
                <img src={a.line519} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="cross-h" style={{ top: 385 }}>
                <img src={a.line519} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="cross-v">
                <div className="cross-v-inner">
                  <img src={a.line521} alt="" loading="lazy" decoding="async" />
                </div>
              </div>
              <ResponsiveImage
                base="/assets/optimized/home/imgImage565"
                widths={[320, 640, 800]}
                sizes="248px"
                sourceWidth={1660}
                sourceHeight={2050}
                alt=""
                style={{
                  position: "absolute",
                  left: "calc(50% + 161px)",
                  top: "calc(50% + 55px)",
                  transform: "translate(-50%, -50%)",
                  width: 248,
                  height: 306,
                  objectFit: "cover",
                }}
              />
            </div>
            <PurpleNavigationVideoCard />
            <div
              className="cell"
              style={{ backgroundImage: "linear-gradient(128.1deg, rgb(249, 249, 249) 0%, rgb(238, 238, 238) 100%)" }}
            >
              <img className="inner-screen" src={a.image559} alt="" loading="lazy" decoding="async" />
            </div>
            <div
              className="cell"
              style={{
                backgroundImage:
                  "linear-gradient(128.1deg, rgb(249, 249, 249) 0%, rgb(238, 238, 238) 100%), linear-gradient(90deg, rgb(13, 39, 36) 0%, rgb(13, 39, 36) 100%)",
              }}
            >
              <Glow src={a.ellipse79} variant="b" style={{ left: -108.42, top: 427.43, width: 377.335, height: 283.142 }} />
              <ResponsiveImage
                className="inner-screen border-f5"
                base="/assets/optimized/home/imgImage564"
                widths={[640, 1280]}
                sizes="588px"
                sourceWidth={2560}
                sourceHeight={984}
                alt=""
                style={{ width: 588, height: 226, borderRadius: 8 }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section experience" id="about">
        <div className="section-head experience-head">
          <h2 className="sf sf-med">A Journey of Thoughtful Design</h2>
          <p className="sf sf-reg">
            From startups to product teams, every experience has strengthened my ability to turn complex ideas into
            simple, intuitive digital experiences.
          </p>
        </div>
        <div className="exp-body">
          <div className="exp-top">
            <ResponsiveImage
              className="exp-photo"
              base="/assets/optimized/home/imgRectangle1410127969"
              widths={[400, 800, 1200]}
              sizes="(min-width: 1200px) 346px, calc(100vw - 64px)"
              sourceWidth={1254}
              sourceHeight={1254}
              alt=""
            />
            <div className="exp-cards">
              <div className="exp-row">
                <JobCard
                  logo={a.logoNuexus}
                  name="NUEXUS Technologies"
                  role="UI/UX Designer"
                  href="https://www.linkedin.com/company/nuexus/posts/?feedView=all"
                  accessibleLabel="Open NUEXUS Technologies LinkedIn profile"
                />
                <JobCard
                  logo={a.logoAjencia}
                  name="Ajencia"
                  role="Product Designer"
                  href="https://www.linkedin.com/company/ajencia/"
                  accessibleLabel="Open Ajencia LinkedIn profile"
                />
              </div>
              <div className="exp-row">
                <JobCard
                  logo={a.logoAlpha}
                  name="Alpha Hive AI"
                  role="UI/UX Team Lead"
                  href="https://www.linkedin.com/company/alpha-hive-ai/posts/?feedView=all"
                  accessibleLabel="Open Alpha Hive AI LinkedIn profile"
                  bordered
                />
                <JobCard
                  logo={a.logoUpwork}
                  name="Upwork"
                  role="UI/UX Designer"
                  href="https://www.upwork.com/freelancers/~01553c9aebc1fcfdea"
                  accessibleLabel="Open Upwork profile"
                  arrow={a.arrow16b}
                />
              </div>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <p className="stat-label sf sf-reg">Years of Experience</p>
              <p className="stat-value sf sf-med">3+</p>
            </div>
            <div className="stat">
              <p className="stat-label sf sf-reg">Products Designed</p>
              <p className="stat-value sf sf-med">15+</p>
            </div>
            <div className="stat wide">
              <p className="stat-label sf sf-reg">Clients Served</p>
              <p className="stat-value sf sf-med">4+</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section gallery">
        <div className="section-head gallery-head">
          <h2 className="sf sf-med">AI-Powered Creations</h2>
          <p className="sf sf-reg">
            A collection of AI-powered visuals exploring creative ideas, unique concepts, and new possibilities in
            digital design.
          </p>
        </div>
        <div className="gallery-grid">
          <div className="g-wide">
            <ResponsiveImage base="/assets/optimized/gallery/imgRectangle1410127900" widths={[640, 1024, 1200, 1800]} sizes="(min-width: 1200px) 888px, calc(100vw - 40px)" sourceWidth={4096} sourceHeight={2286} alt="" avif />
          </div>
          <div className="g-cell">
            <ResponsiveImage base="/assets/optimized/gallery/imgRectangle1410127907" widths={[480, 900, 1200]} sizes="(min-width: 1200px) 436px, (min-width: 768px) calc(50vw - 32px), calc(100vw - 40px)" sourceWidth={4096} sourceHeight={4096} alt="" avif />
          </div>
          <div className="g-cell">
            <ResponsiveImage base="/assets/optimized/gallery/imgRectangle1410127908" widths={[480, 900, 1200]} sizes="(min-width: 1200px) 436px, (min-width: 768px) calc(50vw - 32px), calc(100vw - 40px)" sourceWidth={4096} sourceHeight={3277} alt="" avif />
          </div>
          <div className="g-cell">
            <ResponsiveImage base="/assets/optimized/gallery/imgRectangle1410127902" widths={[480, 900, 1200]} sizes="(min-width: 1200px) 436px, (min-width: 768px) calc(50vw - 32px), calc(100vw - 40px)" sourceWidth={2508} sourceHeight={2508} alt="" avif />
          </div>
          <div className="g-cell">
            <ResponsiveImage base="/assets/optimized/gallery/imgRectangle1410127904" widths={[480, 900, 1200]} sizes="(min-width: 1200px) 436px, (min-width: 768px) calc(50vw - 32px), calc(100vw - 40px)" sourceWidth={2508} sourceHeight={2508} alt="" avif />
          </div>
          <div className="g-wide">
            <ResponsiveImage className="g-crop6" base="/assets/optimized/gallery/imgRectangle1410127906" widths={[640, 1024, 1200, 1800]} sizes="(min-width: 1200px) 888px, calc(100vw - 40px)" sourceWidth={3344} sourceHeight={1882} alt="" avif />
          </div>
          <div className="g-cell">
            <ResponsiveImage className="g-crop7" base="/assets/optimized/gallery/imgRectangle1410127910" widths={[480, 900, 1200]} sizes="(min-width: 1200px) 436px, (min-width: 768px) calc(50vw - 32px), calc(100vw - 40px)" sourceWidth={2172} sourceHeight={2896} alt="" avif />
          </div>
        </div>
      </section>

      <section className="section projects" id="projects">
        <div className="section-head projects-head">
          <h2 className="sf sf-med">Designed to Solve</h2>
          <p className="sf sf-reg">
            Projects showcase innovative product ideas, excellent execution, and user-centric design principles.
          </p>
        </div>
        <div className="project-list">
          <div className="project-row">
            <a className="project" href="/projects/flare" aria-label="Read the Flare case study">
              <div className="thumb">
                <img className="thumb-bg" src={a.flareThumb} alt="" width={1024} height={626} loading="lazy" decoding="async" />
              </div>
              <div>
                <p className="project-title sf sf-med">Flare</p>
                <p className="project-sub sf sf-reg">AI Coaching for Better Conversations</p>
              </div>
            </a>
            <a className="project" href="/projects/shipflex" aria-label="Read the ShipFlex case study">
              <div className="thumb">
                <img className="thumb-bg" src={a.shipFlexThumb} alt="" width={1024} height={626} loading="lazy" decoding="async" />
              </div>
              <div>
                <p className="project-title sf sf-med">ShipFlex</p>
                <p className="project-sub sf sf-reg">Smart Shipping Platform for eCommerce</p>
              </div>
            </a>
          </div>
          <div className="project-row">
            <a className="project" href="/projects/unflappable" aria-label="Read the Unflappable case study">
              <div className="thumb">
                <img className="thumb-bg" src={a.unflappableThumb} alt="" width={1024} height={626} loading="lazy" decoding="async" />
              </div>
              <div>
                <p className="project-title sf sf-med">Unflappable</p>
                <p className="project-sub sf sf-reg">Stay Calm. Execute Every Day.</p>
              </div>
            </a>
            <a className="project" href="/projects/axishealth" aria-label="Read the AxisHealth case study">
              <div className="thumb">
                <img className="thumb-bg" src={a.axisHealthThumb} alt="" width={1024} height={626} loading="lazy" decoding="async" />
              </div>
              <div>
                <p className="project-title sf sf-med">AxisHealth</p>
                <p className="project-sub sf sf-reg">All-in-One Personalized Health Platform</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="section toolkit" id="toolkit">
        <div className="toolkit-inner">
          <div className="toolkit-head">
            <h2 className="sf sf-med">My Design Toolkit</h2>
            <p className="sf sf-reg">
              From product design to AI-powered workflows, these tools help me transform ideas into thoughtful digital
              experiences.
            </p>
          </div>
          <div className="toolkit-board">
            {toolkitRows.map((row, rowIndex) => (
              <div className="tool-row" key={`tool-row-${rowIndex}`}>
                {row.map((tool) => (
                  <ToolItem key={tool.name} tool={tool} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section services" id="services">
        <div className="services-head">
          <h2 className="sf sf-med">What I Do Best</h2>
          <p className="sf sf-reg">
            I turn ideas into clear, engaging digital experiences from the first concept to the final interface.
          </p>
        </div>
        <ServicesCarousel />
      </section>

      <FaqSection />

      <section className="section testimonials" id="testimonials">
        <div className="section-head t-head">
          <h2 className="sf sf-med">The Work Speaks for Itself</h2>
          <p className="sf sf-reg">
            See what clients and collaborators have to say about their experience working with me.
          </p>
        </div>
        <div className="t-grid">
          <div className="t-row">
            <article className="t-card">
              <p className="t-quote sf sf-reg">
                Sami was a valuable part of our product design work. He has a good understanding of user experience and
                knows how to turn complex requirements into simple, clean designs. He's thoughtful with his decisions,
                pays attention to details, and works well with the team. His contribution to the design process was
                genuinely appreciated.
              </p>
              <div className="t-foot">
                <div className="t-person">
                  <div style={{ position: "relative", width: 36, height: 36 }}>
                    <img className="t-avatar" src={a.portrait} alt="" width={192} height={192} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0 }} />
                    <img className="t-avatar" src={a.logoAjencia} alt="" loading="lazy" decoding="async" style={{ position: "absolute", inset: 0 }} />
                  </div>
                  <div className="t-meta">
                    <p className="t-role sf sf-reg">Company</p>
                    <p className="t-name sf sf-reg">Ajencia</p>
                  </div>
                </div>
                <Stars />
              </div>
            </article>
            <article className="t-card">
              <p className="t-quote sf sf-reg">
                I had a really good experience working with Sami on my project. He understood what I was looking for and
                came up with ideas that made the design even better. Communication was easy, and he was always open to
                feedback. I appreciated his attention to detail and how smoothly everything went from start to finish.
              </p>
              <div className="t-foot">
                <div className="t-person">
                  <img className="t-avatar" src={a.avatar2} alt="" loading="lazy" decoding="async" />
                  <div className="t-meta">
                    <p className="t-role sf sf-reg">Client</p>
                    <p className="t-name sf sf-reg">Green Micheel</p>
                  </div>
                </div>
                <Stars />
              </div>
            </article>
          </div>
          <div className="t-row">
            <article className="t-card">
              <p className="t-quote sf sf-reg">
                I've worked closely with Sami at Alpha Hive AI, and what stands out is his approach to solving design
                problems. He doesn't just focus on visuals; he thinks about usability and the overall product experience.
                He's reliable, takes ownership of his work, and is always willing to improve. He's been a great person to
                have on the design team.
              </p>
              <div className="t-foot">
                <div className="t-person">
                  <img className="t-avatar" src={a.avatar3} alt="" loading="lazy" decoding="async" />
                  <div className="t-meta">
                    <p className="t-role sf sf-reg">CEO</p>
                    <p className="t-name sf sf-reg">Huzaifa Sheikh</p>
                  </div>
                </div>
                <Stars />
              </div>
            </article>
            <article className="t-card">
              <p className="t-quote sf sf-reg">
                I worked with Sami on a project, and collaborating with him was a great experience. His designs were
                clear, well-structured, and easy to work with during development. He was always available to discuss ideas
                or resolve questions, which made the whole process easier. I really appreciated his communication and
                attention to the little details.
              </p>
              <div className="t-foot">
                <div className="t-person">
                  <img className="t-avatar" src={a.avatar4} alt="" width={128} height={128} loading="lazy" decoding="async" />
                  <div className="t-meta">
                    <p className="t-role sf sf-reg">Full-Stack Engineer</p>
                    <p className="t-name sf sf-reg">Rimsha Shafiq</p>
                  </div>
                </div>
                <Stars />
              </div>
            </article>
          </div>
        </div>
      </section>

      <ContactSection />

      <div className="home-page-tail">
        <HomeCta onAction={() => scrollToHomeSection("contact")} />
        <Footer sectionNavigation />
      </div>
      </div>
    </>
  );
}

export function FlareCaseStudy() {
  const metadata = [
    ["Role", "UI/UX Designer"],
    ["Timeline", "10 Days"],
    ["Platform", "iPhone Mobile Application"],
    ["Industry", "AI Communication & Personal Development"],
    ["Team", "Solo Project"],
    ["Tools", "Figma, ChatGPT, Gemini AI"],
  ];

  const productSections = [
    {
      title: "Splash Screen",
      copy: "The splash screen introduces Flare with a clean and distraction-free experience. Bold typography and generous white space establish a modern, approachable personality while the application loads.",
      image: a.image567,
      tone: "pink",
    },
    {
      title: "Onboarding Experience",
      copy: "A short, friendly onboarding journey communicates the product's purpose before users begin. Clear messaging and approachable visuals help people understand what Flare offers and move naturally into the core experience.",
      image: a.image568,
      tone: "lavender",
    },
    {
      title: "AI Coaching Session",
      copy: "The AI coaching session is the core experience of Flare, guiding users through real-time conversation practice in a supportive and distraction-free environment. Live transcription, clear visual hierarchy, and simple feedback keep attention on expressing thoughts with confidence.",
      image: a.image568,
      tone: "magenta",
    },
    {
      title: "Authentication",
      copy: "The login and sign-up screens follow a clean, minimal layout that reduces distractions while making account creation and sign-in simple and intuitive. Clear labels, familiar input patterns, and prominent actions minimize friction for first-time and returning users.",
      image: a.image567,
      tone: "violet",
    },
    {
      title: "Session History",
      copy: "Rather than treating coaching sessions as temporary, Flare builds a timeline of completed sessions that users can review whenever they need encouragement or perspective. Users can open previous sessions, start a new coaching session, or remove entries while retaining complete control of their personal data.",
      image: a.image567,
      tone: "lavender",
    },
    {
      title: "AI-Powered Session Summary",
      copy: "After every coaching session, Flare generates a personalized summary that helps users understand how they performed. Key moments, confidence levels, communication patterns, and practical suggestions are presented in a clear layout that encourages reflection without feeling overwhelming.",
      image: a.image568,
      tone: "magenta",
    },
    {
      title: "Profile & Settings",
      copy: "Flare brings essential controls together in a clean, distraction-free interface that is quick to navigate and easy to understand. Users can update their profile, customize reminder preferences, manage advanced features, and review a simple snapshot of recent emotional trends.",
      image: a.image567,
      tone: "pink",
    },
  ] as const;

  return (
    <div className="flare-page">
      <Nav homeAnchors />
      <main className="case-study">
        <section className="flare-intro" aria-labelledby="flare-title">
          <p className="case-kicker">CASE STUDY</p>
          <h1 id="flare-title">Flare</h1>
          <h2>Smarter Conversations. Stronger Connections.</h2>
          <p className="case-lead">
            Flare is an AI-powered communication coach designed for iPhone users who want to improve the way they
            communicate. Through personalized guidance, conversation practice, and actionable feedback, the app helps
            users build confidence, express themselves more clearly, and develop stronger relationships in both
            personal and professional settings.
          </p>
        </section>

        <section className="case-metadata" aria-label="Project details">
          {metadata.map(([label, value]) => (
            <div className="case-metadata-card" key={label}>
              <h3>{label}</h3>
              <p>{value}</p>
            </div>
          ))}
        </section>

        <section className="case-copy-block">
          <p className="case-kicker">PROJECT OVERVIEW</p>
          <h2>AI coaching that makes practice feel natural.</h2>
          <p>
            Strong communication is difficult to build without a safe place to practice. Flare bridges that gap by
            combining AI-powered coaching with actionable feedback. The product helps people improve clarity,
            strengthen confidence, and develop healthier conversation habits through an intuitive mobile experience.
          </p>
        </section>

        <section className="flare-hero-art" aria-label="Flare application preview">
          <img className="flare-hero-gradient" src={a.image616} alt="" loading="lazy" decoding="async" />
          <div className="flare-hero-screens">
            <img src={a.image567} alt="Flare home screen" loading="lazy" decoding="async" />
            <img src={a.image568} alt="Flare live transcription screen" loading="lazy" decoding="async" />
          </div>
        </section>

        <section className="case-copy-block">
          <p className="case-kicker">DESIGN PHILOSOPHY</p>
          <h2>Calm, encouraging, and focused.</h2>
          <p>
            Every interaction was designed to make learning feel approachable rather than intimidating. Soft color,
            familiar controls, and generous space reduce cognitive load so users can stay present in the conversation
            and return to practice regularly.
          </p>
        </section>

        <section className="case-product-sections" aria-label="Flare product experience">
          {productSections.map((section, index) => (
            <article className="case-product-section" key={section.title}>
              <div className="case-product-copy">
                <p className="case-step">0{index + 1}</p>
                <h2>{section.title}</h2>
                <p>{section.copy}</p>
              </div>
              <div className={`case-screen-panel case-screen-panel--${section.tone}`}>
                <img src={section.image} alt={`${section.title} in the Flare app`} loading="lazy" decoding="async" />
              </div>
            </article>
          ))}
        </section>

        <section className="case-copy-block case-copy-block--core">
          <p className="case-kicker">THE FLARE EXPERIENCE</p>
          <h2>Guidance, reflection, and continuous improvement.</h2>
          <p>
            Flare is designed to help users build stronger communication skills through structured AI coaching and
            real-time feedback. By combining guided speaking sessions, personalized insights, session history, and
            performance analysis, the app creates a continuous learning experience that supports confidence,
            self-awareness, and long-term personal growth.
          </p>
        </section>

        <section className="flare-system" aria-labelledby="flare-system-title">
          <div className="flare-system-copy">
            <p className="case-kicker">DESIGN SYSTEM</p>
            <h2 id="flare-system-title">A cohesive, distraction-free visual language.</h2>
            <p>
              Every element in Flare was designed to create a cohesive and distraction-free experience. Typography,
              colors, buttons, form fields, interactive controls, and reusable UI patterns make the application feel
              familiar and intuitive across every screen.
            </p>
          </div>
          <div className="flare-system-board" aria-label="Flare design system preview">
            <div className="system-type-card">
              <span className="system-label">Typography</span>
              <strong>Flare</strong>
              <span>SF Pro / Clear hierarchy</span>
            </div>
            <div className="system-colors" aria-label="Flare color palette">
              <span className="system-label">Color</span>
              <i className="system-swatch system-swatch--pink" />
              <i className="system-swatch system-swatch--violet" />
              <i className="system-swatch system-swatch--ink" />
            </div>
            <div className="system-component">
              <span className="system-label">Components</span>
              <span className="system-button">Start New Session</span>
              <span className="system-field">Your email address</span>
            </div>
          </div>
        </section>

        <section className="case-copy-block case-copy-block--outcome">
          <p className="case-kicker">OUTCOME</p>
          <h2>A more confident way to communicate.</h2>
          <p>
            Flare evolved into an AI-powered communication coaching platform that transforms everyday conversations
            into opportunities for personal growth. Guided speaking sessions, real-time transcription, personalized
            feedback, and session insights work together in a clear, human-centered experience.
          </p>
        </section>

        <section className="case-reflection-grid" aria-label="Project conclusions">
          <article>
            <p className="case-kicker">KEY LEARNINGS</p>
            <h2>Designing intelligence with empathy.</h2>
            <p>
              Designing Flare reinforced the importance of combining artificial intelligence with thoughtful user
              experience. The process emphasized intuitive AI-assisted coaching, actionable communication feedback,
              consistent interaction patterns, and experiences that encourage users to return with confidence.
            </p>
          </article>
          <article>
            <p className="case-kicker">FUTURE SCALABILITY</p>
            <h2>Built to grow with the user.</h2>
            <p>
              Flare is designed with scalability in mind. The platform can expand with advanced AI coaching,
              personalized learning paths, voice analytics, conversation simulations, and deeper performance insights
              while maintaining the same clean, user-centered experience.
            </p>
          </article>
        </section>

        <section className="case-final-reflection">
          <p className="case-kicker">FINAL REFLECTION</p>
          <h2>AI-powered products can still feel deeply human.</h2>
          <p>
            Flare reflects my approach to designing AI-powered digital products that combine intelligent technology
            with human-centered design. By focusing on clarity, usability, and meaningful interactions, the product
            transforms communication practice into an engaging experience that helps users build confidence, improve
            speaking skills, and grow through consistent feedback.
          </p>
        </section>

        <section className="flare-closing-art" aria-label="Flare mobile experience">
          <img src={a.image617} alt="" loading="lazy" decoding="async" />
          <img src={a.image567} alt="Flare communication coach home screen" loading="lazy" decoding="async" />
          <img src={a.image568} alt="Flare communication coach transcription screen" loading="lazy" decoding="async" />
        </section>
      </main>
      <Footer />
    </div>
  );
}

const CASE_STUDY_PATHS = [
  "/projects/flare",
  "/projects/shipflex",
  "/projects/unflappable",
  "/projects/axishealth",
] as const;

type CaseStudyPath = (typeof CASE_STUDY_PATHS)[number];
type NavigationPhase = "home" | "opening-ready" | "opening" | "case" | "closing-ready" | "closing";

const PAGE_TRANSITION_DURATION = 480;
const REDUCED_PAGE_TRANSITION_DURATION = 120;

function getCaseStudyPath(pathname: string): CaseStudyPath | null {
  return CASE_STUDY_PATHS.find((path) => path === pathname) ?? null;
}

function CaseStudyRoute({ path }: { path: CaseStudyPath }) {
  if (path === "/projects/flare") return <FlareCaseStudyPage />;
  if (path === "/projects/shipflex") return <ShipFlexCaseStudyPage />;
  if (path === "/projects/unflappable") return <UnflappableCaseStudyPage />;
  return <AxisHealthCaseStudyPage />;
}

type ScrollLockSnapshot = {
  bodyOverflow: string;
  bodyPaddingRight: string;
  htmlOverflow: string;
  htmlOverscrollBehavior: string;
};

function getHistoryState() {
  return window.history.state && typeof window.history.state === "object" ? window.history.state : {};
}

function scrollWindowImmediately(top: number) {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo({ top, left: 0, behavior: "auto" });
  root.style.scrollBehavior = previousScrollBehavior;
}

export default function App() {
  const initialCasePath = getCaseStudyPath(window.location.pathname);
  const [phase, setPhase] = useState<NavigationPhase>(initialCasePath ? "case" : "home");
  const [casePath, setCasePath] = useState<CaseStudyPath | null>(initialCasePath);
  const [hasHomeLayer, setHasHomeLayer] = useState(!initialCasePath);
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const phaseRef = useRef(phase);
  const casePathRef = useRef(casePath);
  const hasHomeLayerRef = useRef(hasHomeLayer);
  const homeScrollRef = useRef(0);
  const caseScrollRef = useRef(0);
  const projectTriggerRef = useRef<HTMLAnchorElement | null>(null);
  const caseLayerRef = useRef<HTMLDivElement>(null);
  const homeScrollLayerRef = useRef<HTMLDivElement>(null);
  const caseScrollLayerRef = useRef<HTMLDivElement>(null);
  const scrollLockRef = useRef<ScrollLockSnapshot | null>(null);
  const pendingCloseRef = useRef(false);
  const restoreHomeScrollRef = useRef(false);
  const focusCaseRef = useRef(false);

  phaseRef.current = phase;
  casePathRef.current = casePath;
  hasHomeLayerRef.current = hasHomeLayer;

  const isTransitioning =
    phase === "opening-ready" || phase === "opening" || phase === "closing-ready" || phase === "closing";

  const lockDocumentScroll = useCallback(() => {
    if (scrollLockRef.current) return;

    const root = document.documentElement;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const currentBodyPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    scrollLockRef.current = {
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      htmlOverflow: root.style.overflow,
      htmlOverscrollBehavior: root.style.overscrollBehavior,
    };

    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${currentBodyPadding + scrollbarWidth}px`;
  }, []);

  const unlockDocumentScroll = useCallback(() => {
    const snapshot = scrollLockRef.current;
    if (!snapshot) return;

    document.body.style.overflow = snapshot.bodyOverflow;
    document.body.style.paddingRight = snapshot.bodyPaddingRight;
    document.documentElement.style.overflow = snapshot.htmlOverflow;
    document.documentElement.style.overscrollBehavior = snapshot.htmlOverscrollBehavior;
    scrollLockRef.current = null;
  }, []);

  const openCaseStudy = useCallback(
    (nextPath: CaseStudyPath, trigger: HTMLAnchorElement | null, updateHistory: boolean, savedScroll?: number) => {
      if (phaseRef.current !== "home") return;

      const homeScroll = savedScroll ?? window.scrollY;
      homeScrollRef.current = homeScroll;
      caseScrollRef.current = 0;
      projectTriggerRef.current = trigger;
      pendingCloseRef.current = false;
      focusCaseRef.current = true;
      phaseRef.current = "opening-ready";
      casePathRef.current = nextPath;
      hasHomeLayerRef.current = true;
      setHasHomeLayer(true);
      setCasePath(nextPath);
      setPhase("opening-ready");

      if (updateHistory) {
        window.history.replaceState(
          { ...getHistoryState(), portfolioPage: "home", homeScrollY: homeScroll },
          "",
          window.location.href,
        );
        window.history.pushState(
          { portfolioPage: "case", casePath: nextPath, homeScrollY: homeScroll },
          "",
          nextPath,
        );
      }
    },
    [],
  );

  const closeCaseStudy = useCallback(() => {
    const currentPhase = phaseRef.current;

    if (currentPhase === "opening-ready" || currentPhase === "opening") {
      pendingCloseRef.current = true;
      return;
    }

    if (currentPhase !== "case" || !hasHomeLayerRef.current) return;

    caseScrollRef.current = window.scrollY;
    phaseRef.current = "closing-ready";
    setPhase("closing-ready");
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    if (!initialCasePath) {
      window.history.replaceState(
        { ...getHistoryState(), portfolioPage: "home", homeScrollY: window.scrollY },
        "",
        window.location.href,
      );
    }

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [initialCasePath]);

  useLayoutEffect(() => {
    if (isTransitioning) {
      lockDocumentScroll();
      if (homeScrollLayerRef.current) homeScrollLayerRef.current.scrollTop = homeScrollRef.current;
      if (caseScrollLayerRef.current) caseScrollLayerRef.current.scrollTop = caseScrollRef.current;
      return;
    }

    unlockDocumentScroll();

    if (phase === "home" && restoreHomeScrollRef.current) {
      restoreHomeScrollRef.current = false;
      scrollWindowImmediately(homeScrollRef.current);
    } else if (phase === "case" && focusCaseRef.current) {
      scrollWindowImmediately(0);
    }
  }, [isTransitioning, lockDocumentScroll, phase, unlockDocumentScroll]);

  useEffect(() => {
    if (phase !== "opening-ready" && phase !== "closing-ready") return;

    let secondFrame = 0;
    const nextPhase: NavigationPhase = phase === "opening-ready" ? "opening" : "closing";
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        phaseRef.current = nextPhase;
        setPhase(nextPhase);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "opening" && phase !== "closing") return;

    const duration = reducedMotion ? REDUCED_PAGE_TRANSITION_DURATION : PAGE_TRANSITION_DURATION;
    const timer = window.setTimeout(() => {
      if (phase === "opening") {
        if (pendingCloseRef.current) {
          pendingCloseRef.current = false;
          caseScrollRef.current = 0;
          phaseRef.current = "closing-ready";
          setPhase("closing-ready");
          return;
        }

        phaseRef.current = "case";
        setPhase("case");
        return;
      }

      restoreHomeScrollRef.current = true;
      phaseRef.current = "home";
      casePathRef.current = null;
      setCasePath(null);
      setPhase("home");
    }, duration);

    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase === "case" && focusCaseRef.current) {
      focusCaseRef.current = false;
      const frame = window.requestAnimationFrame(() => {
        caseLayerRef.current?.querySelector<HTMLAnchorElement>(".flare-navbar-back")?.focus({ preventScroll: true });
      });
      return () => window.cancelAnimationFrame(frame);
    }

    if (phase === "home" && projectTriggerRef.current) {
      const trigger = projectTriggerRef.current;
      projectTriggerRef.current = null;
      const frame = window.requestAnimationFrame(() => trigger.isConnected && trigger.focus({ preventScroll: true }));
      return () => window.cancelAnimationFrame(frame);
    }
  }, [phase]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const nextCasePath = getCaseStudyPath(window.location.pathname);

      if (nextCasePath) {
        if (phaseRef.current === "home") {
          const savedScroll =
            event.state && typeof event.state.homeScrollY === "number" ? event.state.homeScrollY : window.scrollY;
          openCaseStudy(nextCasePath, null, false, savedScroll);
        } else if (phaseRef.current === "case" && casePathRef.current !== nextCasePath) {
          setCasePath(nextCasePath);
          scrollWindowImmediately(0);
        }
        return;
      }

      if (casePathRef.current && hasHomeLayerRef.current) {
        closeCaseStudy();
        return;
      }

      setCasePath(null);
      setHasHomeLayer(true);
      phaseRef.current = "home";
      casePathRef.current = null;
      hasHomeLayerRef.current = true;
      setPhase("home");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [closeCaseStudy, openCaseStudy]);

  useEffect(() => () => unlockDocumentScroll(), [unlockDocumentScroll]);

  const handleNavigationClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const element = event.target instanceof Element ? event.target : null;
    const anchor = element?.closest<HTMLAnchorElement>("a[href]");
    if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== window.location.origin) return;

    const homeSection = anchor.dataset.homeSection;
    if (phaseRef.current === "home" && isHomeSectionId(homeSection)) {
      event.preventDefault();
      scrollToHomeSection(homeSection);
      return;
    }

    const destinationCase = getCaseStudyPath(destination.pathname);
    if (anchor.classList.contains("project") && destinationCase && phaseRef.current === "home") {
      event.preventDefault();
      openCaseStudy(destinationCase, anchor, true);
      return;
    }

    const isCaseBackLink = anchor.matches(".flare-navbar-back, .flare-end-nav a");
    if (
      isCaseBackLink &&
      destination.pathname === "/" &&
      phaseRef.current === "case" &&
      hasHomeLayerRef.current
    ) {
      event.preventDefault();

      if (getHistoryState().portfolioPage === "case") {
        window.history.back();
      } else {
        window.history.replaceState(
          { portfolioPage: "home", homeScrollY: homeScrollRef.current },
          "",
          destination.href,
        );
        closeCaseStudy();
      }
    }
  };

  return (
    <div
      className={`portfolio-navigation portfolio-navigation--${phase}`}
      data-transitioning={isTransitioning ? "true" : undefined}
      onClickCapture={handleNavigationClick}
    >
      {hasHomeLayer ? (
        <div className="portfolio-layer portfolio-home-layer" aria-hidden={phase !== "home"} inert={phase !== "home"}>
          <div ref={homeScrollLayerRef} className="portfolio-layer-scroll">
            <HomePage />
          </div>
        </div>
      ) : null}

      {casePath ? (
        <div
          ref={caseLayerRef}
          className="portfolio-layer portfolio-case-layer"
          aria-hidden={phase !== "case"}
          inert={phase !== "case"}
        >
          <div ref={caseScrollLayerRef} className="portfolio-layer-scroll">
            <CaseStudyRoute path={casePath} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
