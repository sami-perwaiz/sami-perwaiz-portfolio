import { useLayoutEffect, useRef } from "react";
import {
  getPageSlideDirection,
  isPageSlideTransitionActive,
  pageSlideEnter,
} from "../pageSlideTransition.js";

/** Runs the enter half of a horizontal slide after the route updates. */
export function usePageSlideTransition(pathname, reduceMotion) {
  const prevPathRef = useRef(pathname);

  useLayoutEffect(() => {
    const prevPath = prevPathRef.current;
    prevPathRef.current = pathname;

    if (!isPageSlideTransitionActive()) return undefined;

    const direction = getPageSlideDirection();
    if (!direction) return undefined;

    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      pageSlideEnter({ direction, reduceMotion: Boolean(reduceMotion) });
    };

    requestAnimationFrame(run);

    return () => {
      cancelled = true;
    };
  }, [pathname, reduceMotion]);
}
