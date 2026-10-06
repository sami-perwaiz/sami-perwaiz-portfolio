export const homeSectionIds = ["hero", "about", "services", "toolkit", "projects", "testimonials", "contact"] as const;

export type HomeSectionId = (typeof homeSectionIds)[number];

export function isHomeSectionId(value: string | undefined): value is HomeSectionId {
  return homeSectionIds.some((sectionId) => sectionId === value);
}

export function scrollToPageSection(sectionId: string) {
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  document.getElementById(sectionId)?.scrollIntoView({ behavior, block: "start" });
}

export function scrollToHomeSection(sectionId: HomeSectionId) {
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  if (sectionId === "hero") {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  scrollToPageSection(sectionId);
}
