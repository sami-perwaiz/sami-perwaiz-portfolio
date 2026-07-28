import { createElement as h } from "react";
import { Hero } from "../Hero.jsx";
import { SelectedWork } from "../AppHome.js";

/**
 * Home route — hero, selected work grid, and below-fold sections.
 */
export function Home({
  reduceMotion,
  skipHomeEntrance,
  homeParked,
  homeRootRef,
  showRestOfHome,
  HomeBelowFold,
  onHeroEntranceComplete,
  onNavigate,
  contactRestoreInstant,
}) {
  return h(
    "div",
    {
      ref: homeRootRef,
      className: homeParked ? "home-root home-root--parked" : "home-root",
      hidden: homeParked ? true : undefined,
      inert: homeParked ? true : undefined,
      "aria-hidden": homeParked ? "true" : undefined,
    },
    h(Hero, {
      key: "hero",
      reduceMotion,
      skipEntrance: skipHomeEntrance || homeParked,
      onEntranceComplete: onHeroEntranceComplete,
    }),
    showRestOfHome
      ? h(SelectedWork, { key: "work", reduceMotion })
      : h("div", {
          key: "work-slot",
          className: "selected-work selected-work--slot",
          "aria-hidden": true,
        }),
    HomeBelowFold
      ? h(HomeBelowFold, {
          key: "below",
          reduceMotion,
          onNavigate,
          contactRestoreInstant,
        })
      : null
  );
}
