import { createElement as h, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync, createPortal } from "react-dom";
import gsap from "gsap";
import {
  isHeroEntrancePlaying,
  onHeroEntranceComplete,
} from "./heroEntranceGate.js";

const FINE_POINTER_MQ = "(hover: hover) and (pointer: fine)";
/** Figma arrow fills — fixed; never invert. */
const POINTER_FILL_A = "#363636";
const POINTER_FILL_B = "#232323";
const POINTER_STROKE_A = "#333333";
const POINTER_STROKE_B_OPACITY = 0;

const ARROW_PATH =
  "M0.536389 2.69264C0.0580344 1.35253 1.35253 0.0580341 2.69264 0.53639L21.9006 7.39283C23.3734 7.91852 23.3995 9.99177 21.9407 10.5549L15.6174 12.9964C14.4135 13.4612 13.4612 14.4135 12.9964 15.6174L10.5549 21.9407C9.99177 23.3995 7.91852 23.3734 7.39283 21.9006L0.536389 2.69264Z";

const ENTRANCE_CURSOR_DUR = 0.62;
const IDLE_HIDE_MS = 10000;
const DEFAULT_CURSOR_LABEL = "You";
const FIRST_VISIT_GREETING = "Hi there! 👋";
const GREETING_PREFIX = "Hi there! ";
const GREETING_WAVE = "👋";
const GREETING_HOLD_MS = 2000;
const GREETING_REVEAL_OUT_DUR = 0.14;
const GREETING_REVEAL_IN_DUR = 0.42;
const GREETING_REVEAL_Y = 8;
/** Pause after hero entrance before cursor greeting — avoids load-time jank. */
const GREETING_AFTER_HERO_MS = 650;
/** Wait for pointer to settle before greeting so tracking stays 1:1 on join. */
const GREETING_IDLE_MS = 140;
const TOOL_CURSOR_SELECTOR = "[data-cursor-label], [data-cursor-labels]";
const CURSOR_TYPE_ATTR = "type";
const TYPE_DUR_PER_CHAR = 0.08;
const HOVER_TYPE_DUR_PER_CHAR = 0.036;
const HOVER_TYPE_MIN_DUR = 0.26;
const HOVER_TYPE_OUT_DUR = 0.1;
const HOVER_TYPE_EASE = "power2.out";
const HOVER_TYPE_FADE_IN_DUR = 0.14;
const LABEL_OUT_DUR = 0.15;
const LABEL_IN_DUR = 0.24;
const LABEL_RESET_DELAY_MS = 400;

let cursorRevealActive = false;

/** Per-element index for data-cursor-labels rotation. */
const cursorLabelCycleIndex = new WeakMap();

function parseCursorLabels(el) {
  const raw = el.getAttribute("data-cursor-labels");
  if (!raw) return null;
  const labels = raw.split("|").map((entry) => entry.trim()).filter(Boolean);
  return labels.length ? labels : null;
}

function resolveCursorLabel(el, session) {
  const labels = parseCursorLabels(el);
  if (!labels) {
    session.el = null;
    session.label = null;
    return el.getAttribute("data-cursor-label")?.trim() || "";
  }

  if (el !== session.el) {
    session.el = el;
    const index = cursorLabelCycleIndex.get(el) ?? 0;
    session.label = labels[index % labels.length];
    cursorLabelCycleIndex.set(el, (index + 1) % labels.length);
  }

  return session.label;
}

/** Last pointer position captured before React mounts (fixes reload lag). */
let bootPointerX = NaN;
let bootPointerY = NaN;
/** True while hero exit + below-fold chunk compete on the main thread. */
let pageAnimationsLoading = false;
let pendingGreetingAfterLoad = false;

if (typeof window !== "undefined") {
  window.addEventListener("hero-entrance-complete", () => {
    pageAnimationsLoading = true;
    window.setTimeout(() => {
      if (!pageAnimationsLoading) return;
      pageAnimationsLoading = false;
      if (pendingGreetingAfterLoad) {
        pendingGreetingAfterLoad = false;
        window.dispatchEvent(new CustomEvent("cursor-load-settled"));
      }
    }, 8000);
  });
  window.addEventListener("home-below-fold-ready", () => {
    pageAnimationsLoading = false;
    if (pendingGreetingAfterLoad) {
      pendingGreetingAfterLoad = false;
      window.dispatchEvent(new CustomEvent("cursor-load-settled"));
    }
  });

  window.addEventListener(
    "pointermove",
    (event) => {
      if (
        event &&
        typeof event.clientX === "number" &&
        typeof event.clientY === "number" &&
        Number.isFinite(event.clientX) &&
        Number.isFinite(event.clientY)
      ) {
        bootPointerX = event.clientX;
        bootPointerY = event.clientY;
      }
    },
    { passive: true, capture: true }
  );
}

/** True while the custom cursor entrance/exit animation is playing. */
export function isCursorRevealActive() {
  return cursorRevealActive;
}

function setCursorRevealActive(active) {
  cursorRevealActive = Boolean(active);
}

function isFinePointer() {
  return typeof window !== "undefined" && window.matchMedia(FINE_POINTER_MQ).matches;
}

function isInsideWindow(x, y) {
  return (
    typeof x === "number" &&
    typeof y === "number" &&
    Number.isFinite(x) &&
    Number.isFinite(y) &&
    x >= 0 &&
    y >= 0 &&
    x <= window.innerWidth &&
    y <= window.innerHeight
  );
}

function hasValidCoords(event) {
  return (
    event &&
    typeof event.clientX === "number" &&
    typeof event.clientY === "number" &&
    Number.isFinite(event.clientX) &&
    Number.isFinite(event.clientY)
  );
}

function isFromOutside(event) {
  const related = event.relatedTarget;
  if (related == null) return true;
  if (!(related instanceof Node)) return true;
  return !document.documentElement.contains(related);
}

/**
 * Figma Cursor 40003781:10906 — charcoal gradient arrow + "You" pill.
 * Reveal/hide animates the cursor only; click rings are handled separately in App.
 */
export function CustomCursor({ reduceMotion, deferUntilHeroEntrance = false }) {
  const rootRef = useRef(null);
  const labelInnerRef = useRef(null);
  const defaultLabelRef = useRef(null);
  const greetingLabelRef = useRef(null);
  const waveRef = useRef(null);
  const activeLabelRef = useRef(DEFAULT_CURSOR_LABEL);
  const labelTweenRef = useRef(null);
  const [labelText, setLabelText] = useState(DEFAULT_CURSOR_LABEL);
  const [enabled, setEnabled] = useState(isFinePointer);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(FINE_POINTER_MQ);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("site-cursor-active");
    html.style.setProperty("cursor", "none", "important");
    if (body) body.style.setProperty("cursor", "none", "important");
    return () => {
      html.classList.remove("site-cursor-active");
      html.style.removeProperty("cursor");
      if (body) body.style.removeProperty("cursor");
    };
  }, [enabled]);

  useLayoutEffect(() => {
    if (!enabled) return;

    const root = rootRef.current;
    if (!root) return;

    gsap.set(root, {
      x: -100,
      y: -100,
      scale: 1,
      autoAlpha: 0,
      transformOrigin: "0 0",
      force3D: true,
    });

    let pointerOnPage = false;
    let shown = false;
    let idleHidden = false;
    let lastX = -100;
    let lastY = -100;
    let lastMoveX = NaN;
    let lastMoveY = NaN;
    let entrancePlaying = false;
    let exitPlaying = false;
    let pendingOutsideEnter = false;
    let idleTimer = 0;
    let labelResetTimer = 0;
    let labelTarget = null;
    let visualTween = null;
    let hasEverShown = false;
    let hasPlayedFirstVisitGreeting = false;
    let greetingPlaying = false;
    let typingPlaying = false;
    let pendingLabelSync = null;
    let labelSyncRaf = 0;
    const hoverLabelSession = { el: null, label: null };
    let entranceDeferred =
      deferUntilHeroEntrance && !reduceMotion && isHeroEntrancePlaying();
    let greetingDelayTimer = 0;
    let lastPointerMoveAt = 0;
    let greetingSequenceActive = false;

    const setX = gsap.quickSetter(root, "x", "px");
    const setY = gsap.quickSetter(root, "y", "px");

    const showGreetingMode = () => {
      const defaultEl = defaultLabelRef.current;
      const greetingEl = greetingLabelRef.current;
      if (defaultEl) defaultEl.style.display = "none";
      if (greetingEl) greetingEl.style.display = "inline";
    };

    const showDefaultMode = () => {
      const waveEl = waveRef.current;
      const greetingEl = greetingLabelRef.current;
      const defaultEl = defaultLabelRef.current;
      if (waveEl) waveEl.classList.remove("site-cursor__label-wave--active");
      if (greetingEl) greetingEl.style.display = "none";
      if (defaultEl) defaultEl.style.display = "inline";
    };

    const clearGreetingDelayTimer = () => {
      if (!greetingDelayTimer) return;
      window.clearTimeout(greetingDelayTimer);
      greetingDelayTimer = 0;
    };

    const scheduleFirstVisitGreeting = ({ afterHero = false } = {}) => {
      if (pageAnimationsLoading) {
        pendingGreetingAfterLoad = true;
        return;
      }

      clearGreetingDelayTimer();
      const delay = afterHero ? GREETING_AFTER_HERO_MS : 0;

      const runWhenIdle = () => {
        greetingDelayTimer = 0;
        const idleFor = Date.now() - lastPointerMoveAt;
        if (idleFor < GREETING_IDLE_MS) {
          greetingDelayTimer = window.setTimeout(
            runWhenIdle,
            GREETING_IDLE_MS - idleFor + 16
          );
          return;
        }

        const run = () => {
          requestAnimationFrame(() => {
            playFirstVisitGreeting();
          });
        };

        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(run, { timeout: 900 });
        } else {
          window.setTimeout(run, 32);
        }
      };

      if (delay > 0) {
        greetingDelayTimer = window.setTimeout(runWhenIdle, delay);
      } else {
        runWhenIdle();
      }
    };

    const showInstant = ({ skipGreeting = false, greetingAfterHero = false } = {}) => {
      clearIdleTimer();
      killVisualTween();
      setCursorRevealActive(false);
      entrancePlaying = false;
      exitPlaying = false;
      shown = true;
      idleHidden = false;
      gsap.set(root, {
        x: lastX,
        y: lastY,
        scale: 1,
        autoAlpha: 1,
        transformOrigin: "0 0",
        force3D: true,
      });
      if (!skipGreeting && !entranceDeferred) {
        scheduleFirstVisitGreeting({ afterHero: greetingAfterHero });
      }
      if (!entranceDeferred) {
        scheduleIdleHide();
      }
    };

    const releaseEntranceDefer = () => {
      if (!entranceDeferred) return;
      entranceDeferred = false;

      if (
        !shown &&
        pointerOnPage &&
        isInsideWindow(lastX, lastY)
      ) {
        hasEverShown = true;
        showInstant({ skipGreeting: true });
      }

      scheduleFirstVisitGreeting({ afterHero: true });
      if (shown) {
        scheduleIdleHide();
      }
    };

    const syncLabelTextSoon = (text) => {
      pendingLabelSync = text;
      if (labelSyncRaf) return;
      labelSyncRaf = requestAnimationFrame(() => {
        labelSyncRaf = 0;
        if (pendingLabelSync == null) return;
        setLabelText(pendingLabelSync);
        pendingLabelSync = null;
      });
    };

    const clearLabelSync = () => {
      if (labelSyncRaf) {
        cancelAnimationFrame(labelSyncRaf);
        labelSyncRaf = 0;
      }
      pendingLabelSync = null;
    };

    const clearLabelResetTimer = () => {
      if (!labelResetTimer) return;
      window.clearTimeout(labelResetTimer);
      labelResetTimer = 0;
    };

    const clearIdleTimer = () => {
      if (!idleTimer) return;
      window.clearTimeout(idleTimer);
      idleTimer = 0;
    };

    const killLabelTween = () => {
      if (labelTweenRef.current) {
        labelTweenRef.current.kill();
        labelTweenRef.current = null;
      }
      if (labelInnerRef.current) {
        gsap.killTweensOf(labelInnerRef.current);
      }
      labelTarget = null;
      greetingPlaying = false;
      typingPlaying = false;
    };

    const cancelGreetingSequence = () => {
      if (!greetingSequenceActive) return;
      clearGreetingDelayTimer();
      killLabelTween();
      showDefaultMode();
      greetingSequenceActive = false;
      labelTarget = null;
      activeLabelRef.current = DEFAULT_CURSOR_LABEL;
      if (labelInnerRef.current) {
        gsap.set(labelInnerRef.current, {
          y: 0,
          opacity: 1,
          filter: "none",
          force3D: true,
        });
      }
    };

    const animateLabelTypeTo = (
      full,
      {
        holdMs = 0,
        greetingWave = false,
        onComplete,
        typeDurPerChar = TYPE_DUR_PER_CHAR,
        typeMinDur = 0.45,
        outDur = LABEL_OUT_DUR,
        typeEase = "none",
        fadeInDur = 0,
      } = {}
    ) => {
      if (labelTweenRef.current && labelTarget === full) return;

      const inner = labelInnerRef.current;
      if (!inner) return;

      clearLabelResetTimer();
      clearLabelSync();
      killLabelTween();

      labelTarget = full;
      greetingPlaying = greetingWave;
      typingPlaying = !greetingWave;

      if (reduceMotion) {
        activeLabelRef.current = full;
        flushSync(() => {
          showDefaultMode();
          setLabelText(full);
        });
        labelTarget = null;
        greetingPlaying = false;
        typingPlaying = false;
        if (holdMs > 0) {
          labelResetTimer = window.setTimeout(() => {
            labelResetTimer = 0;
            showDefaultMode();
            onComplete?.();
          }, holdMs);
        } else {
          onComplete?.();
        }
        return;
      }

      const typeProxy = { n: 0 };
      let lastLen = -1;
      const duration = Math.max(typeMinDur, full.length * typeDurPerChar);
      const useRoundedChars = typeEase !== "none";

      labelTweenRef.current = gsap
        .timeline({
          onComplete: () => {
            greetingPlaying = false;
            typingPlaying = false;
            labelTweenRef.current = null;
            if (!holdMs) labelTarget = null;
            onComplete?.();
          },
        })
        .to(inner, {
          y: -4,
          opacity: 0,
          filter: "blur(2px)",
          duration: outDur,
          ease: "power2.inOut",
          force3D: true,
        })
        .call(() => {
          flushSync(() => {
            showDefaultMode();
            setLabelText("");
          });
          activeLabelRef.current = "";
          gsap.set(inner, {
            y: 0,
            opacity: 0,
            filter: "blur(0px)",
            force3D: true,
          });
        });

      if (fadeInDur > 0) {
        labelTweenRef.current.to(
          inner,
          {
            opacity: 1,
            duration: fadeInDur,
            ease: "power2.out",
            force3D: true,
          },
          "<"
        );
      }

      labelTweenRef.current.to(typeProxy, {
          n: full.length,
          duration,
          ease: typeEase,
          onUpdate: () => {
            const next = Math.min(
              full.length,
              useRoundedChars
                ? Math.round(typeProxy.n)
                : Math.floor(typeProxy.n)
            );
            if (next === lastLen) return;
            lastLen = next;
            const text = full.slice(0, next);
            activeLabelRef.current = text;
            if (next === 1) {
              flushSync(() => setLabelText(text));
              if (fadeInDur <= 0) {
                gsap.set(inner, {
                  opacity: 1,
                  force3D: true,
                });
              }
              return;
            }
            syncLabelTextSoon(text);
          },
        })
        .call(() => {
          activeLabelRef.current = full;
          flushSync(() => {
            showDefaultMode();
            setLabelText(full);
          });
        });

      if (holdMs > 0) {
        labelTweenRef.current.to({}, { duration: holdMs / 1000 }).call(() => {
          labelTarget = null;
          showDefaultMode();
        });
      }
    };

    const animateLabelTo = (nextLabel, { soft = false } = {}) => {
      if (labelTweenRef.current && labelTarget === nextLabel) return;

      const inner = labelInnerRef.current;
      if (!inner) return;

      greetingPlaying = false;
      typingPlaying = false;
      labelTarget = nextLabel;
      clearLabelResetTimer();
      clearLabelSync();

      if (reduceMotion) {
        activeLabelRef.current = nextLabel;
        flushSync(() => {
          showDefaultMode();
          setLabelText(nextLabel);
        });
        labelTarget = null;
        gsap.set(inner, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          force3D: true,
        });
        return;
      }

      killLabelTween();
      labelTarget = nextLabel;
      const outY = soft ? -3 : -5;
      const inY = soft ? 4 : 5;
      const outBlur = soft ? "none" : "blur(3px)";
      labelTweenRef.current = gsap
        .timeline({
          onComplete: () => {
            activeLabelRef.current = nextLabel;
            labelTarget = null;
            labelTweenRef.current = null;
          },
        })
        .to(inner, {
          y: outY,
          opacity: 0,
          filter: outBlur,
          duration: soft ? 0.12 : LABEL_OUT_DUR,
          ease: "power2.in",
          force3D: true,
        })
        .call(() => {
          flushSync(() => {
            showDefaultMode();
            setLabelText(nextLabel);
          });
          activeLabelRef.current = nextLabel;
          gsap.set(inner, {
            y: inY,
            opacity: 0,
            filter: outBlur,
            force3D: true,
          });
        })
        .to(inner, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: soft ? 0.2 : LABEL_IN_DUR,
          ease: "power3.out",
          force3D: true,
        });
    };

    const playFirstVisitGreeting = () => {
      if (
        hasPlayedFirstVisitGreeting ||
        greetingPlaying ||
        typingPlaying ||
        greetingSequenceActive
      ) {
        return;
      }

      const inner = labelInnerRef.current;
      if (!inner) return;

      hasPlayedFirstVisitGreeting = true;
      greetingSequenceActive = true;
      clearLabelResetTimer();
      clearLabelSync();
      killLabelTween();
      greetingPlaying = true;
      labelTarget = FIRST_VISIT_GREETING;

      if (reduceMotion) {
        showGreetingMode();
        waveRef.current?.classList.add("site-cursor__label-wave--active");
        activeLabelRef.current = FIRST_VISIT_GREETING;
        greetingPlaying = false;
        labelResetTimer = window.setTimeout(() => {
          labelResetTimer = 0;
          showDefaultMode();
          greetingSequenceActive = false;
          activeLabelRef.current = DEFAULT_CURSOR_LABEL;
          labelTarget = null;
        }, GREETING_HOLD_MS);
        return;
      }

      labelTweenRef.current = gsap
        .timeline({
          onComplete: () => {
            greetingPlaying = false;
            greetingSequenceActive = false;
            labelTweenRef.current = null;
          },
        })
        .to(inner, {
          y: -4,
          opacity: 0,
          duration: GREETING_REVEAL_OUT_DUR,
          ease: "power2.in",
          force3D: true,
        })
        .call(() => {
          showGreetingMode();
          activeLabelRef.current = FIRST_VISIT_GREETING;
          gsap.set(inner, {
            y: GREETING_REVEAL_Y,
            opacity: 0,
            filter: "none",
            force3D: true,
          });
        })
        .to(inner, {
          y: 0,
          opacity: 1,
          duration: GREETING_REVEAL_IN_DUR,
          ease: "power3.out",
          force3D: true,
        })
        .call(() => {
          waveRef.current?.classList.add("site-cursor__label-wave--active");
        })
        .to({}, { duration: GREETING_HOLD_MS / 1000 })
        .call(() => {
          showDefaultMode();
          labelTarget = null;
          activeLabelRef.current = DEFAULT_CURSOR_LABEL;
        });
    };

    const resetLabel = ({ instant = false } = {}) => {
      clearLabelResetTimer();
      clearLabelSync();
      killLabelTween();
      greetingSequenceActive = false;
      greetingPlaying = false;
      typingPlaying = false;
      activeLabelRef.current = DEFAULT_CURSOR_LABEL;
      showDefaultMode();
      flushSync(() => {
        setLabelText(DEFAULT_CURSOR_LABEL);
      });
      if (labelInnerRef.current) {
        gsap.set(labelInnerRef.current, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          clearProps: instant ? "transform,opacity,filter" : undefined,
        });
      }
    };

    const updateLabelForPointer = (x, y) => {
      if (
        entranceDeferred ||
        greetingSequenceActive ||
        greetingPlaying ||
        pageAnimationsLoading
      ) {
        return;
      }

      const hit = document.elementFromPoint(x, y);
      const toolEl =
        hit instanceof Element ? hit.closest(TOOL_CURSOR_SELECTOR) : null;

      if (!toolEl) {
        hoverLabelSession.el = null;
        hoverLabelSession.label = null;
      }

      if (toolEl) {
        const toolLabel = resolveCursorLabel(toolEl, hoverLabelSession);
        if (!toolLabel) return;

        const useTypeEffect =
          toolEl.getAttribute("data-cursor-type") === CURSOR_TYPE_ATTR;

        if (greetingPlaying && !useTypeEffect) {
          animateLabelTo(toolLabel);
          return;
        }

        if (useTypeEffect) {
          if (typingPlaying && labelTarget === toolLabel) return;
          if (
            toolLabel === activeLabelRef.current &&
            !typingPlaying &&
            !labelTarget &&
            !labelResetTimer
          ) {
            return;
          }
          animateLabelTypeTo(toolLabel, {
            typeDurPerChar: HOVER_TYPE_DUR_PER_CHAR,
            typeMinDur: HOVER_TYPE_MIN_DUR,
            outDur: HOVER_TYPE_OUT_DUR,
            typeEase: HOVER_TYPE_EASE,
            fadeInDur: HOVER_TYPE_FADE_IN_DUR,
          });
          return;
        }

        if (
          toolLabel === activeLabelRef.current &&
          labelTarget !== toolLabel &&
          !labelResetTimer
        ) {
          return;
        }
        animateLabelTo(toolLabel);
        return;
      }

      if (greetingPlaying) return;

      if (activeLabelRef.current === DEFAULT_CURSOR_LABEL && !labelTarget) return;
      if (labelResetTimer) return;

      labelResetTimer = window.setTimeout(() => {
        labelResetTimer = 0;
        const latestHit = document.elementFromPoint(lastX, lastY);
        if (
          latestHit instanceof Element &&
          latestHit.closest(TOOL_CURSOR_SELECTOR)
        ) {
          return;
        }
        animateLabelTo(DEFAULT_CURSOR_LABEL);
      }, LABEL_RESET_DELAY_MS);
    };

    const killVisualTween = () => {
      if (visualTween) {
        visualTween.kill();
        visualTween = null;
      }
      gsap.killTweensOf(root, "scale,autoAlpha,opacity");
    };

    const trackPointer = (x, y) => {
      lastX = x;
      lastY = y;
      setX(x);
      setY(y);
    };

    const finishEntrance = () => {
      entrancePlaying = false;
      setCursorRevealActive(false);
      shown = true;
      idleHidden = false;
      visualTween = null;
      gsap.set(root, {
        x: lastX,
        y: lastY,
        scale: 1,
        autoAlpha: 1,
        transformOrigin: "0 0",
        force3D: true,
      });
      scheduleFirstVisitGreeting();
      scheduleIdleHide();
    };

    const finishExit = () => {
      exitPlaying = false;
      setCursorRevealActive(false);
      shown = false;
      idleHidden = true;
      visualTween = null;
      gsap.set(root, {
        scale: 0.72,
        autoAlpha: 0,
        transformOrigin: "0 0",
        force3D: true,
      });
    };

    const playEnterAnimation = () => {
      if (entrancePlaying || entranceDeferred) return;

      clearIdleTimer();
      killVisualTween();
      setCursorRevealActive(true);

      entrancePlaying = true;
      exitPlaying = false;
      shown = false;
      idleHidden = false;

      gsap.set(root, {
        x: lastX,
        y: lastY,
        scale: 0.72,
        autoAlpha: 0,
        transformOrigin: "0 0",
        force3D: true,
      });

      visualTween = gsap.to(root, {
        scale: 1,
        autoAlpha: 1,
        duration: ENTRANCE_CURSOR_DUR,
        ease: "back.out(1.65)",
        overwrite: "auto",
        onComplete: finishEntrance,
      });
    };

    const playExitAnimation = () => {
      if (!shown || entrancePlaying || exitPlaying) return;

      clearIdleTimer();
      killVisualTween();
      setCursorRevealActive(true);

      exitPlaying = true;
      shown = false;

      visualTween = gsap.to(root, {
        scale: 0.72,
        autoAlpha: 0,
        duration: ENTRANCE_CURSOR_DUR,
        ease: "back.in(1.65)",
        overwrite: "auto",
        onComplete: finishExit,
      });
    };

    const hideIdleInstant = () => {
      clearIdleTimer();
      killVisualTween();
      entrancePlaying = false;
      exitPlaying = false;
      setCursorRevealActive(false);
      shown = false;
      idleHidden = true;
      gsap.set(root, {
        scale: 0.72,
        autoAlpha: 0,
        transformOrigin: "0 0",
        force3D: true,
      });
    };

    const hideInstant = () => {
      clearIdleTimer();
      killVisualTween();
      entrancePlaying = false;
      exitPlaying = false;
      setCursorRevealActive(false);
      pendingOutsideEnter = false;
      gsap.set(root, {
        x: -100,
        y: -100,
        scale: 1,
        autoAlpha: 0,
        force3D: true,
      });
    };

    const deactivate = () => {
      pointerOnPage = false;
      shown = false;
      idleHidden = false;
      resetLabel({ instant: true });
      hideInstant();
    };

    const scheduleIdleHide = () => {
      clearIdleTimer();
      if (!shown || entrancePlaying || exitPlaying) return;

      idleTimer = window.setTimeout(() => {
        idleTimer = 0;
        if (!shown || entrancePlaying || exitPlaying) return;
        if (!pointerOnPage || !isInsideWindow(lastX, lastY)) return;
        if (reduceMotion) {
          hideIdleInstant();
          return;
        }
        playExitAnimation();
      }, IDLE_HIDE_MS);
    };

    const cancelExitForMovement = () => {
      if (!exitPlaying) return false;
      killVisualTween();
      exitPlaying = false;
      setCursorRevealActive(false);
      idleHidden = false;
      return true;
    };

    const requestShow = () => {
      if (shown || entrancePlaying) return;
      if (!hasEverShown) {
        hasEverShown = true;
        showInstant({ skipGreeting: entranceDeferred });
        return;
      }
      if (reduceMotion || entranceDeferred) {
        showInstant({ skipGreeting: entranceDeferred });
        return;
      }
      playEnterAnimation();
    };

    const pointerMoved = (x, y) =>
      !Number.isFinite(lastMoveX) ||
      !Number.isFinite(lastMoveY) ||
      x !== lastMoveX ||
      y !== lastMoveY;

    const onPointerMove = (event) => {
      if (!hasValidCoords(event)) return;

      const { clientX: x, clientY: y } = event;
      lastPointerMoveAt = Date.now();

      if (!isInsideWindow(x, y)) {
        if (pointerOnPage || shown) deactivate();
        pendingOutsideEnter = false;
        return;
      }

      const wasOnPage = pointerOnPage;
      pointerOnPage = true;
      trackPointer(x, y);

      const moved = pointerMoved(x, y);
      if (moved) {
        lastMoveX = x;
        lastMoveY = y;
        if (greetingSequenceActive) {
          cancelGreetingSequence();
        }
      }

      updateLabelForPointer(x, y);

      if (exitPlaying && moved) {
        cancelExitForMovement();
        requestShow();
        return;
      }

      if (entrancePlaying) {
        return;
      }

      if (!shown) {
        if (!wasOnPage) {
          pendingOutsideEnter = false;
          requestShow();
          return;
        }

        if (idleHidden && moved) {
          requestShow();
        }
        return;
      }

      if (moved) {
        scheduleIdleHide();
      }
    };

    const onEnter = (event) => {
      if (!hasValidCoords(event)) return;
      if (!isFromOutside(event)) return;

      pendingOutsideEnter = true;

      if (!isInsideWindow(event.clientX, event.clientY)) return;

      pointerOnPage = true;
      trackPointer(event.clientX, event.clientY);
      lastMoveX = event.clientX;
      lastMoveY = event.clientY;
      pendingOutsideEnter = false;
      requestShow();
    };

    const onLeaveWindow = () => {
      pendingOutsideEnter = false;
      deactivate();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        pendingOutsideEnter = false;
        deactivate();
      }
    };

    if (
      Number.isFinite(bootPointerX) &&
      Number.isFinite(bootPointerY) &&
      isInsideWindow(bootPointerX, bootPointerY)
    ) {
      lastX = bootPointerX;
      lastY = bootPointerY;
      lastMoveX = bootPointerX;
      lastMoveY = bootPointerY;
      pointerOnPage = true;
      lastPointerMoveAt = Date.now();
      if (!hasEverShown) {
        hasEverShown = true;
        showInstant({ skipGreeting: entranceDeferred });
      }
    }

    const onLoadSettled = () => {
      if (!shown || entranceDeferred || hasPlayedFirstVisitGreeting) return;
      scheduleFirstVisitGreeting({ afterHero: true });
    };

    window.addEventListener("cursor-load-settled", onLoadSettled);

    const unsubHeroEntrance = onHeroEntranceComplete(releaseEntranceDefer);
    if (deferUntilHeroEntrance && !isHeroEntrancePlaying()) {
      releaseEntranceDefer();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerenter", onEnter, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onLeaveWindow);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      unsubHeroEntrance();
      window.removeEventListener("cursor-load-settled", onLoadSettled);
      clearGreetingDelayTimer();
      clearIdleTimer();
      clearLabelResetTimer();
      clearLabelSync();
      killVisualTween();
      killLabelTween();
      setCursorRevealActive(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerenter", onEnter);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onLeaveWindow);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      gsap.killTweensOf(root);
      gsap.set(root, { autoAlpha: 0 });
    };
  }, [enabled, reduceMotion, deferUntilHeroEntrance]);

  if (!enabled || typeof document === "undefined") return null;

  return createPortal(
    h(
      "div",
      {
        ref: rootRef,
        className: "site-cursor",
        "aria-hidden": true,
      },
      h(
        "svg",
        {
          className: "site-cursor__arrow",
          width: 22,
          height: 22,
          viewBox: "0 0 23.4546 23.4546",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          "aria-hidden": true,
        },
        h("path", {
          className: "site-cursor__arrow-path",
          d: ARROW_PATH,
          fill: "url(#siteCursorArrowFill)",
          stroke: "url(#siteCursorArrowStroke)",
          strokeWidth: 0.868623,
        }),
        h(
          "defs",
          null,
          h(
            "linearGradient",
            {
              id: "siteCursorArrowFill",
              x1: "11.7282",
              y1: "0.870374",
              x2: "11.7282",
              y2: "22.586",
              gradientUnits: "userSpaceOnUse",
            },
            h("stop", { stopColor: POINTER_FILL_A }),
            h("stop", { offset: "1", stopColor: POINTER_FILL_B })
          ),
          h(
            "linearGradient",
            {
              id: "siteCursorArrowStroke",
              x1: "11.7282",
              y1: "0.870374",
              x2: "11.7282",
              y2: "22.586",
              gradientUnits: "userSpaceOnUse",
            },
            h("stop", { stopColor: POINTER_STROKE_A }),
            h("stop", {
              offset: "1",
              stopColor: POINTER_STROKE_A,
              stopOpacity: POINTER_STROKE_B_OPACITY,
            })
          )
        )
      ),
      h(
        "span",
        { className: "site-cursor__label" },
        h(
          "span",
          {
            ref: labelInnerRef,
            className: "site-cursor__label-inner",
          },
          h(
            "span",
            {
              ref: defaultLabelRef,
              className:
                "site-cursor__label-mode site-cursor__label-mode--default",
            },
            labelText
          ),
          h(
            "span",
            {
              ref: greetingLabelRef,
              className:
                "site-cursor__label-mode site-cursor__label-mode--greeting",
              "aria-hidden": true,
            },
            GREETING_PREFIX,
            h(
              "span",
              {
                ref: waveRef,
                className: "site-cursor__label-wave",
                "aria-hidden": true,
              },
              GREETING_WAVE
            )
          )
        )
      )
    ),
    document.body
  );
}
