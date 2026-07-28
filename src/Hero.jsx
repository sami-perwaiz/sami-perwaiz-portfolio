import {
  createElement as h,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHeroEntrance } from "./hooks/useHeroEntrance.js";
import { useHeroAnimation } from "./hooks/useHeroAnimation.js";

const STATEMENT =
  "I design people-focused interfaces that solve problems and create seamless user experiences.";

const HERO_SOCIAL_LINKS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    ariaLabel: "Visit Sami Perwaiz on LinkedIn",
    href: "https://www.linkedin.com/in/sami-perwaiz/",
    icon: "/assets/hero/social/linkedin.svg",
  },
  {
    id: "x",
    label: "X",
    ariaLabel: "Visit Sami Perwaiz on X",
    href: "https://x.com/uxui_sami",
    icon: "/assets/hero/social/x.svg",
  },
  {
    id: "dribbble",
    label: "Dribbble",
    ariaLabel: "Visit Sami Perwaiz on Dribbble",
    href: "https://dribbble.com/samiperwaiz",
    icon: "/assets/hero/social/dribbble.svg",
  },
  {
    id: "instagram",
    label: "Instagram",
    ariaLabel: "Visit Sami Perwaiz on Instagram",
    href: "https://www.instagram.com/uiux.sami?igsh=Znh3Z2J6Mm1ya2ho&utm_source=qr",
    icon: "/assets/hero/social/instagram.svg",
  },
];

const HERO_SOCIAL_ORBIT = {
  x: { x: 0 / 58, y: -123 / 58, delay: 0 },
  instagram: { x: -50 / 58, y: -87 / 58, delay: 0.05 },
  dribbble: { x: 50 / 58, y: -87 / 58, delay: 0.1 },
  linkedin: { x: 0 / 58, y: -67 / 58, delay: 0.15 },
};

function HeroAvatar({ wrapRef }) {
  const [open, setOpen] = useState(false);
  const [tipId, setTipId] = useState(null);
  const closeTimerRef = useRef(0);
  const finePointerRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      finePointerRef.current = mq.matches;
      if (!mq.matches) {
        setOpen(false);
        setTipId(null);
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const clearCloseTimer = () => {
    if (!closeTimerRef.current) return;
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = 0;
  };

  const onGroupEnter = () => {
    if (!finePointerRef.current) return;
    clearCloseTimer();
    setOpen(true);
  };

  const onGroupLeave = () => {
    if (!finePointerRef.current) return;
    clearCloseTimer();
    setTipId(null);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = 0;
      setOpen(false);
    }, 150);
  };

  return h(
    "div",
    {
      ref: wrapRef,
      className: ["avatar-wrap", open ? "is-open" : ""].filter(Boolean).join(" "),
      onPointerEnter: onGroupEnter,
      onPointerLeave: onGroupLeave,
    },
    h("span", { className: "avatar-wrap__hit", "aria-hidden": true }),
    h("img", {
      className: "avatar hero__avatar",
      src: "/assets/profile.png?v=2026-07-18",
      alt: "Portrait of Sami Perwaiz",
      width: 58,
      height: 58,
      decoding: "async",
      fetchPriority: "high",
    }),
    h(
      "div",
      {
        className: "avatar-socials",
        "aria-label": "Social profiles",
        "aria-hidden": open ? "false" : "true",
      },
      ...HERO_SOCIAL_LINKS.map((item) => {
        const orbit = HERO_SOCIAL_ORBIT[item.id];
        return h(
          "a",
          {
            key: item.id,
            className: [
              "avatar-social",
              `avatar-social--${item.id}`,
              tipId === item.id ? "is-tip" : "",
            ]
              .filter(Boolean)
              .join(" "),
            href: item.href,
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": item.ariaLabel,
            tabIndex: open ? 0 : -1,
            style: {
              "--orbit-x": orbit.x,
              "--orbit-y": orbit.y,
              "--reveal-delay": `${orbit.delay}s`,
            },
            onPointerEnter: () => setTipId(item.id),
            onPointerLeave: () => setTipId(null),
          },
          h(
            "span",
            { className: "avatar-social__float" },
            h("img", {
              className: "avatar-social__icon",
              src: item.icon,
              alt: "",
              width: 22,
              height: 22,
              draggable: false,
            }),
            h(
              "span",
              {
                className: "avatar-social__tip",
                role: "tooltip",
                "aria-hidden": tipId === item.id ? "false" : "true",
              },
              item.label
            )
          )
        );
      })
    )
  );
}

export function Hero({ reduceMotion, skipEntrance, onEntranceComplete }) {
  const heroRef = useRef(null);
  const heroCenterRef = useRef(null);
  const imRef = useRef(null);
  const headingRef = useRef(null);
  const avatarRef = useRef(null);
  const samiRef = useRef(null);
  const subtitleRef = useRef(null);
  const statementRef = useRef(null);
  const skip = Boolean(reduceMotion || skipEntrance);

  const onComplete = useCallback(() => {
    // Hero pin is already live — mount below-hero content on the next frame.
    requestAnimationFrame(() => {
      if (typeof onEntranceComplete === "function") onEntranceComplete();
    });
  }, [onEntranceComplete]);

  useHeroEntrance(
    {
      heroRef,
      imRef,
      avatarRef,
      samiRef,
      subtitleRef,
      statementRef,
    },
    {
      skip,
      reduceMotion: Boolean(reduceMotion),
      onComplete,
    }
  );

  useHeroAnimation({
    heroRef,
    heroCenterRef,
    statementRef,
    reduceMotion: Boolean(reduceMotion),
    enabled: skip,
  });

  return h(
    "section",
    {
      ref: heroRef,
      className: "hero",
      "aria-label": "Hero",
      id: "hero",
    },
    h(
      "div",
      { className: "hero-body" },
      h(
        "div",
        { ref: heroCenterRef, className: "hero-center" },
        h(
          "div",
          { ref: headingRef, className: "intro-row hero__heading" },
          h("span", { ref: imRef, className: "intro-text" }, "I'm"),
          h(HeroAvatar, { wrapRef: avatarRef }),
          h("span", { ref: samiRef, className: "intro-text" }, "Sami")
        ),
        h(
          "p",
          { ref: subtitleRef, className: "tagline hero__subtitle" },
          h("span", { className: "tagline__line" }, "Designing Digital Products"),
          h(
            "span",
            { className: "tagline__line" },
            "That ",
            h("span", { className: "emphasis" }, "Balance User"),
            " Needs"
          ),
          h(
            "span",
            { className: "tagline__line" },
            "and Business ",
            h("span", { className: "emphasis" }, "Goals")
          )
        )
      ),
      h(
        "p",
        {
          ref: statementRef,
          className: "statement hero__statement",
          "aria-label": STATEMENT,
        },
        STATEMENT
      )
    )
  );
}
