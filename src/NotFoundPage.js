import { createElement as h } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { appleEase, appleReveal, fadeUpBlurReduced } from "./motion.js";

/**
 * 404 — Figma Designs 40003783:10968
 */
export function NotFoundPage({ onNavigate }) {
  const reduceMotion = useReducedMotion();
  const itemVariants = reduceMotion ? fadeUpBlurReduced : appleReveal;
  const transition = reduceMotion
    ? { duration: 0 }
    : {
        duration: 1.55,
        ease: appleEase,
      };

  const goHome = (event) => {
    event.preventDefault();
    if (typeof onNavigate === "function") {
      onNavigate("/", { immediate: true });
      return;
    }
    window.location.assign("/");
  };

  const groupVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.28,
        delayChildren: reduceMotion ? 0 : 0.22,
      },
    },
  };

  return h(
    motion.section,
    {
      className: "not-found",
      "aria-label": "Page not found",
      initial: "hidden",
      animate: "show",
      variants: {
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduceMotion ? 0 : 0.2,
            delayChildren: reduceMotion ? 0 : 0.15,
          },
        },
      },
    },
    h(
      motion.div,
      { className: "not-found__inner", variants: groupVariants },
      h(
        motion.div,
        { className: "not-found__copy", variants: groupVariants },
        h(
          motion.h1,
          {
            className: "not-found__code",
            variants: itemVariants,
            transition,
          },
          "404"
        ),
        h(
          motion.p,
          {
            className: "not-found__message",
            variants: itemVariants,
            transition,
          },
          "The page you are looking for doesn't exist or has been moved, but don't worry, we'll get you back on track!"
        )
      ),
      h(
        motion.a,
        {
          className: "not-found__cta",
          href: "/",
          onClick: goHome,
          variants: itemVariants,
          transition,
        },
        "Go back home"
      )
    )
  );
}
