import { createElement as h } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SUCCESS_ANIM_SEC = 1.2;

const CROSSFADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
};

function SpinnerIcon() {
  return h(
    "svg",
    {
      className: "contact-form__submit-spinner",
      width: 18,
      height: 18,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": true,
      focusable: "false",
    },
    h("circle", {
      className: "contact-form__submit-spinner-track",
      cx: 12,
      cy: 12,
      r: 9,
      stroke: "currentColor",
      strokeWidth: 1.75,
      opacity: 0.22,
    }),
    h("path", {
      className: "contact-form__submit-spinner-arc",
      d: "M21 12a9 9 0 0 0-9-9",
      stroke: "currentColor",
      strokeWidth: 1.75,
      strokeLinecap: "round",
    })
  );
}

function FailIcon() {
  return h(
    "svg",
    {
      className: "contact-form__submit-icon",
      width: 18,
      height: 18,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": true,
      focusable: "false",
    },
    h("path", {
      d: "M7 7L17 17",
      stroke: "currentColor",
      strokeWidth: 1.75,
      strokeLinecap: "round",
    }),
    h("path", {
      d: "M17 7L7 17",
      stroke: "currentColor",
      strokeWidth: 1.75,
      strokeLinecap: "round",
    })
  );
}

function labelFor(state) {
  if (state === "loading") return "Sending...";
  if (state === "success") return "Message Sent";
  if (state === "error") return "Failed to Send";
  return "Send Your Message";
}

function iconFor(state) {
  if (state === "loading") return h(SpinnerIcon);
  if (state === "error") return h(FailIcon);
  return null;
}

/**
 * Multi-state submit control — idle / loading / success / error.
 * Success: “Message Sent” label only (no icon).
 */
export function QuoteSubmitButton({ state = "idle" }) {
  const busy = state !== "idle";
  const label = labelFor(state);

  return h(
    "button",
    {
      type: "submit",
      className: [
        "contact-form__submit",
        state === "loading" ? "is-submitting" : "",
        state === "success" ? "is-success" : "",
        state === "error" ? "is-error" : "",
      ]
        .filter(Boolean)
        .join(" "),
      disabled: busy,
      "aria-busy": state === "loading" || state === "success" ? "true" : "false",
      "aria-live": "polite",
      "aria-label": label,
    },
    h(
      "span",
      { className: "contact-form__submit-slot" },
      h(
        AnimatePresence,
        { mode: "wait", initial: false },
        h(
          motion.span,
          {
            key: state,
            className: "contact-form__submit-content",
            initial: CROSSFADE.initial,
            animate: CROSSFADE.animate,
            exit: CROSSFADE.exit,
            transition: CROSSFADE.transition,
          },
          state === "idle"
            ? h(
                "span",
                { className: "contact-form__submit-label-swap" },
                h(
                  "span",
                  { className: "contact-form__submit-label-track" },
                  h(
                    "span",
                    { className: "contact-form__submit-label-line" },
                    label
                  ),
                  h(
                    "span",
                    {
                      className: "contact-form__submit-label-line",
                      "aria-hidden": true,
                    },
                    label
                  )
                )
              )
            : [
                iconFor(state),
                h("span", { className: "contact-form__submit-label" }, label),
              ]
        )
      )
    )
  );
}

/** Hold duration before form reset after success. */
export const SUBMIT_SUCCESS_ANIM_MS = Math.round(SUCCESS_ANIM_SEC * 1000);
