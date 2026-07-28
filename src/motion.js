/** Shared Framer Motion viewport + transition tokens */

/** Apple-like ease — slow settle, no snap */
export const appleEase = [0.22, 1, 0.36, 1];

/** Blur + rise reveal used on 404 / Privacy Policy */
export const appleReveal = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(16px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

/** Reduced-motion fallback for entrance reveals */
export const fadeUpBlurReduced = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const revealViewport = {
  once: true,
  amount: 0.18,
  margin: "0px 0px -6% 0px",
};
