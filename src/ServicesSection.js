import {
  createElement as h,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EASE = "power4.out";
const DURATION = 0.8;
const BLUR_FROM = "blur(16px)";
const BLUR_TO = "blur(0px)";

let servicesRevealPlayed = false;

export function resetServicesReveal() {
  servicesRevealPlayed = false;
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

/**
 * Blur reveal when the section enters the viewport:
 * title → service cards (staggered).
 * Fires once per session when ~20% of the section crosses the bottom edge.
 */
function useServicesBlurReveal(
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

    const headerTargets = [title].filter(Boolean);
    const cards = grid
      ? Array.from(grid.querySelectorAll(".services-card"))
      : [];
    const revealTargets = [...headerTargets, ...cards];

    if (reduceMotion) {
      clearRevealProps(revealTargets);
      return undefined;
    }

    // Returning from a case study remounts this section — reveal already ran once
    // this session, so show content immediately instead of hiding then skipping play.
    if (servicesRevealPlayed) {
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
      if (servicesRevealPlayed) {
        clearRevealProps(revealTargets);
        played = true;
        return;
      }
      played = true;
      st?.kill();

      tl = gsap.timeline({
        defaults: { ease: EASE, force3D: true },
        onComplete: () => {
          servicesRevealPlayed = true;
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

      if (cards.length) {
        tl.to(
          cards,
          {
            opacity: 1,
            y: 0,
            filter: BLUR_TO,
            duration: DURATION,
            stagger: 0.1,
          },
          headerTargets.length ? "-=0.45" : 0
        );
      }
    };

    st = ScrollTrigger.create({
      id: "services-blur-reveal",
      trigger: section,
      start: "20% bottom",
      once: true,
      onEnter: play,
      refreshPriority: -1,
    });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (cancelled || servicesRevealPlayed) {
        if (servicesRevealPlayed) {
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
      if (!servicesRevealPlayed) clearRevealProps(revealTargets);
    };
  }, [sectionRef, titleRef, gridRef, disabled]);
}

const SERVICES = [
  {
    id: "branding",
    title: "Branding Design",
    description:
      "We develop brands that resonate and build trust with your customers.",
    icon: "/assets/services/branding.svg",
  },
  {
    id: "nocode",
    title: "No-Code Development",
    description:
      "Quickly develop high-quality solutions using Framer and Webflow.",
    icon: "/assets/services/nocode.svg",
  },
  {
    id: "landing",
    title: "Landing Page Design",
    description:
      "We build landing pages that are simple, beautiful, and effective.",
    icon: "/assets/services/landing.svg",
  },
  {
    id: "website",
    title: "Website Design",
    description:
      "We create stunning, user-friendly websites that drive growth.",
    icon: "/assets/services/website.svg",
  },
  {
    id: "app",
    title: "App Design",
    description: "From idea to design, we create seamless app experiences.",
    icon: "/assets/services/app.svg",
  },
];

const svgCache = new Map();

function loadSvg(url) {
  if (svgCache.has(url)) return svgCache.get(url);
  const pending = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      return res.text();
    })
    .catch(() => null);
  svgCache.set(url, pending);
  return pending;
}

function ServiceIcon({ src, wrapRef }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef?.current;
    if (!wrap) return undefined;
    let cancelled = false;

    loadSvg(src).then((html) => {
      if (cancelled || !wrap) return;
      if (!html) {
        setFailed(true);
        return;
      }

      wrap.innerHTML = html;
      const svg = wrap.querySelector("svg");
      if (!svg) {
        setFailed(true);
        return;
      }

      svg.classList.add("services-card__icon");
      svg.setAttribute("width", "44");
      svg.setAttribute("height", "44");
      svg.setAttribute("aria-hidden", "true");
      svg.style.display = "block";
      svg.style.overflow = "visible";
    });

    return () => {
      cancelled = true;
    };
  }, [src, wrapRef]);

  if (failed) {
    return h(
      "span",
      { className: "services-card__icon-wrap" },
      h("img", {
        className: "services-card__icon",
        src,
        alt: "",
        width: 44,
        height: 44,
        decoding: "async",
        "aria-hidden": true,
      })
    );
  }

  return h("span", {
    ref: wrapRef,
    className: "services-card__icon-wrap",
    "aria-hidden": true,
  });
}

function ServiceCard({ service }) {
  const wrapRef = useRef(null);

  return h(
    "article",
    { className: "services-card" },
    h(ServiceIcon, { src: service.icon, wrapRef }),
    h(
      "div",
      { className: "services-card__text" },
      h("h3", { className: "services-card__title" }, service.title),
      h("p", { className: "services-card__desc" }, service.description)
    )
  );
}

export function ServicesSection({ reduceMotion = false }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const top = SERVICES.slice(0, 2);
  const bottom = SERVICES.slice(2);

  useServicesBlurReveal(sectionRef, titleRef, gridRef, {
    disabled: Boolean(reduceMotion),
  });

  return h(
    "section",
    {
      ref: sectionRef,
      className: "services-section",
      id: "services",
      "aria-label": "Services",
      "data-scroll-section": "services",
    },
    h(
      "div",
      { className: "services-section__inner" },
      h(
        "h2",
        {
          ref: titleRef,
          className: "services-section__title",
          "data-scroll-title": "services",
        },
        "Designing, Refining, and Elevating Your Vision"
      ),
      h(
        "div",
        { ref: gridRef, className: "services-section__grid" },
        h(
          "div",
          { className: "services-section__row services-section__row--2" },
          ...top.map((service) =>
            h(ServiceCard, {
              key: service.id,
              service,
            })
          )
        ),
        h(
          "div",
          { className: "services-section__row services-section__row--3" },
          ...bottom.map((service) =>
            h(ServiceCard, {
              key: service.id,
              service,
            })
          )
        )
      )
    )
  );
}
