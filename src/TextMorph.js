import { createElement as h, useId, useMemo } from "react";

/**
 * Originkit-style Text Morph shell (scroll-driven via GSAP in the parent).
 * Words are layered absolute; parent timeline controls opacity / blur / scale.
 */
export function TextMorph({
  words = "The Mind\nBehind the Work",
  sizeWord,
  className = "",
  color = "#000000",
  "aria-label": ariaLabel,
  morphRef,
}) {
  const rawId = useId();
  const safeId = String(rawId).replace(/[:]/g, "");
  const filterId = `tm-thr-${safeId}`;

  const wordList = useMemo(
    () =>
      String(words)
        .split(/\r?\n|,/)
        .map((w) => w.trim())
        .filter(Boolean),
    [words]
  );

  const longest = wordList.reduce(
    (acc, w) => (w.length > acc.length ? w : acc),
    ""
  );
  const anchorText = String(sizeWord || longest || " ").trim() || longest || " ";

  return h(
    "div",
    {
      ref: morphRef,
      className: ["text-morph", className].filter(Boolean).join(" "),
      role: "heading",
      "aria-level": 2,
      "aria-label": ariaLabel || wordList.join(" "),
      "data-scroll-title": true,
    },
    h(
      "svg",
      {
        className: "text-morph__svg",
        "aria-hidden": true,
      },
      h(
        "defs",
        null,
        h(
          "filter",
          { id: filterId },
          h("feColorMatrix", {
            in: "SourceGraphic",
            type: "matrix",
            values:
              "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9",
            result: "goo",
          }),
          h("feComposite", {
            in: "SourceGraphic",
            in2: "goo",
            operator: "atop",
          })
        )
      )
    ),
    h(
      "div",
      {
        className: "text-morph__stage",
        style: { filter: `url(#${filterId})` },
      },
      h(
        "div",
        { className: "text-morph__frame" },
        h(
          "span",
          { className: "text-morph__anchor", "aria-hidden": true },
          anchorText
        ),
        ...wordList.map((word, i) =>
          h(
            "span",
            {
              key: `${word}-${i}`,
              className: "text-morph__word",
              "data-morph-index": String(i),
              style: { color },
              "aria-hidden": true,
            },
            word
          )
        )
      )
    )
  );
}
