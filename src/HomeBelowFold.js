import { createElement as h } from "react";
import { AboutSection } from "./AboutSection.js";
import { ProjectsSection } from "./ProjectsSection.js";
import { ServicesSection } from "./ServicesSection.js";
import { ToolkitSection } from "./ToolkitSection.js";
import { FaqSection } from "./FaqSection.js";
import { ContactSection } from "./ContactSection.js";
import { FooterSection } from "./FooterSection.js";

/**
 * Below-fold home sections — dynamically imported after hero entrance
 * so Contact (RHF/zod/phone) and About scroll chapter don't block first paint.
 */
export function HomeBelowFold({
  reduceMotion = false,
  onNavigate,
  contactRestoreInstant = false,
}) {
  return h(
    "div",
    { className: "home-below-fold", "data-home-below-fold": "" },
    h(AboutSection, { key: "about", reduceMotion }),
    h(ProjectsSection, {
      key: "projects",
      reduceMotion,
      onNavigate,
    }),
    h(ServicesSection, { key: "services", reduceMotion }),
    h(ToolkitSection, { key: "toolkit", reduceMotion }),
    h(FaqSection, { key: "faq", reduceMotion }),
    h(ContactSection, {
      key: "contact",
      onNavigate,
      restoreInstant: contactRestoreInstant,
    }),
    h(FooterSection, { key: "footer", onNavigate, reduceMotion })
  );
}
