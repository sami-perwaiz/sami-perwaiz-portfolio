/** Hover-driven UI runs on desktop only (1025px+). Tablet & mobile skip hover UX. */
export const DESKTOP_HOVER_MQ = "(min-width: 1025px)";

export function isDesktopHoverEnabled() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(DESKTOP_HOVER_MQ).matches;
}
