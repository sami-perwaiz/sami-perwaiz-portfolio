import { createElement as h } from "react";

/** Figma 40004095:19227 — Case Study Navbar */
export function CaseStudyNavbar({ reduceMotion, onNavigateHome }) {
  return h(
    "header",
    { className: "cs-navbar", "aria-label": "Case study" },
    h("img", {
      className: "cs-navbar__bg",
      src: "/assets/case-study/navbar-bg.png",
      alt: "",
      decoding: "async",
      "aria-hidden": true,
    }),
    h(
      "div",
      { className: "cs-navbar__inner" },
      h(
        "a",
        {
          className: "cs-navbar__back",
          href: "/#projects",
          onClick: (event) => {
            event.preventDefault();
            onNavigateHome?.("/#projects", { reduceMotion });
          },
        },
        h("span", { className: "cs-navbar__back-icon", "aria-hidden": true }),
        h("span", { className: "cs-navbar__back-label" }, "Back to Projects")
      ),
      h(
        "a",
        {
          className: "cs-navbar__hello",
          href: "/#contact",
          onClick: (event) => {
            event.preventDefault();
            onNavigateHome?.("/#contact", { reduceMotion });
          },
        },
        "Say Hello"
      )
    )
  );
}
