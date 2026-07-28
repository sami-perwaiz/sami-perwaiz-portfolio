import { createElement as h, useEffect, useRef } from "react";
import { useAnimationFrame } from "framer-motion";

/** Figma 40003806:11317 — exact frame + letter bounds */
const FRAME_W = 1280;
const FRAME_H = 114.53446197509766;
const MAX_REACH = 800;
const STRENGTH = 62;
const TRANSITION_SEC = 0.28;
/** Heavier near cursor (mimics wght feel on locked glyphs). */
const SCALE_FROM = 1;
const SCALE_TO = 1.2;

const WORDMARK_LETTERS = [
  {
    id: "S",
    src: "/assets/footer/wordmark-letters/letter-0.svg",
    x: 0,
    y: 0,
    w: 87.000244140625,
    h: 114.38622283935547,
  },
  {
    id: "A1",
    src: "/assets/footer/wordmark-letters/letter-1.svg",
    x: 104.82868194580078,
    y: 1.6170889139175415,
    w: 117.00597381591797,
    h: 111.57110595703125,
  },
  {
    id: "M",
    src: "/assets/footer/wordmark-letters/letter-2.svg",
    x: 243.01394653320312,
    y: 1.6170889139175415,
    w: 130.17784118652344,
    h: 111.57110595703125,
  },
  {
    id: "I1",
    src: "/assets/footer/wordmark-letters/letter-3.svg",
    x: 401.9187316894531,
    y: 1.6170889139175415,
    w: 30.859718322753906,
    h: 111.57110595703125,
  },
  {
    id: "P",
    src: "/assets/footer/wordmark-letters/letter-4.svg",
    x: 503.0249938964844,
    y: 1.5370217561721802,
    w: 88.03275299072266,
    h: 111.65122985839844,
  },
  {
    id: "E",
    src: "/assets/footer/wordmark-letters/letter-5.svg",
    x: 614.6255493164062,
    y: 1.6170889139175415,
    w: 71.2708740234375,
    h: 111.57110595703125,
  },
  {
    id: "R",
    src: "/assets/footer/wordmark-letters/letter-6.svg",
    x: 712.203857421875,
    y: 1.552912712097168,
    w: 91.26972961425781,
    h: 111.63521575927734,
  },
  {
    id: "W",
    src: "/assets/footer/wordmark-letters/letter-7.svg",
    x: 823.3700561523438,
    y: 1.6170889139175415,
    w: 161.61329650878906,
    h: 111.57110595703125,
  },
  {
    id: "A2",
    src: "/assets/footer/wordmark-letters/letter-8.svg",
    x: 1001.6422119140625,
    y: 1.6170889139175415,
    w: 117.07017517089844,
    h: 111.57110595703125,
  },
  {
    id: "I2",
    src: "/assets/footer/wordmark-letters/letter-9.svg",
    x: 1139.69775390625,
    y: 1.6170889139175415,
    w: 31.013216018676758,
    h: 111.57110595703125,
  },
  {
    id: "Z",
    src: "/assets/footer/wordmark-letters/letter-10.svg",
    x: 1199,
    y: 2,
    w: 81.12030792236328,
    h: 111.66072082519531,
  },
];

/**
 * Pixel-perfect Figma 40003806:11317 wordmark + cursor-proximity weight morph.
 * Uses exported letter SVGs (gradient + 0.1 opacity baked in) and scales
 * each glyph by proximity the same way VariableFontCursorProximity eases wght.
 */
export function FooterFigmaWordmark() {
  const containerRef = useRef(null);
  const letterRefs = useRef([]);
  const letterFactorsRef = useRef([]);
  const lastFrameRef = useRef(0);
  const pointerClientRef = useRef({ x: -99999, y: -99999 });

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reach = Math.max(1, (STRENGTH / 100) * MAX_REACH);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const updatePosition = (clientX, clientY) => {
      pointerClientRef.current = { x: clientX, y: clientY };
    };

    const handleMouseMove = (ev) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev) => {
      if (!ev.touches.length) return;
      updatePosition(ev.touches[0].clientX, ev.touches[0].clientY);
    };
    const handleLeave = () => {
      pointerClientRef.current = { x: -99999, y: -99999 };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [reduceMotion]);

  useAnimationFrame((now) => {
    if (reduceMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const mx = pointerClientRef.current.x - containerRect.left;
    const my = pointerClientRef.current.y - containerRect.top;

    const prevT = lastFrameRef.current || now;
    const dtSec = Math.min(0.1, Math.max(0, (now - prevT) / 1000));
    lastFrameRef.current = now;

    const tau = Math.max(0.016, TRANSITION_SEC);
    const a = 1 - Math.exp(-dtSec / tau);

    for (let i = 0; i < letterRefs.current.length; i++) {
      const letterEl = letterRefs.current[i];
      if (!letterEl) continue;

      const rect = letterEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - containerRect.left;
      const cy = rect.top + rect.height / 2 - containerRect.top;
      const dist = Math.hypot(mx - cx, my - cy);

      const target = Math.min(Math.max(1 - dist / reach, 0), 1);
      const prev = letterFactorsRef.current[i] ?? 0;
      const f = prev + (target - prev) * a;
      letterFactorsRef.current[i] = f;

      const scaleX = SCALE_FROM + (SCALE_TO - SCALE_FROM) * f;
      const scaleY = 1 + (scaleX - 1) * 0.35;
      letterEl.style.transform = `scale(${scaleX}, ${scaleY})`;
    }
  });

  return h(
    "div",
    {
      ref: containerRef,
      className: "site-footer__wordmark-wrap site-footer__figma-wordmark",
      role: "img",
      "aria-label": "Sami Perwaiz",
    },
    ...WORDMARK_LETTERS.map((letter, i) =>
      h("img", {
        key: letter.id,
        ref: (el) => {
          letterRefs.current[i] = el;
        },
        className: "site-footer__figma-letter",
        src: letter.src,
        alt: "",
        draggable: false,
        decoding: "async",
        "aria-hidden": true,
        style: {
          left: `${(letter.x / FRAME_W) * 100}%`,
          top: `${(letter.y / FRAME_H) * 100}%`,
          width: `${(letter.w / FRAME_W) * 100}%`,
          height: `${(letter.h / FRAME_H) * 100}%`,
        },
      })
    )
  );
}
