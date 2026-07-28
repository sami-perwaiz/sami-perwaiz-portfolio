import { createElement as h } from "react";
import { scrollToId } from "./scrollToHero.js";
import { SnakeGrid } from "./components/SnakeGrid.jsx";

const ASSET_V = "2026-07-26b";

const CTA_TITLE = "Ready for What's Next?";
const CTA_DESC =
  "Let's talk about your project and explore the best way forward.";
const CTA_BUTTON = "Book a Call";

const CTA_CURSOR_LABELS = [
  "Happy to Chat 😊",
  "Happy to Connect 👋",
  "Happy to Help 💬",
  "Happy to Build 🚀",
  "Happy You're Here ❤️",
];

const BOOK_A_CALL_URL = "https://calendar.app.google/9YiA2LUHMbkevFS39";

const FOOTER_LINKS = [
  { id: "product-stories", label: "Product Stories", hash: "projects" },
  { id: "expertise", label: "Expertise", hash: "services" },
  { id: "toolkit", label: "My Toolkit", hash: "toolkit" },
  { id: "start-conversation", label: "Start a Conversation", hash: "contact" },
];

const SOCIAL_LINKS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sami-perwaiz/",
    icon: `/assets/footer/linkedin.svg?v=${ASSET_V}`,
    width: 24,
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/uxui_sami",
    icon: `/assets/footer/x.svg?v=${ASSET_V}`,
    width: 23,
  },
  {
    id: "dribbble",
    label: "Dribbble",
    href: "https://dribbble.com/samiperwaiz",
    icon: `/assets/footer/dribbble.svg?v=${ASSET_V}`,
    width: 24,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/uiux.sami?igsh=Znh3Z2J6Mm1ya2ho&utm_source=qr",
    icon: `/assets/footer/instagram.svg?v=${ASSET_V}`,
    width: 24,
  },
];

function isHomePath() {
  if (typeof window === "undefined") return true;
  const path = window.location.pathname || "/";
  return path === "/" || path === "";
}

function handleHashNav(event, hash, { onNavigate, reduceMotion }) {
  event.preventDefault();
  if (isHomePath()) {
    event.stopPropagation();
    scrollToId(hash, { reduceMotion, immediate: false });
    return;
  }
  onNavigate?.(`/#${hash}`, { reduceMotion });
}

function BookACallButton() {
  return h(
    "a",
    {
      className: "site-footer-cta__btn",
      href: BOOK_A_CALL_URL,
      target: "_blank",
      rel: "noopener noreferrer",
      "data-cursor-labels": CTA_CURSOR_LABELS.join("|"),
      "data-cursor-type": "type",
    },
    h(
      "span",
      { className: "site-footer-cta__btn-label-swap" },
      h(
        "span",
        { className: "site-footer-cta__btn-label-track" },
        h(
          "span",
          { className: "site-footer-cta__btn-label-line" },
          CTA_BUTTON
        ),
        h(
          "span",
          {
            className: "site-footer-cta__btn-label-line",
            "aria-hidden": true,
          },
          CTA_BUTTON
        )
      )
    )
  );
}

export function FooterSection({ onNavigate, reduceMotion = false }) {
  return h(
    "div",
    { className: "site-footer-wrap" },
    h(
      "section",
      {
        className: "site-footer-cta",
        "aria-label": "Call to action",
      },
      h(
        "div",
        { className: "site-footer-cta__card" },
        h(
          "div",
          { className: "site-footer-cta__content" },
          h(
            "div",
            { className: "site-footer-cta__copy" },
            h(
              "h2",
              { className: "site-footer-cta__title" },
              CTA_TITLE
            ),
            h(
              "p",
              { className: "site-footer-cta__desc" },
              CTA_DESC
            )
          ),
          h(BookACallButton)
        ),
        h(
          "div",
          {
            className: "site-footer-cta__visual",
            "aria-hidden": true,
          },
          h(
            "div",
            { className: "site-footer-cta__snake-host" },
            h(SnakeGrid, {
              boardColor: "#141414",
              cellSize: 34,
              style: { background: "#141414" },
            })
          )
        )
      )
    ),
    h(
      "footer",
      {
        className: "site-footer",
        "aria-label": "Site footer",
      },
      h(
        "div",
        { className: "site-footer__top site-footer__container" },
        h("p", { className: "site-footer__brand" }, "Sami Perwaiz"),
        h(
          "nav",
          {
            className: "site-footer__nav",
            "aria-label": "Footer",
          },
          ...FOOTER_LINKS.map((link) =>
            h(
              "a",
              {
                key: link.id,
                className: "site-footer__nav-link",
                href: `/#${link.hash}`,
                onClick: (event) =>
                  handleHashNav(event, link.hash, { onNavigate, reduceMotion }),
              },
              link.label
            )
          )
        )
      ),
      h(
        "div",
        { className: "site-footer__bottom site-footer__container" },
        h("div", { className: "site-footer__divider", "aria-hidden": true }),
        h(
          "div",
          { className: "site-footer__meta" },
          h(
            "p",
            { className: "site-footer__copyright" },
            "© 2026 Sami Perwaiz. All Rights Reserved."
          ),
          h(
            "nav",
            {
              className: "site-footer__social",
              "aria-label": "Social links",
            },
            ...SOCIAL_LINKS.map((item) =>
              h(
                "a",
                {
                  key: item.id,
                  className: [
                    "site-footer__social-link",
                    `site-footer__social-link--${item.id}`,
                  ].join(" "),
                  href: item.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  "aria-label": item.label,
                },
                h("img", {
                  className: "site-footer__social-icon",
                  src: item.icon,
                  alt: "",
                  width: item.width,
                  height: 24,
                  decoding: "async",
                  "aria-hidden": true,
                }),
              )
            )
          )
        )
      )
    )
  );
}
