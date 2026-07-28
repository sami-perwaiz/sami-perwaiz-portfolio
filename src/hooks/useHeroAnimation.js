import { useLayoutEffect } from "react";
import {
  isHeroScrollExitActive,
  setupHeroScrollExit,
  teardownHeroScrollExit,
} from "../heroScrollExit.js";

/**
 * Ensures hero scroll exit exists after entrance (or on skip).
 * Creation runs synchronously in useHeroEntrance — this hook only fills gaps.
 */
export function useHeroAnimation({
  heroRef,
  heroCenterRef,
  statementRef,
  reduceMotion = false,
  enabled = true,
} = {}) {
  useLayoutEffect(() => {
    if (!enabled || reduceMotion || isHeroScrollExitActive()) return undefined;

    const hero = heroRef?.current;
    const heroCenter = heroCenterRef?.current;
    const statement = statementRef?.current;

    if (!hero || !heroCenter) return undefined;

    setupHeroScrollExit({ hero, heroCenter, statement, reduceMotion });

    return () => {
      teardownHeroScrollExit();
    };
  }, [
    heroRef,
    heroCenterRef,
    statementRef,
    reduceMotion,
    enabled,
  ]);
}
