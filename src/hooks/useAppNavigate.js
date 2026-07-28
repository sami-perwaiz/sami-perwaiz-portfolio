import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ensureHomeContactRestorePending,
  ensureHomeProjectsRestorePending,
  saveProjectsScrollForReturn,
} from "../routeScroll.js";
import { scrollToHero, scrollToId } from "../scrollToHero.js";
import { pageSlideExit } from "../pageSlideTransition.js";

function scheduleHomeHashScroll(hash, { reduceMotion, immediate = false } = {}) {
  if (!hash || hash === "contact" || hash === "projects") return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToId(hash, { reduceMotion, immediate });
    });
  });
}

/**
 * App-aware navigation with scroll-restore side effects and horizontal slide
 * transitions between Home and case study routes.
 */
export function useAppNavigate({ reduceMotion } = {}) {
  const location = useLocation();
  const routerNavigate = useNavigate();

  const navigate = useCallback(
    (nextPath, options = {}) => {
      const [path, hash = ""] = nextPath.split("#");
      const pathnameOnly = path || "/";
      const url = hash ? `${pathnameOnly}#${hash}` : pathnameOnly;
      const fromPath = location.pathname;
      const samePath = fromPath === pathnameOnly;
      const motionOff = options.reduceMotion ?? reduceMotion;
      const scrollImmediate = options.immediate ?? false;

      const goingToCaseStudy =
        pathnameOnly.startsWith("/projects/") &&
        !fromPath.startsWith("/projects/");
      const goingToPrivacy =
        pathnameOnly === "/privacy-policy" && fromPath !== "/privacy-policy";
      const goingHomeToContact =
        pathnameOnly === "/" && hash === "contact" && fromPath !== "/";
      const returningHomeFromCaseStudy =
        fromPath.startsWith("/projects/") &&
        pathnameOnly === "/" &&
        hash !== "contact";

      if (goingToCaseStudy) {
        saveProjectsScrollForReturn();
      }

      if (goingHomeToContact) {
        ensureHomeContactRestorePending();
      } else if (
        returningHomeFromCaseStudy &&
        (!hash || hash === "projects")
      ) {
        ensureHomeProjectsRestorePending();
      }

      if (goingToCaseStudy && !motionOff && !options.immediate) {
        pageSlideExit({
          direction: "forward",
          reduceMotion: motionOff,
          onNavigate: () => routerNavigate(url),
        });
        return;
      }

      if (returningHomeFromCaseStudy && !motionOff && !options.immediate) {
        pageSlideExit({
          direction: "back",
          reduceMotion: motionOff,
          onNavigate: () => {
            routerNavigate(url);
            scheduleHomeHashScroll(hash, {
              reduceMotion: motionOff,
              immediate: scrollImmediate,
            });
          },
        });
        return;
      }

      routerNavigate(url);

      if (
        goingHomeToContact ||
        (returningHomeFromCaseStudy && (!hash || hash === "projects")) ||
        goingToCaseStudy ||
        goingToPrivacy
      ) {
        return;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (hash) {
            scrollToId(hash, {
              reduceMotion: motionOff,
              immediate: scrollImmediate,
            });
            return;
          }

          scrollToHero({
            reduceMotion: motionOff,
            immediate: scrollImmediate || !samePath,
          });
        });
      });
    },
    [location.pathname, reduceMotion, routerNavigate]
  );

  return navigate;
}
