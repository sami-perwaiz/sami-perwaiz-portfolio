import {
  createElement as h,
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useAnimationFrame } from "framer-motion";

/**
 * Originkit Dynamic Weight — letters morph `wght` by cursor proximity.
 * Per-frame `fontVariationSettings` is mutated on the DOM for perf.
 */

const MAX_REACH = 800;

const VARIABLE_FONT_STACK =
  '"InterVariableFramer", "Inter Variable", "Inter", system-ui, sans-serif';

const DEFAULTS = {
  label: "Variable Font Proximity",
  fontSize: 48,
  color: "#FFFFFF",
  fromWeight: 400,
  toWeight: 900,
  strength: 25,
  transition: {
    type: "tween",
    duration: 0.3,
    ease: "easeOut",
  },
  letterSpacing: "normal",
  className: "",
  /** Scale font so the label fills the container width. */
  fitWidth: false,
};

export function VariableFontCursorProximity(incomingProps) {
  const props = { ...DEFAULTS, ...incomingProps };
  const {
    label,
    fromWeight,
    toWeight,
    strength,
    fontSize,
    color,
    transition,
    letterSpacing,
    className,
    style,
    fitWidth,
  } = props;

  const reach = Math.max(
    1,
    (Math.max(1, Math.min(100, strength)) / 100) * MAX_REACH
  );

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const letterRefs = useRef([]);
  const letterFactorsRef = useRef([]);
  const lastFrameRef = useRef(0);
  const pointerClientRef = useRef({ x: -99999, y: -99999 });
  const [fittedSize, setFittedSize] = useState(null);

  useLayoutEffect(() => {
    if (!fitWidth) {
      setFittedSize(null);
      return undefined;
    }

    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return undefined;

    const fit = () => {
      const target = container.clientWidth;
      if (target <= 0) return;

      const probe = 100;
      inner.style.fontSize = `${probe}px`;
      const measured = inner.scrollWidth;
      if (measured <= 0) return;

      const next = (probe * target) / measured;
      inner.style.fontSize = "";
      setFittedSize(next);
    };

    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(container);
    if (document.fonts?.ready) {
      document.fonts.ready.then(fit);
    }

    return () => ro.disconnect();
  }, [fitWidth, label, fromWeight, letterSpacing]);

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

  const fromSettings = `'wght' ${fromWeight}`;
  const resolvedFontSize =
    fittedSize != null ? `${fittedSize}px` : fontSize;

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

    const tau = Math.max(0.016, transition?.duration ?? 0.3);
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

      if (f < 0.001) {
        if (letterEl.style.fontVariationSettings !== fromSettings) {
          letterEl.style.fontVariationSettings = fromSettings;
        }
        continue;
      }

      const w = Math.round(fromWeight + (toWeight - fromWeight) * f);
      letterEl.style.fontVariationSettings = `'wght' ${w}`;
    }
  });

  const words = label ? label.split(" ") : [];
  letterRefs.current = [];
  let letterIndex = 0;

  return h(
    "div",
    {
      ref: containerRef,
      className: ["variable-font-proximity", className]
        .filter(Boolean)
        .join(" "),
      style: {
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: reduceMotion ? undefined : "default",
        ...style,
      },
      "aria-label": label,
    },
    words.length === 0
      ? null
      : h(
          "span",
          {
            ref: innerRef,
            className: "variable-font-proximity__inner",
            style: {
              fontFamily: VARIABLE_FONT_STACK,
              fontSize: resolvedFontSize,
              color,
              letterSpacing,
              textAlign: "center",
              display: "inline-block",
              width: "max-content",
              maxWidth: "none",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            },
            "aria-hidden": true,
          },
          ...words.map((word, wi) => {
            const wordLetters = word.split("");
            const wordNode = h(
              "span",
              {
                key: `w-${wi}`,
                style: {
                  display: "inline-block",
                  whiteSpace: "nowrap",
                },
              },
              ...wordLetters.map((letter, li) => {
                const idx = letterIndex++;
                return h(
                  "span",
                  {
                    key: `${wi}-${li}`,
                    ref: (el) => {
                      letterRefs.current[idx] = el;
                    },
                    className: "variable-font-proximity__letter",
                    style: {
                      display: "inline-block",
                      fontVariationSettings: fromSettings,
                    },
                  },
                  letter
                );
              })
            );

            if (wi >= words.length - 1) return wordNode;
            return h(
              Fragment,
              { key: `f-${wi}` },
              wordNode,
              h(
                "span",
                {
                  style: { display: "inline-block" },
                },
                "\u00a0"
              )
            );
          })
        )
  );
}
