import { createElement as h } from "react";

const SWEEP_SEC = 1.5;

/**
 * Originkit Shiny Pill — looping left-to-right sheen via masked text copy.
 * `interval` = idle seconds after each sweep before the next run.
 */
export function ShinyPill({
  text = "SHINY PILL",
  textColor = "currentColor",
  shineColor = "#FFFFFF",
  interval = 6,
  /** @deprecated use `interval` — kept so older callers still work */
  speed,
  className = "",
}) {
  const pauseSec = speed ?? interval;
  const cycleSec = SWEEP_SEC + pauseSec;

  return h(
    "span",
    {
      className: ["shiny-pill", className].filter(Boolean).join(" "),
    },
    h(
      "span",
      { className: "shiny-pill__base", style: { color: textColor } },
      text
    ),
    h(
      "span",
      {
        className: "shiny-pill__shine",
        style: {
          color: shineColor,
          animationDuration: `${cycleSec}s`,
        },
        "aria-hidden": true,
      },
      text
    )
  );
}
