import { createElement as h, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  appleEase,
  appleReveal,
  fadeUpBlurReduced,
  revealViewport,
} from "./motion.js";

const EMAIL = "samiperwaiz@gmail.com";

const SECTIONS = [
  {
    id: "information-i-collect",
    title: "Information I Collect",
    paragraphs: [
      "When you contact me through the enquiry form, you may choose to share information such as your name, email address, phone number, project details, estimated budget, selected services, and preferred project timeline.",
      "Only the information required to understand your enquiry and respond appropriately is collected.",
    ],
  },
  {
    id: "how-your-information-is-used",
    title: "How Your Information Is Used",
    paragraphs: [
      "The information you provide is used to reply to your enquiry, understand your project requirements, prepare proposals or quotations, schedule meetings, and communicate throughout the project if we decide to work together.",
      "Your information is never used for advertising, promotional emails, or any purpose unrelated to your enquiry.",
    ],
  },
  {
    id: "keeping-your-information-secure",
    title: "Keeping Your Information Secure",
    paragraphs: [
      "Every enquiry is treated as confidential.",
      "Any information you share is handled carefully and stored securely. Access to your information is limited to me and is only used for communication relating to your project.",
      "Whether you're discussing a new business idea, an existing product, or simply asking a question, your information is handled with professionalism and discretion.",
    ],
  },
  {
    id: "email-communication",
    title: "Email Communication",
    paragraphs: [
      "When you submit the contact form, your enquiry is delivered directly to:",
    ],
    email: EMAIL,
    afterEmail: [
      "This email address is used only to respond to your enquiry, discuss your project, arrange meetings, and manage project communication.",
    ],
  },
  {
    id: "contact-form-submission-limits",
    title: "Contact Form Submission Limits",
    paragraphs: [
      "To protect this website from spam, abuse, and automated submissions, a temporary submission limit is applied to the contact form.",
      "After a successful submission, the same email address cannot be used to submit another enquiry for 2 hours. If another submission is attempted during this period, a friendly message will be displayed asking the user to wait until the cooldown period has expired before submitting again.",
      "This temporary limit is used solely to maintain the security, reliability, and availability of the contact form. It does not affect any other part of the website, and no additional personal information is collected for this purpose beyond the email address provided with your enquiry.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paragraphs: [
      "This portfolio is designed to provide a simple browsing experience.",
      "No advertising cookies are used, and your visit is not tracked for marketing purposes.",
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    paragraphs: [
      "You remain in control of the information you share.",
      "If you would like to access, update, or remove your information, you can contact me at any time. If you no longer wish to continue the conversation, you may also request that your information be deleted.",
      "Reasonable requests will always be handled as quickly as possible.",
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    paragraphs: [
      "Your information is only kept for as long as it is needed to respond to your enquiry or manage an active project.",
      "If we do not move forward with a collaboration, your information will not be kept any longer than necessary.",
    ],
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    paragraphs: [
      "Your personal information is never sold, shared, rented, or exchanged with third parties.",
      "The information you provide is used only for communication regarding your enquiry and any project we work on together.",
    ],
  },
  {
    id: "changes-to-this-policy",
    title: "Changes to This Policy",
    paragraphs: [
      "This Privacy Policy may be updated from time to time to reflect changes to this website or the way enquiries are managed.",
      "Whenever changes are made, the Last Updated date at the top of this page will also be updated.",
    ],
  },
  {
    id: "privacy-contact",
    title: "Contact",
    paragraphs: [
      "If you have any questions about this Privacy Policy or the way your information is handled, feel free to get in touch.",
    ],
    contactEmail: EMAIL,
  },
  {
    id: "consent",
    title: "Consent",
    paragraphs: [
      "By submitting the contact form, you confirm that you have read this Privacy Policy and agree to the collection and use of your information for the purpose of responding to your enquiry and communicating about your project.",
    ],
  },
];

function CopyIcon() {
  return h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 20,
      height: 20,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    },
    h("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
    h("path", {
      d: "M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666",
    }),
    h("path", {
      d: "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1",
    })
  );
}

function CheckIcon() {
  return h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 20,
      height: 20,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    },
    h("path", { d: "M5 12l5 5l10 -10" })
  );
}

function CopyEmail({ email = EMAIL }) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable; fail silently (no alerts).
    }
  }

  return h(
    "span",
    { className: "privacy-page__email-row" },
    h(
      "a",
      {
        className: "privacy-page__strong-link",
        href: `mailto:${email}`,
      },
      email
    ),
    h(
      "button",
      {
        type: "button",
        className: "privacy-page__copy-btn",
        onClick: copyEmail,
        "aria-label": copied ? "Email copied" : "Copy email address",
      },
      h(
        "span",
        { className: "privacy-page__copy-stage", "aria-hidden": true },
        h(
          "span",
          {
            className: [
              "privacy-page__copy-icon",
              copied ? "is-exit" : "is-enter",
            ].join(" "),
          },
          h(CopyIcon)
        ),
        h(
          "span",
          {
            className: [
              "privacy-page__copy-icon",
              copied ? "is-enter" : "is-exit",
            ].join(" "),
          },
          h(CheckIcon)
        )
      )
    )
  );
}

function Paragraph({ children }) {
  return h("p", { className: "privacy-page__p" }, children);
}

function useRevealMotion() {
  const reduceMotion = useReducedMotion();
  const itemVariants = reduceMotion ? fadeUpBlurReduced : appleReveal;
  const transition = reduceMotion
    ? { duration: 0 }
    : {
        duration: 1.1,
        ease: appleEase,
      };

  return { reduceMotion, itemVariants, transition };
}

function RevealBlock({ className, as = "div", children, ...props }) {
  const { itemVariants, transition } = useRevealMotion();
  const Component = motion[as] || motion.div;

  return h(
    Component,
    {
      className,
      variants: itemVariants,
      initial: "hidden",
      whileInView: "show",
      viewport: revealViewport,
      transition,
      ...props,
    },
    children
  );
}

function GenuineInquiriesNotice() {
  return h(
    RevealBlock,
    {
      as: "aside",
      className: "privacy-page__notice",
      "aria-labelledby": "genuine-project-inquiries-title",
    },
    h(
      "span",
      {
        className:
          "privacy-page__notice-accent privacy-page__notice-accent--start",
        "aria-hidden": true,
      },
      h("span", {
        className: "privacy-page__notice-dot privacy-page__notice-dot--top",
      }),
      h("span", { className: "privacy-page__notice-rail" })
    ),
    h(
      "span",
      {
        className:
          "privacy-page__notice-accent privacy-page__notice-accent--end",
        "aria-hidden": true,
      },
      h("span", { className: "privacy-page__notice-rail" }),
      h("span", {
        className: "privacy-page__notice-dot privacy-page__notice-dot--bottom",
      })
    ),
    h(
      "h2",
      {
        id: "genuine-project-inquiries-title",
        className: "privacy-page__notice-title",
      },
      "Genuine Project Inquiries"
    ),
    h(
      "p",
      { className: "privacy-page__notice-body" },
      "By submitting this form or booking a consultation, you confirm that the information you provide is accurate and intended for a genuine project inquiry. To ensure a smooth experience for everyone, we may decline or cancel bookings containing false, incomplete, or misleading information. By continuing, you also agree to our Privacy Policy."
    )
  );
}

function Section({ section }) {
  return h(
    RevealBlock,
    {
      as: "section",
      className: "privacy-page__section",
      id: section.id,
      "aria-labelledby": `${section.id}-title`,
    },
    h(
      "h2",
      { id: `${section.id}-title`, className: "privacy-page__h2" },
      section.title
    ),
    ...(section.paragraphs || []).map((text, i) =>
      h(Paragraph, { key: `p-${i}` }, text)
    ),
    section.list
      ? h(
          "ul",
          { className: "privacy-page__list" },
          ...section.list.map((item) => h("li", { key: item }, item))
        )
      : null,
    ...(section.afterList || []).map((text, i) =>
      h(Paragraph, { key: `after-${i}` }, text)
    ),
    section.email
      ? h("p", { className: "privacy-page__p" }, h(CopyEmail, { email: section.email }))
      : null,
    ...(section.afterEmail || []).map((text, i) =>
      h(Paragraph, { key: `email-after-${i}` }, text)
    ),
    ...(section.contactEmail
      ? [
          h(
            "p",
            { key: "contact-label", className: "privacy-page__p" },
            h("strong", { className: "privacy-page__strong" }, "Email")
          ),
          h(
            "p",
            { key: "contact-email", className: "privacy-page__p" },
            h(CopyEmail, { email: section.contactEmail })
          ),
        ]
      : [])
  );
}

export function PrivacyPolicyPage() {
  const { reduceMotion, itemVariants, transition } = useRevealMotion();
  const contactIndex = SECTIONS.findIndex((section) => section.id === "privacy-contact");
  const sectionsBeforeContact = SECTIONS.slice(0, contactIndex);
  const sectionsFromContact = SECTIONS.slice(contactIndex);

  const introVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.14,
        delayChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  return h(
    "article",
    {
      className: "privacy-page",
      "aria-label": "Privacy Policy",
    },
    h(
      "div",
      { className: "privacy-page__inner" },
      h(
        motion.div,
        {
          className: "privacy-page__intro",
          initial: "hidden",
          animate: "show",
          variants: introVariants,
        },
        h(
          motion.h1,
          {
            className: "privacy-page__title",
            variants: itemVariants,
            transition,
          },
          "Privacy Policy"
        ),
        h(
          motion.p,
          {
            className: "privacy-page__updated",
            variants: itemVariants,
            transition,
          },
          h("strong", { className: "privacy-page__strong" }, "Last Updated: 18 July 2026")
        ),
        h(
          motion.p,
          {
            className: "privacy-page__p",
            variants: itemVariants,
            transition,
          },
          "Your privacy is important to me."
        ),
        h(
          motion.p,
          {
            className: "privacy-page__p",
            variants: itemVariants,
            transition,
          },
          "This Privacy Policy explains how your information is collected, how it is used, and how it is protected when you visit my portfolio or contact me through this website."
        ),
        h(
          motion.p,
          {
            className: "privacy-page__p",
            variants: itemVariants,
            transition,
          },
          "The purpose of collecting your information is simply to understand your project, communicate with you, and provide the services you request. Nothing more."
        )
      ),
      ...sectionsBeforeContact.map((section) =>
        h(Section, { key: section.id, section })
      ),
      h(GenuineInquiriesNotice, { key: "genuine-project-inquiries" }),
      ...sectionsFromContact.map((section) =>
        h(Section, { key: section.id, section })
      )
    )
  );
}
