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
import FaqSection from "./FaqSection";
import FlareCaseStudyPage from "./FlareCaseStudy";
import ShipFlexCaseStudyPage from "./ShipFlexCaseStudy";
import UnflappableCaseStudyPage from "./UnflappableCaseStudy";
import AxisHealthCaseStudyPage from "./AxisHealthCaseStudy";
import { a } from "./assets";
import { externalSocialLinks } from "./externalLinks";
import { isHomeSectionId, scrollToHomeSection, type HomeSectionId } from "./homeSectionNavigation";

function Stars() {
  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="star" key={i}>
          <img src={a.star} alt="" />
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
            <img src={src} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Play({ left, top, hidden = false }: { left: number; top: number; hidden?: boolean }) {
  return (
    <div className={`play${hidden ? " play--hidden" : ""}`} style={{ left, top }}>
      <img src={a.play} alt="" />
    </div>
  );
}

function ProjectsVideoCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasInteractedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isThumbnailReady, setIsThumbnailReady] = useState(false);

  const hasHoverPointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const seekToFinalFrame = (video: HTMLVideoElement) => {
    if (hasInteractedRef.current || !Number.isFinite(video.duration) || video.duration <= 0) return;
    setIsThumbnailReady(false);
    video.pause();
    video.currentTime = Math.max(0, video.duration - 0.05);
  };

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      video.currentTime = 0;
      setHasEnded(false);
      setIsThumbnailReady(true);
    } else if (hasEnded || video.ended) {
      video.currentTime = 0;
      setHasEnded(false);
    }

    const playRequest = video.play();
    if (playRequest) {
      void playRequest.catch(() => setIsPlaying(false));
    }
  };

  const pauseVideo = () => {
    const video = videoRef.current;
    if (!video) return;
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
      aria-label={isPlaying ? "Pause Projects preview video" : "Play Projects preview video"}
      aria-pressed={isPlaying}
      onMouseEnter={() => hasHoverPointer() && playVideo()}
      onMouseLeave={() => hasHoverPointer() && pauseVideo()}
      onClick={() => !hasHoverPointer() && playVideo()}
      onKeyDown={handleKeyDown}
    >
      <video
        ref={videoRef}
        className={`showcase-video${isThumbnailReady ? " showcase-video--ready" : ""}`}
        src="/assets/projects-card-preview.mov"
        muted
        playsInline
        controls={false}
        preload="metadata"
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
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setHasEnded(true);
          setIsPlaying(false);
        }}
      />
      <Play left={1286} top={30} hidden={isPlaying} />
    </div>
  );
}

function PurpleNavigationVideoCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasInteractedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isThumbnailReady, setIsThumbnailReady] = useState(false);

  const hasHoverPointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const seekToFinalFrame = (video: HTMLVideoElement) => {
    if (hasInteractedRef.current || !Number.isFinite(video.duration) || video.duration <= 0) return;
    setIsThumbnailReady(false);
    video.pause();
    video.currentTime = Math.max(0, video.duration - 0.05);
  };

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      video.currentTime = 0;
      setHasEnded(false);
      setIsThumbnailReady(true);
    } else if (hasEnded || video.ended) {
      video.currentTime = 0;
      setHasEnded(false);
    }

    const playRequest = video.play();
    if (playRequest) {
      void playRequest.catch(() => setIsPlaying(false));
    }
  };

  const pauseVideo = () => {
    const video = videoRef.current;
    if (!video) return;
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
      aria-label={isPlaying ? "Purple navigation preview video playing" : "Play purple navigation preview video"}
      aria-pressed={isPlaying}
      onMouseEnter={() => hasHoverPointer() && playVideo()}
      onMouseLeave={() => hasHoverPointer() && pauseVideo()}
      onClick={() => !hasHoverPointer() && playVideo()}
      onKeyDown={handleKeyDown}
    >
      <video
        ref={videoRef}
        className={`showcase-video${isThumbnailReady ? " showcase-video--ready" : ""}`}
        src="/assets/purple-navigation-card-preview.mov"
        muted
        playsInline
        controls={false}
        preload="metadata"
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
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setHasEnded(true);
          setIsPlaying(false);
        }}
      />
      <Play left={609} top={25} hidden={isPlaying} />
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
      rel="noreferrer"
      aria-label={accessibleLabel}
      data-external-label={name}
    >
      <div className="job-inner">
        <div className="job-top">
          <img className={`job-logo${bordered ? " bordered" : ""}`} src={logo} alt="" />
          <img className="job-arrow" src={arrow} alt="" />
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
  { icon: a.navCode, label: "Services", sectionId: "services" },
  { icon: a.navDesign, label: "Tools", sectionId: "toolkit" },
  { icon: a.navFolder, label: "Projects", sectionId: "projects" },
  { icon: a.navChat, label: "Reviews", sectionId: "testimonials" },
] as const;

const mobileNavItems = [
  { icon: a.mobileNavHome, label: "Home", sectionId: "hero" },
  { icon: a.mobileNavUser, label: "About Me", sectionId: "about" },
  { icon: a.mobileNavServices, label: "Services", sectionId: "services" },
  { icon: a.mobileNavTools, label: "Tools", sectionId: "toolkit" },
  { icon: a.mobileNavProjects, label: "Projects", sectionId: "projects" },
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

function ExternalArrow() {
  return (
    <div className="ext-wrap" aria-hidden="true">
      <div className="ext-track">
        <img className="ext-arrow" src={a.external} alt="" />
        <img className="ext-arrow ext-arrow--enter" src={a.external} alt="" />
      </div>
    </div>
  );
}

const EMAIL = "samiperwaiz@gmail.com";

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
      <img className="tool-icon" src={tool.icon} alt={tool.name} />
      <NavTooltip label={tool.name} />
    </div>
  );
}

type ServiceCardData = {
  icon: string;
  iconVariant?: "landing";
  title: string;
  description: string;
  preview: string;
};

const serviceCards: ServiceCardData[] = [
  {
    icon: a.iconBrand,
    title: "Branding Design",
    description: "We develop brands that resonate and build trust with your customers.",
    preview: a.serviceBrandingPreview,
  },
  {
    icon: a.iconApp,
    title: "App Design",
    description: "We develop brands that resonate and build trust with your customers.",
    preview: a.serviceAppPreview,
  },
  {
    icon: a.iconWeb,
    title: "Website Design",
    description: "We create stunning, user-friendly websites that drive growth.",
    preview: a.serviceWebPreview,
  },
  {
    icon: a.iconLanding,
    iconVariant: "landing",
    title: "Landing Page Design",
    description: "We build landing pages that are simple, beautiful, and effective.",
    preview: a.serviceLandingPreview,
  },
  {
    icon: a.iconNocode,
    title: "No-Code Development",
    description: "Quickly develop high-quality solutions using Framer and Webflow.",
    preview: a.serviceNocodePreview,
  },
];

const SERVICE_CARD_HOLD_DURATION = 1800;
const SERVICE_SWIPE_HOLD_DURATION = 4000;
const SERVICE_SWIPE_THRESHOLD = 50;
const SERVICE_DRAG_LIMIT = 140;
const SERVICE_SEQUENCE_COUNT = 3;
const SERVICE_STEP_PERCENT = 100 / (serviceCards.length * SERVICE_SEQUENCE_COUNT);

type CarouselMotion = "idle" | "sliding" | "snapping";
type CarouselTransitionSource = "autoplay" | "swipe" | "snapback" | null;
type TouchAxis = "undetermined" | "horizontal" | "vertical";

type TouchGesture = {
  axis: TouchAxis;
  deltaX: number;
  deltaY: number;
  ignore: boolean;
  startX: number;
  startY: number;
};

function createTouchGesture(): TouchGesture {
  return { axis: "undetermined", deltaX: 0, deltaY: 0, ignore: false, startX: 0, startY: 0 };
}

function ServiceCard({ card }: { card: ServiceCardData }) {
  return (
    <article className="service-card">
      {card.iconVariant === "landing" ? (
        <div className="service-icon landing">
          <img src={card.icon} alt="" />
        </div>
      ) : (
        <img className="service-icon" src={card.icon} alt="" />
      )}
      <div className="service-body">
        <div className="service-copy">
          <h3 className="sf sf-med">{card.title}</h3>
          <p className="sf sf-reg">{card.description}</p>
        </div>
        <div className="service-preview">
          <img src={card.preview} alt="" />
        </div>
      </div>
    </article>
  );
}

function ServicesStepper({
  activeIndex,
  duration,
  isPaused,
}: {
  activeIndex: number;
  duration: number;
  isPaused: boolean;
}) {
  const activeStep = ((activeIndex % serviceCards.length) + serviceCards.length) % serviceCards.length;

  return (
    <div className="service-stepper" aria-hidden="true">
      {serviceCards.map((card, index) => {
        const isActive = index === activeStep;

        return (
          <span
            className={`service-step${isActive ? " is-active" : ""}${isActive && isPaused ? " is-paused" : ""}`}
            key={card.title}
            style={{ "--service-step-duration": `${duration}ms` } as CSSProperties}
          >
            <span className="service-step-progress" />
          </span>
        );
      })}
    </div>
  );
}

function ServicesCarousel() {
  const [activeIndex, setActiveIndex] = useState(serviceCards.length);
  const [motion, setMotion] = useState<CarouselMotion>("idle");
  const [dragOffset, setDragOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [autoplayDelay, setAutoplayDelay] = useState(SERVICE_CARD_HOLD_DURATION);
  const activeIndexRef = useRef(serviceCards.length);
  const motionRef = useRef<CarouselMotion>("idle");
  const motionSourceRef = useRef<CarouselTransitionSource>(null);
  const isHoveredRef = useRef(false);
  const isTouchingRef = useRef(false);
  const dragOffsetRef = useRef(0);
  const holdTimerRef = useRef<number | null>(null);
  const holdStartedAtRef = useRef<number | null>(null);
  const remainingHoldTimeRef = useRef(SERVICE_CARD_HOLD_DURATION);
  const queuedSwipeFrameRef = useRef<number | null>(null);
  const pendingSwipeRef = useRef<-1 | 1 | null>(null);
  const touchGestureRef = useRef<TouchGesture>(createTouchGesture());

  const stopHoldTimer = (preserveRemainingTime: boolean) => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (preserveRemainingTime && holdStartedAtRef.current !== null) {
      const elapsedTime = performance.now() - holdStartedAtRef.current;
      remainingHoldTimeRef.current = Math.max(0, remainingHoldTimeRef.current - elapsedTime);
    }

    holdStartedAtRef.current = null;
  };

  const resetHoldTimer = (duration: number) => {
    stopHoldTimer(false);
    remainingHoldTimeRef.current = duration;
  };

  const setCarouselMotion = (nextMotion: CarouselMotion) => {
    motionRef.current = nextMotion;
    setMotion(nextMotion);
  };

  const setCarouselIndex = (nextIndex: number) => {
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  };

  const setCarouselDragOffset = (nextOffset: number) => {
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  };

  const startSlide = (direction: -1 | 1, source: Exclude<CarouselTransitionSource, "snapback" | null>) => {
    if (motionRef.current !== "idle") return;

    const nextIndex = activeIndexRef.current + direction;
    const firstPreviousCloneIndex = serviceCards.length - 1;
    const firstNextCloneIndex = serviceCards.length * 2;

    if (nextIndex < firstPreviousCloneIndex || nextIndex > firstNextCloneIndex) return;

    resetHoldTimer(source === "swipe" ? SERVICE_SWIPE_HOLD_DURATION : SERVICE_CARD_HOLD_DURATION);
    setCarouselDragOffset(0);
    motionSourceRef.current = source;
    setCarouselMotion("sliding");
    setCarouselIndex(nextIndex);
  };

  const resetTouchInteraction = () => {
    isTouchingRef.current = false;
    setIsTouching(false);
    touchGestureRef.current = createTouchGesture();
  };

  useEffect(() => {
    if (motion !== "idle" || isHovered || isTouching || pendingSwipeRef.current !== null) return;

    stopHoldTimer(false);
    holdStartedAtRef.current = performance.now();
    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null;
      holdStartedAtRef.current = null;
      remainingHoldTimeRef.current = 0;
      if (
        isHoveredRef.current ||
        isTouchingRef.current ||
        motionRef.current !== "idle" ||
        pendingSwipeRef.current !== null
      ) {
        return;
      }

      startSlide(1, "autoplay");
    }, remainingHoldTimeRef.current);

    return () => stopHoldTimer(true);
  }, [activeIndex, autoplayDelay, isHovered, isTouching, motion]);

  useEffect(() => {
    return () => {
      stopHoldTimer(false);
      if (queuedSwipeFrameRef.current !== null) {
        window.cancelAnimationFrame(queuedSwipeFrameRef.current);
      }
    };
  }, []);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform" || motionRef.current === "idle") return;

    const completedMotion = motionRef.current;
    const completedSource = motionSourceRef.current;

    if (completedMotion === "snapping") {
      motionSourceRef.current = null;
      resetHoldTimer(SERVICE_SWIPE_HOLD_DURATION);
      setCarouselMotion("idle");
      setAutoplayDelay(SERVICE_SWIPE_HOLD_DURATION);
      return;
    }

    let settledIndex = activeIndexRef.current;
    if (settledIndex === serviceCards.length * 2) {
      settledIndex = serviceCards.length;
    } else if (settledIndex === serviceCards.length - 1) {
      settledIndex = serviceCards.length * 2 - 1;
    }

    motionSourceRef.current = null;
    setCarouselMotion("idle");
    setCarouselDragOffset(0);
    setCarouselIndex(settledIndex);

    if (pendingSwipeRef.current !== null) {
      const direction = pendingSwipeRef.current;
      queuedSwipeFrameRef.current = window.requestAnimationFrame(() => {
        queuedSwipeFrameRef.current = null;
        pendingSwipeRef.current = null;
        startSlide(direction, "swipe");
      });
      return;
    }

    const nextDelay = completedSource === "swipe" ? SERVICE_SWIPE_HOLD_DURATION : SERVICE_CARD_HOLD_DURATION;
    remainingHoldTimeRef.current = nextDelay;
    setAutoplayDelay(nextDelay);
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) return;

    isHoveredRef.current = true;
    if (motionRef.current === "idle") stopHoldTimer(true);
    setIsHovered(true);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;

    isHoveredRef.current = false;
    setIsHovered(false);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) {
      touchGestureRef.current = { ...createTouchGesture(), ignore: true };
      return;
    }

    const touch = event.touches[0];
    const canDeferFromAutoplay = motionRef.current === "sliding" && motionSourceRef.current === "autoplay";
    const canTrackGesture = motionRef.current === "idle" || canDeferFromAutoplay;

    touchGestureRef.current = {
      ...createTouchGesture(),
      ignore: !canTrackGesture,
      startX: touch.clientX,
      startY: touch.clientY,
    };

    if (!canTrackGesture) return;

    isTouchingRef.current = true;
    setIsTouching(true);
    stopHoldTimer(true);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const gesture = touchGestureRef.current;
    if (gesture.ignore || event.touches.length !== 1) return;

    const touch = event.touches[0];
    gesture.deltaX = touch.clientX - gesture.startX;
    gesture.deltaY = touch.clientY - gesture.startY;

    if (gesture.axis === "undetermined") {
      if (Math.abs(gesture.deltaX) < 8 && Math.abs(gesture.deltaY) < 8) return;
      gesture.axis = Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY) ? "horizontal" : "vertical";
    }

    if (gesture.axis !== "horizontal") return;

    if (motionRef.current !== "idle") return;

    const nextOffset = Math.max(-SERVICE_DRAG_LIMIT, Math.min(SERVICE_DRAG_LIMIT, gesture.deltaX));
    setCarouselDragOffset(nextOffset);
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

    const isHorizontalSwipe =
      gesture.axis === "horizontal" &&
      Math.abs(gesture.deltaX) >= SERVICE_SWIPE_THRESHOLD &&
      Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY);
    const direction: -1 | 1 = gesture.deltaX < 0 ? 1 : -1;

    resetTouchInteraction();

    if (motionRef.current === "sliding" && motionSourceRef.current === "autoplay") {
      if (isHorizontalSwipe) pendingSwipeRef.current = direction;
      return;
    }

    if (motionRef.current !== "idle") return;

    if (isHorizontalSwipe) {
      startSlide(direction, "swipe");
      return;
    }

    if (dragOffsetRef.current !== 0) {
      motionSourceRef.current = "snapback";
      setCarouselMotion("snapping");
      setCarouselDragOffset(0);
    }
  };

  const handleTouchCancel = () => {
    const gesture = touchGestureRef.current;
    if (gesture.ignore) {
      touchGestureRef.current = createTouchGesture();
      return;
    }

    resetTouchInteraction();
    if (motionRef.current !== "idle" || dragOffsetRef.current === 0) return;

    motionSourceRef.current = "snapback";
    setCarouselMotion("snapping");
    setCarouselDragOffset(0);
  };

  const rowClassName =
    motion === "sliding" ? "service-row is-transitioning" : motion === "snapping" ? "service-row is-snapping" : "service-row";
  const isStepperPaused = motion !== "idle" || isHovered || isTouching;

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
        <div
          className={rowClassName}
          style={{ transform: `translate3d(-${activeIndex * SERVICE_STEP_PERCENT}%, 0, 0) translate3d(${dragOffset}px, 0, 0)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          <div className="service-sequence" aria-hidden="true">
            {serviceCards.map((card) => (
              <ServiceCard card={card} key={`previous-${card.title}`} />
            ))}
          </div>
          <div className="service-sequence">
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
      <ServicesStepper activeIndex={activeIndex} duration={autoplayDelay} isPaused={isStepperPaused} />
    </div>
  );
}

function CopyButton() {
  const [copied, setCopied] = useState(false);
  const resetTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeout.current) window.clearTimeout(resetTimeout.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      if (resetTimeout.current) window.clearTimeout(resetTimeout.current);
      resetTimeout.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <button type="button" className="copy-wrap" onClick={handleCopy} aria-label="Copy email">
      <img className={`copy-icon${copied ? "" : " is-visible"}`} src={a.copy} alt="" />
      <img className={`copy-icon copy-icon--check${copied ? " is-visible" : ""}`} src={a.check} alt="" />
    </button>
  );
}

function HomePage() {
  return (
    <>
      <Nav responsiveHome />
      <div className="page">

      <div className="hero-title" id="hero">
        <div className="hero-name-row">
          <p className="hero-im sf sf-reg">I'm</p>
          <img className="hero-photo" src={a.portrait} alt="" />
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
              <img className="inner-screen" src={a.screen1} alt="" />
            </div>
            <div
              className="card-sm"
              style={{ backgroundImage: "linear-gradient(128.1deg, rgb(24, 24, 24) 0%, rgb(9, 9, 9) 100%)" }}
            >
              <img className="inner-screen border-dark" src={a.screen2} alt="" />
            </div>
          </div>
          <div
            className="card-lg"
            style={{ backgroundImage: "linear-gradient(128.11deg, rgb(21, 25, 10) 0%, rgb(13, 14, 6) 100%)" }}
          >
            <img className="inner-lg" src={a.screen3} alt="" />
          </div>
          <div className="row-2">
            <div
              className="card-sm"
              style={{ backgroundImage: "linear-gradient(128.1deg, rgb(255, 243, 248) 0%, rgb(255, 255, 255) 100%)" }}
            >
              <img className="inner-screen border-f5" src={a.screen4} alt="" />
            </div>
            <div
              className="card-sm"
              style={{ backgroundImage: "linear-gradient(128.1deg, rgb(61, 14, 5) 0%, rgb(30, 11, 6) 100%)" }}
            >
              <img className="inner-screen" src={a.screen5} alt="" />
            </div>
          </div>
          <div
            className="card-lg"
            style={{ backgroundImage: "linear-gradient(128.11deg, rgb(249, 249, 249) 0%, rgb(238, 238, 238) 100%)" }}
          >
            <img className="inner-lg6" src={a.screen6} alt="" />
          </div>
          <div className="row-2">
            <div
              className="card-sm"
              style={{
                backgroundImage: "linear-gradient(217.25deg, rgb(247, 247, 247) 12.079%, rgb(240, 240, 240) 87.921%)",
              }}
            >
              <img className="inner-screen" src={a.dashboard3} alt="" />
            </div>
            <div
              className="card-sm"
              style={{ backgroundImage: "linear-gradient(128.1deg, rgb(242, 242, 242) 0%, rgb(249, 249, 249) 100%)" }}
            >
              <img className="inner-screen border-ea" src={a.screen7} alt="" />
            </div>
          </div>
          <ProjectsVideoCard />
          <div className="grid-4">
            <div className="cell" style={{ background: "#fafafa" }}>
              <img src={a.image69} alt="" style={{ position: "absolute", left: 62, top: 125, width: 218, height: 219, objectFit: "cover" }} />
              <div className="cross-h" style={{ top: 106 }}>
                <img src={a.line519} alt="" />
              </div>
              <div className="cross-h" style={{ top: 83 }}>
                <img src={a.line519} alt="" />
              </div>
              <div className="cross-h" style={{ top: 362 }}>
                <img src={a.line519} alt="" />
              </div>
              <div className="cross-h" style={{ top: 385 }}>
                <img src={a.line519} alt="" />
              </div>
              <div className="cross-v">
                <div className="cross-v-inner">
                  <img src={a.line521} alt="" />
                </div>
              </div>
              <img
                src={a.image565}
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
              <img className="inner-screen" src={a.image559} alt="" />
            </div>
            <div
              className="cell"
              style={{
                backgroundImage:
                  "linear-gradient(128.1deg, rgb(249, 249, 249) 0%, rgb(238, 238, 238) 100%), linear-gradient(90deg, rgb(13, 39, 36) 0%, rgb(13, 39, 36) 100%)",
              }}
            >
              <Glow src={a.ellipse79} variant="b" style={{ left: -108.42, top: 427.43, width: 377.335, height: 283.142 }} />
              <img
                className="inner-screen border-f5"
                src={a.image564}
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
            <img className="exp-photo" src={a.experiencePhoto} alt="" />
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
          <h2 className="sf sf-med">AI Visual Gallery</h2>
          <p className="sf sf-reg">
            A collection of creative explorations that reflects my curiosity, experimentation, and passion for
            discovering what's possible with modern AI.
          </p>
        </div>
        <div className="gallery-grid">
          <div className="g-wide">
            <img src={a.gallery1} alt="" />
          </div>
          <div className="g-cell">
            <img src={a.gallery2} alt="" />
          </div>
          <div className="g-cell">
            <img src={a.gallery4} alt="" />
          </div>
          <div className="g-cell">
            <img src={a.gallery3} alt="" />
          </div>
          <div className="g-cell">
            <img src={a.gallery5} alt="" />
          </div>
          <div className="g-wide">
            <img className="g-crop6" src={a.gallery6} alt="" />
          </div>
          <div className="g-cell">
            <img className="g-crop7" src={a.gallery7} alt="" />
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
                <img className="thumb-bg" src={a.flareThumb} alt="" />
              </div>
              <div>
                <p className="project-title sf sf-med">Flare</p>
                <p className="project-sub sf sf-reg">AI Coaching for Better Conversations</p>
              </div>
            </a>
            <a className="project" href="/projects/shipflex" aria-label="Read the ShipFlex case study">
              <div className="thumb">
                <img className="thumb-bg" src={a.shipFlexThumb} alt="" />
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
                <img className="thumb-bg" src={a.unflappableThumb} alt="" />
              </div>
              <div>
                <p className="project-title sf sf-med">Unflappable</p>
                <p className="project-sub sf sf-reg">Stay Calm. Execute Every Day.</p>
              </div>
            </a>
            <a className="project" href="/projects/axishealth" aria-label="Read the AxisHealth case study">
              <div className="thumb">
                <img className="thumb-bg" src={a.axisHealthThumb} alt="" />
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
                After looking at different furniture choices, I found the CozyNest sofa to be exceptional. Its modern
                design and cozy feel really stand out. I love how it fits perfectly in my living room. If you're in the
                market for a new sofa, this one is worth a look! It combines style and comfort seamlessly. Trust me, you
                won't be disappointed!
              </p>
              <div className="t-foot">
                <div className="t-person">
                  <div style={{ position: "relative", width: 36, height: 36 }}>
                    <img className="t-avatar" src={a.portrait} alt="" style={{ position: "absolute", inset: 0 }} />
                    <img className="t-avatar" src={a.logoAjencia} alt="" style={{ position: "absolute", inset: 0 }} />
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
                After looking at different furniture choices, I found the CozyNest sofa to be exceptional. Its modern
                design and cozy feel really stand out. I love how it fits perfectly in my living room. If you're in the
                market for a new sofa, this one is worth a look! It combines style and comfort seamlessly. Trust me, you
                won't be disappointed!
              </p>
              <div className="t-foot">
                <div className="t-person">
                  <img className="t-avatar" src={a.avatar2} alt="" />
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
                After looking at different furniture choices, I found the CozyNest sofa to be exceptional. Its modern
                design and cozy feel really stand out. I love how it fits perfectly in my living room. If you're in the
                market for a new sofa, this one is worth a look! It combines style and comfort seamlessly. Trust me, you
                won't be disappointed!
              </p>
              <div className="t-foot">
                <div className="t-person">
                  <img className="t-avatar" src={a.avatar3} alt="" />
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
                After looking at different furniture choices, I found the CozyNest sofa to be exceptional. Its modern
                design and cozy feel really stand out. I love how it fits perfectly in my living room. If you're in the
                market for a new sofa, this one is worth a look! It combines style and comfort seamlessly. Trust me, you
                won't be disappointed!
              </p>
              <div className="t-foot">
                <div className="t-person">
                  <img className="t-avatar" src={a.avatar4} alt="" />
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

      <section className="social" id="contact">
        <div className="social-inner">
          <p className="social-title sf sf-reg">Your Next Step Starts Here</p>
          <div className="social-grid">
            <div className="social-pair">
              <a
                className="social-item"
                href={externalSocialLinks.linkedin.href}
                target="_blank"
                rel="noreferrer"
                aria-label={externalSocialLinks.linkedin.label}
              >
                <div className="social-item-inner">
                  <img className="logo" src={a.linkedin} alt="" />
                  <span className="sf sf-med">LinkedIn.com</span>
                  <ExternalArrow />
                </div>
              </a>
              <a
                className="social-item"
                href={externalSocialLinks.x.href}
                target="_blank"
                rel="noreferrer"
                aria-label={externalSocialLinks.x.label}
              >
                <div className="social-item-inner">
                  <img className="logo round" src={a.iconX} alt="" />
                  <span className="sf sf-med">X.com</span>
                  <ExternalArrow />
                </div>
              </a>
            </div>
            <div className="social-pair">
              <a
                className="social-item"
                href={externalSocialLinks.dribbble.href}
                target="_blank"
                rel="noreferrer"
                aria-label={externalSocialLinks.dribbble.label}
              >
                <div className="social-item-inner">
                  <img className="logo round" src={a.iconDribbble} alt="" />
                  <span className="sf sf-med">Dribbble.com</span>
                  <ExternalArrow />
                </div>
              </a>
              <a
                className="social-item"
                href={externalSocialLinks.instagram.href}
                target="_blank"
                rel="noreferrer"
                aria-label={externalSocialLinks.instagram.label}
              >
                <div className="social-item-inner">
                  <img className="logo" src={a.instagram} alt="" />
                  <span className="sf sf-med">Instagram.com</span>
                  <ExternalArrow />
                </div>
              </a>
            </div>
            <a
              className="social-item full"
              href={externalSocialLinks.upwork.href}
              target="_blank"
              rel="noreferrer"
              aria-label={externalSocialLinks.upwork.label}
            >
              <div className="social-item-inner">
                <img className="logo round" src={a.iconUpwork} alt="" />
                <span className="sf sf-med">Upwork.com</span>
                <ExternalArrow />
              </div>
            </a>
            <div className="social-item full">
              <div className="social-item-inner">
                <img className="logo round" src={a.iconEmail} alt="" />
                <span className="sf sf-reg">{EMAIL}</span>
                <CopyButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="home-page-tail">
        <HomeCta />
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
          <img className="flare-hero-gradient" src={a.image616} alt="" />
          <div className="flare-hero-screens">
            <img src={a.image567} alt="Flare home screen" />
            <img src={a.image568} alt="Flare live transcription screen" />
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
                <img src={section.image} alt={`${section.title} in the Flare app`} />
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
          <img src={a.image617} alt="" />
          <img src={a.image567} alt="Flare communication coach home screen" />
          <img src={a.image568} alt="Flare communication coach transcription screen" />
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
