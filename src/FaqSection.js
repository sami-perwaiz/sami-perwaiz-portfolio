import {
  createElement as h,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EASE = "power4.out";
const DURATION = 0.8;
const BLUR_FROM = "blur(16px)";
const BLUR_TO = "blur(0px)";

let faqRevealPlayed = false;

export function resetFaqReveal() {
  faqRevealPlayed = false;
}

function clearRevealProps(els) {
  const list = (Array.isArray(els) ? els : [els]).filter(Boolean);
  if (!list.length) return;
  gsap.set(list, {
    clearProps: "opacity,transform,filter,visibility,willChange",
  });
}

function hideBlurred(el) {
  if (!el) return;
  gsap.set(el, {
    opacity: 0,
    y: 24,
    filter: BLUR_FROM,
    force3D: true,
    willChange: "transform, opacity, filter",
  });
}

/**
 * Blur reveal when the section enters the viewport:
 * title → description → FAQ items (staggered).
 * Fires once per session when ~20% of the section crosses the bottom edge.
 */
function useFaqBlurReveal(
  sectionRef,
  titleRef,
  listRef,
  { disabled = false } = {}
) {
  useLayoutEffect(() => {
    const section = sectionRef?.current;
    const title = titleRef?.current;
    const list = listRef?.current;
    if (!section || disabled) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const desc = section.querySelector(".faq-section__desc");
    const headerTargets = [title, desc].filter(Boolean);
    const items = list ? Array.from(list.querySelectorAll(".faq-item")) : [];
    const revealTargets = [...headerTargets, ...items];

    if (reduceMotion) {
      clearRevealProps(revealTargets);
      return undefined;
    }

    if (faqRevealPlayed) {
      clearRevealProps(revealTargets);
      return undefined;
    }

    let cancelled = false;
    let played = false;
    let st = null;
    let tl = null;

    revealTargets.forEach(hideBlurred);

    const play = () => {
      if (cancelled || played) return;
      if (faqRevealPlayed) {
        clearRevealProps(revealTargets);
        played = true;
        return;
      }
      played = true;
      st?.kill();

      tl = gsap.timeline({
        defaults: { ease: EASE, force3D: true },
        onComplete: () => {
          faqRevealPlayed = true;
          clearRevealProps(revealTargets);
        },
      });

      if (headerTargets.length) {
        tl.to(headerTargets, {
          opacity: 1,
          y: 0,
          filter: BLUR_TO,
          duration: DURATION,
          stagger: 0.14,
        });
      }

      if (items.length) {
        tl.to(
          items,
          {
            opacity: 1,
            y: 0,
            filter: BLUR_TO,
            duration: DURATION,
            stagger: 0.1,
          },
          headerTargets.length ? "-=0.45" : 0
        );
      }
    };

    st = ScrollTrigger.create({
      id: "faq-blur-reveal",
      trigger: section,
      start: "20% bottom",
      once: true,
      onEnter: play,
      refreshPriority: -1,
    });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (cancelled || faqRevealPlayed) {
        if (faqRevealPlayed) {
          clearRevealProps(revealTargets);
        }
        return;
      }
      if (st && typeof st.start === "number" && st.scroll() >= st.start) {
        play();
      }
    });

    return () => {
      cancelled = true;
      st?.kill();
      tl?.kill();
      if (!faqRevealPlayed) clearRevealProps(revealTargets);
    };
  }, [sectionRef, titleRef, listRef, disabled]);
}

const FAQS = [
  {
    question: "What types of projects do you take on?",
    answer:
      "I work with startups, growing businesses, and established companies to design digital products that are intuitive, scalable, and built around real user needs. Whether it's a new product, a redesign, or an MVP, I tailor my approach to fit your goals.",
  },
  {
    question: "What's your design process?",
    answer:
      "Every project starts with understanding the problem before designing the solution. My process typically includes discovery, user experience planning, wireframing, visual design, prototyping, and developer handoff—with collaboration and feedback built into every stage.",
  },
  {
    question: "How do you collaborate with clients?",
    answer:
      "Clear communication is a big part of how I work. You'll receive regular updates, have opportunities to review progress, and stay involved throughout the project. I believe the best results come from working closely together, not handing work over at the end.",
  },
  {
    question: "Do you work with developers and product teams?",
    answer:
      "Yes. I regularly collaborate with developers, product managers, and stakeholders to ensure designs are practical, well-documented, and ready for implementation. My goal is to make the transition from design to development as seamless as possible.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Timelines depend on the scope and complexity of the project. After our initial conversation, I'll provide a clear proposal outlining deliverables, milestones, and an estimated timeline so expectations are aligned from day one.",
  },
  {
    question: "How do we get started?",
    answer:
      "Simply get in touch through the contact form with a brief overview of your project. I'll review your requirements, schedule a discovery call if needed, and recommend the best way to move forward.",
  },
];

function FaqIcon() {
  return h(
    "span",
    { className: "faq-item__icon", "aria-hidden": true },
    h(
      "svg",
      {
        className: "faq-item__icon-plus",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
      h("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
      h("path", { d: "M12 5l0 14" }),
      h("path", { d: "M5 12l14 0" })
    )
  );
}

function FaqItem({ item, index, open, onToggle }) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return h(
    "div",
    {
      className: ["faq-item", open ? "is-open" : ""].filter(Boolean).join(" "),
    },
    h(
      "button",
      {
        id: buttonId,
        type: "button",
        className: "faq-item__trigger",
        "aria-expanded": open,
        "aria-controls": panelId,
        onClick: onToggle,
      },
      h(
        "div",
        { className: "faq-item__content" },
        h("span", { className: "faq-item__question" }, item.question),
        h(
          "div",
          {
            id: panelId,
            className: "faq-item__panel",
            role: "region",
            "aria-labelledby": buttonId,
            "aria-hidden": !open,
          },
          h(
            "div",
            { className: "faq-item__panel-inner" },
            h("span", { className: "faq-item__answer" }, item.answer)
          )
        )
      ),
      h(FaqIcon)
    ),
    h("hr", { className: "faq-item__line", "aria-hidden": true })
  );
}

export function FaqSection({ reduceMotion = false }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const listRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  useFaqBlurReveal(sectionRef, titleRef, listRef, {
    disabled: Boolean(reduceMotion),
  });

  return h(
    "section",
    {
      ref: sectionRef,
      className: "faq-section",
      id: "faq",
      "aria-label": "Popular Queries",
      "data-scroll-section": "faq",
    },
    h(
      "div",
      { className: "faq-section__inner" },
      h(
        "div",
        { className: "faq-section__header" },
        h(
          "h2",
          {
            ref: titleRef,
            className: "faq-section__title",
            "data-scroll-title": "faq",
          },
          "Popular Queries"
        ),
        h(
          "p",
          { className: "faq-section__desc" },
          "From strategy to execution, we’re trusted to deliver outcomes that make a difference."
        )
      ),
      h(
        "div",
        { ref: listRef, className: "faq-section__list" },
        ...FAQS.map((item, index) =>
          h(FaqItem, {
            key: item.question,
            item,
            index,
            open: openIndex === index,
            onToggle: () =>
              setOpenIndex((current) => (current === index ? null : index)),
          })
        )
      )
    )
  );
}
