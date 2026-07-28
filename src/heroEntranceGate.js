/** Coordinates first-load hero entrance with other heavy animations (cursor, etc.). */
let heroEntrancePlaying = false;

export function isHeroEntrancePlaying() {
  return heroEntrancePlaying;
}

export function beginHeroEntrance() {
  heroEntrancePlaying = true;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hero-entrance-start"));
  }
}

export function endHeroEntrance() {
  if (!heroEntrancePlaying) return;
  heroEntrancePlaying = false;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hero-entrance-complete"));
  }
}

export function onHeroEntranceComplete(listener) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("hero-entrance-complete", listener);
  return () => window.removeEventListener("hero-entrance-complete", listener);
}
