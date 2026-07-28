import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_END = "+=120%";
const ST_ID = "hero-scroll-exit";

let activeTimeline = null;
let resizeHandler = null;

export function isHeroScrollExitActive() {
  return Boolean(activeTimeline);
}

/**
 * Pin + scrub hero exit. Animates `.hero-center` + statement as two layers
 * (cheaper than per-line tweens on every scroll frame).
 */
export function setupHeroScrollExit({
  hero,
  heroCenter,
  statement,
  reduceMotion = false,
} = {}) {
  if (reduceMotion || !hero || !heroCenter) return null;

  if (activeTimeline) {
    return activeTimeline;
  }

  ScrollTrigger.getById(ST_ID)?.kill();

  gsap.set([heroCenter, statement].filter(Boolean), { force3D: true });

  const tl = gsap.timeline({
    defaults: { ease: "none", force3D: true },
    scrollTrigger: {
      id: ST_ID,
      trigger: hero,
      start: "top top",
      end: SCROLL_END,
      scrub: 0.12,
      pin: true,
      pinSpacing: true,
      pinType: "transform",
      anticipatePin: 1,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
    },
  });

  tl.to(
    heroCenter,
    {
      y: -100,
      opacity: 0,
      duration: 1,
      transformOrigin: "center center",
    },
    0
  );

  if (statement) {
    tl.to(
      statement,
      {
        y: -80,
        opacity: 0,
        duration: 1,
        transformOrigin: "center center",
      },
      0.06
    );
  }

  activeTimeline = tl;

  resizeHandler = () => ScrollTrigger.refresh();
  window.addEventListener("resize", resizeHandler);

  return tl;
}

export function teardownHeroScrollExit() {
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
    resizeHandler = null;
  }

  if (!activeTimeline) return;

  activeTimeline.scrollTrigger?.kill();
  activeTimeline.kill();
  activeTimeline = null;
}
