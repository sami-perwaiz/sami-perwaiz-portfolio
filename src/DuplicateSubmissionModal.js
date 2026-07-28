import { createElement as h, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { formatCountdown } from "./contactRateLimit.js";
import { getLenis } from "./smoothScroll.js";
import { appleEase, appleReveal, fadeUpBlurReduced } from "./motion.js";

function RateLimitIcon() {
  return h("img", {
    className: "duplicate-submit-modal__icon-img",
    src: "/assets/contact/rate-limit-icon.svg",
    alt: "",
    width: 28,
    height: 28,
    decoding: "async",
    "aria-hidden": true,
  });
}

/**
 * Figma 40003879:20104 — shown when contact form email is rate-limited.
 */
export function DuplicateSubmissionModal({
  open,
  expiresAt,
  onClose,
  windowHours = 2,
}) {
  const titleId = useId();
  const descId = useId();
  const closeBtnRef = useRef(null);
  const [now, setNow] = useState(() => Date.now());
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [open, expiresAt]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    };

    const lenis = getLenis();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop?.();
    document.addEventListener("keydown", onKeyDown);
    closeBtnRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start?.();
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const remainingMs = Math.max(0, (expiresAt || 0) - now);
  const countdown = formatCountdown(remainingMs);
  const hoursLabel = windowHours === 1 ? "1 hour" : `${windowHours} hours`;

  const exitTransition = { duration: 0.2, ease: appleEase };
  const revealSource = reduceMotion ? fadeUpBlurReduced : appleReveal;

  const itemVariants = {
    hidden: revealSource.hidden,
    show: revealSource.show,
    exit: {
      opacity: 0,
      y: 0,
      filter: "blur(0px)",
      transition: exitTransition,
    },
  };

  const itemTransition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 1.1, ease: appleEase };

  const backdropVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0.15 : 0.55,
        ease: appleEase,
      },
    },
    exit: {
      opacity: 0,
      transition: exitTransition,
    },
  };

  const panelVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.14,
        delayChildren: reduceMotion ? 0 : 0.08,
      },
    },
    exit: {
      transition: exitTransition,
    },
  };

  return createPortal(
    h(
      AnimatePresence,
      null,
      open
        ? h(
            motion.div,
            {
              key: "duplicate-submit-modal",
              className: "duplicate-submit-modal",
              role: "presentation",
              "data-lenis-prevent": "",
              onMouseDown: (event) => {
                if (event.target === event.currentTarget) onClose?.();
              },
              variants: backdropVariants,
              initial: "hidden",
              animate: "show",
              exit: "hidden",
            },
            h(
              motion.div,
              {
                className: "duplicate-submit-modal__panel",
                role: "dialog",
                "aria-modal": "true",
                "aria-labelledby": titleId,
                "aria-describedby": descId,
                onMouseDown: (event) => event.stopPropagation(),
                variants: panelVariants,
                initial: "hidden",
                animate: "show",
                exit: "hidden",
              },
              h(
                motion.div,
                {
                  className: "duplicate-submit-modal__header",
                  variants: itemVariants,
                  transition: itemTransition,
                },
                h(
                  "div",
                  {
                    className: "duplicate-submit-modal__icon",
                    "aria-hidden": true,
                  },
                  h(RateLimitIcon)
                ),
                h(
                  "div",
                  { className: "duplicate-submit-modal__copy" },
                  h(
                    "h2",
                    { id: titleId, className: "duplicate-submit-modal__title" },
                    "Duplicate Submission Detected"
                  ),
                  h(
                    "p",
                    { id: descId, className: "duplicate-submit-modal__body" },
                    "This email address recently submitted an enquiry. Please wait ",
                    h(
                      "span",
                      { className: "duplicate-submit-modal__em" },
                      hoursLabel
                    ),
                    " before trying again."
                  )
                )
              ),
              h(
                motion.div,
                {
                  className: "duplicate-submit-modal__actions",
                  variants: itemVariants,
                  transition: itemTransition,
                },
                h(
                  "button",
                  {
                    ref: closeBtnRef,
                    type: "button",
                    className: "duplicate-submit-modal__btn",
                    onClick: () => onClose?.(),
                  },
                  h(
                    "span",
                    { className: "duplicate-submit-modal__btn-slot" },
                    h(
                      "span",
                      { className: "duplicate-submit-modal__label-swap" },
                      h(
                        "span",
                        { className: "duplicate-submit-modal__label-track" },
                        h(
                          "span",
                          { className: "duplicate-submit-modal__label-line" },
                          "I'll Wait"
                        ),
                        h(
                          "span",
                          {
                            className: "duplicate-submit-modal__label-line",
                            "aria-hidden": true,
                          },
                          "I'll Wait"
                        )
                      )
                    )
                  )
                ),
                h(
                  "p",
                  {
                    className: "duplicate-submit-modal__countdown",
                    "aria-live": "polite",
                  },
                  "Try Again in ",
                  h(
                    "span",
                    { className: "duplicate-submit-modal__em" },
                    countdown
                  )
                )
              )
            )
          )
        : null
    ),
    document.body
  );
}
