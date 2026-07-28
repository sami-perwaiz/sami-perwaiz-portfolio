import {
  createElement as h,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { TextMorph } from "./TextMorph.js";
import { useAboutToolsCinematic } from "./useAboutToolsCinematic.js";
import { isDesktopHoverEnabled } from "./hoverEffects.js";

gsap.registerPlugin(ScrollTrigger);

const ASSET_V = "2026-07-28a";

/** Figma 40004213:22976 — About me detail section (1440×1024 artboard). */
const ABOUT_BIO =
  "I'm a Product Designer with 3+ years of experience designing digital products that solve real business problems. I combine user research, usability testing, and thoughtful interface design to create experiences that are intuitive, scalable, and built with purpose. Whether it's an AI platform, SaaS product, or enterprise application, I focus on turning complexity into clarity always thinking like a product owner and designing with both users and business goals in mind.";

const ABOUT_MORPH_WORDS = "Mind Behind\nThe Work";
const NAV_HIDE_ST_ID = "nav-hide-about";
const ABOUT_CHAPTER_ST_ID = "about-tools-chapter";
/** Keep in sync with useAboutToolsCinematic — nav show aligns with chapter end. */
const CHAPTER_SCROLL_VH = 6.5;
const ABOUT_STATS_COUNT_EVENT = "about-stats-count";
const ABOUT_STATS_RESET_EVENT = "about-stats-reset";

const REVEAL_EASE = "power2.out";

const ABOUT_STATS = [
  {
    label: "Experience",
    value: "3+ Yr",
    count: 3,
    suffix: "+ Yr",
    countDuration: 1.1,
  },
  {
    label: "Projects",
    value: "15+",
    count: 15,
    suffix: "+",
    countDuration: 1.35,
  },
  {
    label: "Clients Collaborated With",
    value: "04",
    count: 4,
    suffix: "",
    pad: 2,
    countDuration: 1.2,
  },
];

function formatStatValue(n, suffix, pad = 0) {
  const num = Math.round(n);
  const core = pad ? String(num).padStart(pad, "0") : String(num);
  return `${core}${suffix}`;
}

function AboutStatValue({
  count,
  suffix,
  value,
  countDuration,
  pad = 0,
  reduceMotion = false,
  index = 0,
}) {
  const ref = useRef(null);
  const [text, setText] = useState(() =>
    reduceMotion ? value : formatStatValue(0, suffix, pad)
  );
  const playedRef = useRef(false);

  useLayoutEffect(() => {
    if (reduceMotion) {
      setText(value);
      return undefined;
    }

    const el = ref.current;
    const root = el?.closest(".about-section__body");
    if (!el || !root) return undefined;

    let cancelled = false;
    let tween = null;
    let delayCall = null;

    const play = () => {
      if (cancelled || playedRef.current) return;
      playedRef.current = true;

      const proxy = { n: 0 };
      delayCall = gsap.delayedCall(index * 0.1, () => {
        if (cancelled) return;
        tween = gsap.to(proxy, {
          n: count,
          duration: countDuration,
          ease: REVEAL_EASE,
          onUpdate: () => {
            setText(formatStatValue(proxy.n, suffix, pad));
          },
          onComplete: () => {
            setText(value);
          },
        });
      });
    };

    root.addEventListener(ABOUT_STATS_COUNT_EVENT, play);
    const reset = () => {
      playedRef.current = false;
      delayCall?.kill();
      tween?.kill();
      setText(formatStatValue(0, suffix, pad));
    };
    root.addEventListener(ABOUT_STATS_RESET_EVENT, reset);

    return () => {
      cancelled = true;
      root.removeEventListener(ABOUT_STATS_COUNT_EVENT, play);
      root.removeEventListener(ABOUT_STATS_RESET_EVENT, reset);
      delayCall?.kill();
      tween?.kill();
    };
  }, [count, suffix, value, countDuration, pad, reduceMotion, index]);

  return h("p", { ref, className: "about-section__stat-value" }, text);
}

function AboutStatCard({
  label,
  value,
  count,
  suffix,
  countDuration,
  pad,
  reduceMotion,
  index,
}) {
  return h(
    "article",
    { className: "about-section__stat" },
    h("p", { className: "about-section__stat-label" }, label),
    h(AboutStatValue, {
      count,
      suffix,
      value,
      countDuration,
      pad,
      reduceMotion,
      index,
    })
  );
}

const ABOUT_ROLES = [
  {
    company: "NUEXUS Technologies",
    title: "UI/UX Designer",
    employment: "Full Time",
    period: "Jul 2025 – Present",
    logo: `/assets/about/logo-nuexus.png?v=${ASSET_V}`,
    logoAlt: "NUEXUS Technologies logo",
    linkedin: "https://www.linkedin.com/company/nuexus/",
  },
  {
    company: "Ajencia",
    title: "Product Designer",
    employment: "Contract",
    period: "Jul 2025 - Dec 2025",
    logo: `/assets/about/logo-ajencia.png?v=${ASSET_V}`,
    logoAlt: "Ajencia logo",
    linkedin: "https://www.linkedin.com/company/ajencia/",
  },
  {
    company: "Alpha Hive AI",
    title: "UI/UX Team Lead",
    employment: "Full Time",
    period: "Jul 2025 - Jun 2026",
    logo: `/assets/about/logo-alpha-hive.png?v=${ASSET_V}`,
    logoAlt: "Alpha Hive AI logo",
    logoBordered: true,
    linkedin: "https://www.linkedin.com/company/alpha-hive-ai/",
  },
  {
    company: "Upwork",
    title: "UI/UX Designer",
    employment: "Part Time",
    periodPrefix: "Jul 2024 - ",
    periodPresent: "Present",
    logo: `/assets/about/logo-upwork.png?v=${ASSET_V}`,
    logoAlt: "Upwork logo",
  },
];

function AboutRoleCard({
  company,
  title,
  employment,
  period,
  periodPrefix,
  periodPresent,
  logo,
  logoAlt,
  logoBordered = false,
  linkedin,
}) {
  const hitRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useLayoutEffect(() => {
    if (!linkedin) return undefined;

    const hit = hitRef.current;
    if (!hit) return undefined;

    const onEnter = () => {
      if (!isDesktopHoverEnabled()) return;
      setHovered(true);
    };
    const onLeave = () => setHovered(false);

    hit.addEventListener("pointerenter", onEnter);
    hit.addEventListener("pointerleave", onLeave);
    return () => {
      hit.removeEventListener("pointerenter", onEnter);
      hit.removeEventListener("pointerleave", onLeave);
    };
  }, [linkedin]);

  const periodNode = periodPresent
    ? h(
        "span",
        { className: "about-section__role-period" },
        periodPrefix,
        h(
          "span",
          { className: "about-section__role-period--present" },
          periodPresent
        )
      )
    : h("span", { className: "about-section__role-period" }, period);

  const cardContent = h(
    "article",
    { className: "about-section__role" },
    h(
      "span",
      { className: "about-section__role-inner" },
      h("img", {
        className: [
          "about-section__role-logo",
          logoBordered ? "about-section__role-logo--bordered" : "",
        ]
          .filter(Boolean)
          .join(" "),
        src: logo,
        alt: logoAlt,
        width: 46,
        height: 46,
        decoding: "async",
      }),
      h(
        "span",
        { className: "about-section__role-details" },
        h(
          "span",
          { className: "about-section__role-heading" },
          h("p", { className: "about-section__role-company" }, company),
          h("p", { className: "about-section__role-title" }, title)
        ),
        h(
          "span",
          { className: "about-section__role-meta" },
          h("span", { className: "about-section__role-type" }, employment),
          h("img", {
            className: "about-section__role-dot",
            src: `/assets/about/role-dot.svg?v=${ASSET_V}`,
            alt: "",
            width: 5,
            height: 5,
            decoding: "async",
            "aria-hidden": true,
          }),
          periodNode
        )
      )
    )
  );

  if (!linkedin) {
    return cardContent;
  }

  return h(
    "div",
    {
      ref: hitRef,
      className: [
        "about-section__role-hit",
        hovered ? "about-section__role-hit--hovered" : "",
      ]
        .filter(Boolean)
        .join(" "),
    },
    h(
      "span",
      {
        className: "about-section__role-tooltip",
      },
      h("img", {
        className: "about-section__role-tooltip-bg",
        src: `/assets/about/role-tooltip-union.svg?v=${ASSET_V}`,
        alt: "",
        width: 106,
        height: 36,
        decoding: "async",
        draggable: false,
      }),
      h(
        "a",
        {
          className: "about-section__role-tooltip-link",
          href: linkedin,
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": `View ${company} on LinkedIn`,
        },
        h("span", { className: "about-section__role-tooltip-label" }, "Linkedin"),
        h("img", {
          className: "about-section__role-tooltip-icon",
          src: `/assets/about/role-tooltip-linkedin.svg?v=${ASSET_V}`,
          alt: "",
          width: 16,
          height: 16,
          decoding: "async",
          draggable: false,
        })
      )
    ),
    cardContent
  );
}

function AboutDetailsContent({ reduceMotion = false }) {
  return h(
    "div",
    { className: "about-section__details" },
    h("hr", { className: "about-section__details-rule", "aria-hidden": true }),
    h(
      "div",
      { className: "about-section__details-panel" },
      h(
        "div",
        { className: "about-section__intro-block" },
        h("img", {
          className: "about-section__avatar",
          src: `/assets/about/avatar.png?v=${ASSET_V}`,
          alt: "Portrait of Sami Perwaiz",
          width: 132,
          height: 132,
          decoding: "async",
        }),
        h("p", { className: "about-section__bio" }, ABOUT_BIO),
      )
    ),
    h("hr", { className: "about-section__details-rule", "aria-hidden": true }),
    h(
      "div",
      { className: "about-section__details-panel" },
      h(
        "div",
        { className: "about-section__stats" },
        ABOUT_STATS.map((stat, index) =>
          h(AboutStatCard, {
            key: `${stat.label}-${stat.value}`,
            reduceMotion,
            index,
            ...stat,
          })
        )
      )
    ),
    h("hr", { className: "about-section__details-rule", "aria-hidden": true }),
    h(
      "div",
      { className: "about-section__details-panel" },
      h(
        "div",
        { className: "about-section__roles" },
        ABOUT_ROLES.map((role) =>
          h(AboutRoleCard, {
            key: role.company,
            ...role,
          })
        )
      )
    ),
    h("hr", { className: "about-section__details-rule", "aria-hidden": true })
  );
}

function getHomeNav() {
  return document.querySelector("header.nav:not(.nav--case-study)");
}

const NAV_ANIM_DUR = 0.35;
const NAV_ANIM_EASE = "power2.inOut";

function getChapterEndProgress() {
  const chapter = ScrollTrigger.getById(ABOUT_CHAPTER_ST_ID);
  const tl = chapter?.animation;
  if (!tl || tl.labels.chapterEnd === undefined) return null;

  const total = tl.totalDuration();
  if (!total) return null;

  return Math.min(1, tl.labels.chapterEnd / total);
}

function getNavHideScrollDistance(about) {
  const chapter = ScrollTrigger.getById(ABOUT_CHAPTER_ST_ID);
  const chapterDistance =
    chapter &&
    typeof chapter.start === "number" &&
    typeof chapter.end === "number"
      ? chapter.end - chapter.start
      : Math.round(window.innerHeight * CHAPTER_SCROLL_VH);
  const progress = getChapterEndProgress();

  if (progress == null) return chapterDistance;
  return Math.max(1, Math.round(chapterDistance * progress));
}

function useAboutNavVisibility(
  sectionRef,
  trackRef,
  { disabled = false } = {}
) {
  useLayoutEffect(() => {
    const about = sectionRef?.current;
    const track = trackRef?.current;
    const nav = getHomeNav();
    if (!about || !track || !nav) return undefined;

    const reduceMotion =
      disabled ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return undefined;

    const getHideY = () => -(nav.offsetHeight || 68);
    let navIsHidden = false;

    const hideNav = ({ instant = false } = {}) => {
      if (
        !instant &&
        navIsHidden &&
        !gsap.isTweening(nav) &&
        gsap.getProperty(nav, "opacity") <= 0.01
      ) {
        return;
      }

      navIsHidden = true;
      gsap.killTweensOf(nav);
      nav.style.pointerEvents = "none";

      if (instant) {
        gsap.set(nav, {
          y: getHideY(),
          autoAlpha: 0,
          overwrite: true,
          force3D: true,
        });
        return;
      }

      gsap.to(nav, {
        y: getHideY(),
        autoAlpha: 0,
        duration: NAV_ANIM_DUR,
        ease: NAV_ANIM_EASE,
        overwrite: true,
        force3D: true,
      });
    };

    const showNav = ({ instant = false } = {}) => {
      if (
        !instant &&
        !navIsHidden &&
        !gsap.isTweening(nav) &&
        gsap.getProperty(nav, "opacity") >= 0.99
      ) {
        return;
      }

      navIsHidden = false;
      gsap.killTweensOf(nav);
      nav.classList.remove(
        "is-hidden",
        "nav--hidden",
        "nav-hidden",
        "hidden",
        "is-nav-hidden"
      );

      if (instant) {
        gsap.set(nav, {
          y: 0,
          autoAlpha: 1,
          overwrite: true,
          force3D: true,
        });
        nav.style.pointerEvents = "auto";
        return;
      }

      nav.style.pointerEvents = "none";
      gsap.to(nav, {
        y: 0,
        autoAlpha: 1,
        duration: NAV_ANIM_DUR,
        ease: NAV_ANIM_EASE,
        overwrite: true,
        force3D: true,
        onComplete: () => {
          nav.style.pointerEvents = "auto";
        },
      });
    };

    const st = ScrollTrigger.create({
      id: NAV_HIDE_ST_ID,
      trigger: track,
      start: "top top",
      end: () => `+=${getNavHideScrollDistance(about)}`,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        if (self.isActive) hideNav();
        else showNav();
      },
    });

    const sync = ({ instant = true } = {}) => {
      navIsHidden = st.isActive;
      if (st.isActive) hideNav({ instant });
      else showNav({ instant });
    };

    let chapterWaitFrames = 0;
    const waitForChapterAndRefresh = () => {
      if (ScrollTrigger.getById(ABOUT_CHAPTER_ST_ID) || chapterWaitFrames > 120) {
        ScrollTrigger.refresh();
        sync();
        return;
      }
      chapterWaitFrames += 1;
      requestAnimationFrame(waitForChapterAndRefresh);
    };

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      sync();
      waitForChapterAndRefresh();
    });

    return () => {
      st.kill();
      showNav({ instant: true });
    };
  }, [sectionRef, trackRef, disabled]);
}

/**
 * About scroll chapter — pinned morph and detail cards, handoff to Projects.
 */
export function AboutSection({ reduceMotion = false }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const aboutTitleRef = useRef(null);
  const cardsRef = useRef(null);
  const reduced = Boolean(reduceMotion);

  useAboutToolsCinematic(
    {
      sectionRef,
      trackRef,
      aboutTitleRef,
      cardsRef,
    },
    { disabled: reduced }
  );
  useAboutNavVisibility(sectionRef, trackRef, { disabled: reduced });

  return h(
    "section",
    {
      ref: sectionRef,
      className: [
        "about-section",
        "about-tools-chapter",
        reduced ? "about-section--reduced" : "",
      ]
        .filter(Boolean)
        .join(" "),
      id: "about",
      "aria-label": "About",
      "data-scroll-section": "about",
    },
    h(
      "div",
      { ref: trackRef, className: "about-section__body-track" },
      h(
        "div",
        { className: "about-section__body-pin" },
        h(
          "div",
          { className: "about-section__side-guides", "aria-hidden": true },
          h("span", {
            className:
              "about-section__side-guide about-section__side-guide--left",
          }),
          h("span", {
            className:
              "about-section__side-guide about-section__side-guide--right",
          })
        ),
        h(TextMorph, {
          morphRef: aboutTitleRef,
          className: "about-section__title-morph",
          words: ABOUT_MORPH_WORDS,
          color: "#000000",
          "aria-label": "The Mind Behind the Work",
        }),
        h(
          "div",
          { ref: cardsRef, className: "about-section__body" },
          h(AboutDetailsContent, { reduceMotion: reduced })
        )
      )
    )
  );
}
