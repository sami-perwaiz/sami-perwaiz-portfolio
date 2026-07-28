import { createElement as h, Fragment, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { DocsCaseStudy } from "./DocsCaseStudy.js";
import { BackToHeroButton } from "./BackToHeroButton.js";
import { FooterSection } from "./FooterSection.js";
import { useCaseStudyHeroEntrance } from "./useCaseStudyHeroEntrance.js";

function SectionTag({ label, wide }) {
  return h(
    "div",
    {
      className: ["cs-tag", wide ? "cs-tag--wide" : ""].filter(Boolean).join(" "),
    },
    h("span", null, label)
  );
}

function ScreenStack({ screens, flowTitle, desktop }) {
  return h(
    "div",
    {
      className: ["cs-screen-stack", desktop ? "cs-screen-stack--desktop" : ""]
        .filter(Boolean)
        .join(" "),
    },
    ...screens.map((src, index) =>
      h(
        "figure",
        {
          key: src,
          className: ["cs-screen", desktop ? "cs-screen--desktop" : ""]
            .filter(Boolean)
            .join(" "),
        },
        h("img", {
          src,
          alt: `${flowTitle} screen ${index + 1}`,
          loading: index < 2 ? "eager" : "lazy",
          decoding: "async",
          fetchPriority: index < 2 ? "high" : "auto",
        })
      )
    )
  );
}

function GenericCaseStudy({ study, reduceMotion }) {
  const prefersReduced = useReducedMotion();
  const motionOff = Boolean(reduceMotion ?? prefersReduced);
  const heroRef = useRef(null);

  return h(
    "div",
    { className: "case-study" },
    h(
      "section",
      { ref: heroRef, className: "case-study-hero case-study-hero--compact" },
      h("span", { className: "case-study-kicker" }, study.eyebrow),
      h("h1", { className: "case-study-hero__title" }, study.title),
      h("p", { className: "case-study-hero__intro" }, study.intro),
      h(
        "div",
        { className: "case-study-hero__preview" },
        h("img", {
          src: study.heroImage,
          alt: `${study.title} featured mockup`,
          loading: "eager",
          decoding: "async",
        })
      )
    ),
    h(
      "section",
      { className: "case-study-summary" },
      ...study.summary.map((item) =>
        h(
          "div",
          { key: item.label, className: "case-study-summary__card" },
          h("span", { className: "case-study-summary__label" }, item.label),
          h("strong", { className: "case-study-summary__value" }, item.value)
        )
      )
    ),
    ...study.sections.map((section) =>
      h(
        "section",
        { key: section.id, className: "case-study-block" },
        h("h2", { className: "case-study-block__title" }, section.title),
        section.bullets
          ? h(
              "ul",
              { className: "case-study-list" },
              ...section.bullets.map((item) => h("li", { key: item }, item))
            )
          : h("p", { className: "case-study-block__body" }, section.text)
      )
    ),
    h(BackToHeroButton, { heroRef, reduceMotion: motionOff })
  );
}

function FlowSection({ flow, desktop }) {
  const copy = h(
    "div",
    {
      key: `${flow.id}-copy`,
      className: desktop ? "cs-flow__copy cs-flow__copy--desktop" : "cs-flow__copy",
    },
    h(SectionTag, { label: flow.title, wide: true }),
    h(
      "div",
      { className: "cs-strategy__block" },
      h("h3", { className: "cs-flow__headline" }, flow.headline),
      h(
        "div",
        { className: "cs-flow__prose" },
        h("p", { className: "cs-body" }, flow.body),
        flow.rationale?.length
          ? h(
              "ul",
              { className: "cs-list" },
              ...flow.rationale.map((item) => h("li", { key: item }, item))
            )
          : null
      )
    )
  );

  const visual = h(
    "div",
    {
      key: `${flow.id}-visual`,
      className: desktop ? "cs-flow__visual cs-flow__visual--desktop" : "cs-flow__visual",
    },
    h(ScreenStack, {
      screens: flow.screens,
      flowTitle: flow.title,
      desktop,
    })
  );

  return h(
    "section",
    {
      className: ["cs-flow", desktop ? "cs-flow--desktop" : ""].filter(Boolean).join(" "),
    },
    copy,
    visual
  );
}

function EditorialCaseStudy({ study, reduceMotion }) {
  const desktop = study.walkthroughLayout === "desktop";
  const iaLabel = study.iaLabel || "Information architecture / user flow";
  const visualLabel = study.visualLabel || "Design system / visual direction";
  const overviewLabel = study.overviewLabel || "Project overview";
  const problemLabel = study.problemLabel || "Problem statement";
  const prefersReduced = useReducedMotion();
  const motionOff = Boolean(reduceMotion ?? prefersReduced);
  const pageRef = useRef(null);
  const heroRef = useRef(null);

  useCaseStudyHeroEntrance({
    heroRef,
    pageRef,
    reduceMotion: motionOff,
    studySlug: study.slug,
  });

  useEffect(() => {
    if (!study.heroImage || typeof document === "undefined") return;
    const existing = document.querySelector(
      `link[rel="preload"][as="image"][href="${study.heroImage}"]`
    );
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = study.heroImage;
    link.fetchPriority = "high";
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [study.heroImage]);

  return h(
    "div",
    { ref: pageRef, className: "case-study cs-page" },
    h(
      "div",
      { className: "cs-page__inner" },
      h(
        "section",
        { ref: heroRef, className: "cs-hero" },
        h(
          "div",
          { className: "cs-hero__row" },
          h(
            "div",
            { className: "cs-hero__copy" },
            h(SectionTag, { label: study.eyebrow }),
            h(
              "div",
              { className: "cs-hero__text" },
              h("h1", { className: "cs-hero__title" }, study.title),
              study.tagline
                ? h("p", { className: "cs-hero__tagline" }, study.tagline)
                : null,
              h("p", { className: "cs-hero__intro" }, study.intro)
            ),
            h(
              "div",
              { className: "cs-hero__logo" },
              h("img", {
                src: study.heroLogo,
                alt: `${study.title} logo`,
                loading: "eager",
                decoding: "async",
              })
            )
          ),
          h(
            "div",
            { className: "cs-hero__thumb" },
            h("img", {
              src: study.heroImage,
              alt: `${study.title} product preview`,
              loading: "eager",
              decoding: "async",
              fetchPriority: "high",
            })
          )
        ),
        h(
          "div",
          { className: "cs-meta" },
          ...study.summary.map((item) =>
            h(
              "div",
              { key: item.label, className: "cs-meta__card" },
              h("p", { className: "cs-meta__label" }, item.label),
              h("p", { className: "cs-meta__value" }, item.value)
            )
          )
        )
      ),
      h("hr", { className: "cs-rule", "aria-hidden": true }),
      h(
        "section",
        { className: "cs-pair" },
        h(
          "div",
          { className: "cs-pair__col" },
          h(SectionTag, { label: overviewLabel, wide: true }),
          h("p", { className: "cs-body" }, study.overview)
        ),
        h(
          "div",
          { className: "cs-pair__col" },
          h(SectionTag, { label: problemLabel, wide: true }),
          h("p", { className: "cs-body" }, study.problem)
        )
      ),
      study.responsibilities?.length
        ? h(
            "section",
            { className: "cs-pair" },
            h(
              "div",
              { className: "cs-pair__col" },
              h(SectionTag, { label: "Design goals", wide: true }),
              h(
                "ul",
                { className: "cs-list" },
                ...study.goals.map((item) => h("li", { key: item }, item))
              )
            ),
            h(
              "div",
              { className: "cs-pair__col" },
              h(SectionTag, { label: "Role and responsibilities", wide: true }),
              h(
                "ul",
                { className: "cs-list" },
                ...study.responsibilities.map((item) => h("li", { key: item }, item))
              )
            )
          )
        : h(
            "section",
            { className: "cs-block" },
            h(SectionTag, { label: "Design goals", wide: true }),
            h(
              "ul",
              { className: "cs-list" },
              ...study.goals.map((item) => h("li", { key: item }, item))
            )
          ),
      h(
        "section",
        { className: "cs-strategy" },
        h(SectionTag, { label: "UX strategy", wide: true }),
        h(
          "div",
          { className: "cs-strategy__block" },
          h("h2", { className: "cs-heading" }, study.strategyHeadline),
          h("p", { className: "cs-body" }, study.strategy)
        ),
        h(
          "div",
          { className: "cs-strategy__block" },
          h("h3", { className: "cs-subheading" }, iaLabel),
          h("p", { className: "cs-body" }, study.ia),
          study.iaItems?.length
            ? h(
                "ul",
                { className: "cs-list" },
                ...study.iaItems.map((item) => h("li", { key: item }, item))
              )
            : null
        ),
        h(
          "div",
          { className: "cs-strategy__block" },
          h("h3", { className: "cs-subheading" }, visualLabel),
          h("p", { className: "cs-body" }, study.visualDirection)
        )
      ),
      h("hr", { className: "cs-rule", "aria-hidden": true }),
      h(
        "section",
        { className: "cs-walkthrough-head" },
        h(
          SectionTag,
          {
            label: study.walkthroughLabel || "Screen walkthrough",
            wide: true,
          }
        ),
        study.walkthroughHeadline || study.walkthroughBody
          ? h(
              "div",
              { className: "cs-strategy__block" },
              study.walkthroughHeadline
                ? h("h2", { className: "cs-heading" }, study.walkthroughHeadline)
                : null,
              study.walkthroughBody
                ? h("p", { className: "cs-body" }, study.walkthroughBody)
                : null
            )
          : null
      ),
      ...study.flows.flatMap((flow, index) => {
        const section = h(FlowSection, { key: flow.id, flow, desktop });
        if (index === study.flows.length - 1) return [section];
        return [
          section,
          h("hr", { key: `${flow.id}-rule`, className: "cs-rule", "aria-hidden": true }),
        ];
      }),
      h(
        "section",
        { className: "cs-pair" },
        h(
          "div",
          { className: "cs-pair__col" },
          h(SectionTag, { label: "Key interaction states", wide: true }),
          h(
            "ul",
            { className: "cs-list" },
            ...study.interactions.map((item) => h("li", { key: item }, item))
          )
        ),
        h(
          "div",
          { className: "cs-pair__col" },
          h(SectionTag, { label: "Accessibility notes", wide: true }),
          h("p", { className: "cs-body" }, study.accessibility)
        )
      ),
      h(
        "section",
        { className: "cs-outcome" },
        h(
          "div",
          { className: "cs-outcome__inner" },
          h(
            "div",
            { className: "cs-outcome__tag" },
            h("span", null, "Final outcome / reflection")
          ),
          h("h2", { className: "cs-heading cs-heading--center" }, study.outcomeHeadline),
          h("p", { className: "cs-body cs-body--center" }, study.outcome)
        )
      )
    ),
    h(BackToHeroButton, { heroRef, reduceMotion: motionOff })
  );
}

function WorkflowCaseStudy({ study, reduceMotion }) {
  const prefersReduced = useReducedMotion();
  const motionOff = Boolean(reduceMotion ?? prefersReduced);
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const overviewLabel = study.overviewLabel || "Project Overview";
  const architectureLabel = study.architectureLabel || "Workflow Architecture";
  const workflowLabel = study.workflowLabel || "Workflow Overview";
  const rolesLabel = study.rolesLabel || "User Roles";

  useCaseStudyHeroEntrance({
    heroRef,
    pageRef,
    reduceMotion: motionOff,
    studySlug: study.slug,
  });

  useEffect(() => {
    if (!study.heroImage || typeof document === "undefined") return;
    const existing = document.querySelector(
      `link[rel="preload"][as="image"][href="${study.heroImage}"]`
    );
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = study.heroImage;
    link.fetchPriority = "high";
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [study.heroImage]);

  return h(
    "div",
    { ref: pageRef, className: "case-study cs-page" },
    h(
      "div",
      { className: "cs-page__inner" },
      h(
        "section",
        { ref: heroRef, className: "cs-hero" },
        h(
          "div",
          { className: "cs-hero__row" },
          h(
            "div",
            { className: "cs-hero__copy" },
            h(SectionTag, { label: study.eyebrow }),
            h(
              "div",
              { className: "cs-hero__text" },
              h("h1", { className: "cs-hero__title" }, study.title),
              study.tagline
                ? h("p", { className: "cs-hero__tagline" }, study.tagline)
                : null,
              h("p", { className: "cs-hero__intro" }, study.intro)
            ),
            h(
              "div",
              { className: "cs-hero__logo" },
              h("img", {
                src: study.heroLogo,
                alt: `${study.title} logo`,
                loading: "eager",
                decoding: "async",
              })
            )
          ),
          h(
            "div",
            { className: "cs-hero__thumb" },
            h("img", {
              src: study.heroImage,
              alt: `${study.title} workflow preview`,
              loading: "eager",
              decoding: "async",
              fetchPriority: "high",
            })
          )
        ),
        h(
          "div",
          { className: "cs-meta" },
          ...study.summary.map((item) =>
            h(
              "div",
              { key: item.label, className: "cs-meta__card" },
              h("p", { className: "cs-meta__label" }, item.label),
              h("p", { className: "cs-meta__value" }, item.value)
            )
          )
        )
      ),
      h("hr", { className: "cs-rule", "aria-hidden": true }),
      h(
        "section",
        { className: "cs-block" },
        h(SectionTag, { label: overviewLabel, wide: true }),
        h("p", { className: "cs-body" }, study.overview)
      ),
      h(
        "section",
        { className: "cs-strategy" },
        h(SectionTag, { label: architectureLabel, wide: true }),
        h(
          "div",
          { className: "cs-strategy__block" },
          h("h2", { className: "cs-heading" }, study.architectureHeadline),
          h("p", { className: "cs-body" }, study.architecture)
        )
      ),
      h(
        "section",
        { className: "cs-block" },
        h(SectionTag, { label: workflowLabel, wide: true }),
        h("p", { className: "cs-body" }, study.workflow)
      ),
      h("hr", { className: "cs-rule", "aria-hidden": true }),
      h(
        "figure",
        { className: "cs-workflow-diagram" },
        h("img", {
          src: study.workflowImage,
          alt: `${study.title} system workflow diagram`,
          loading: "lazy",
          decoding: "async",
        })
      ),
      h(
        "section",
        { className: "cs-block" },
        h(SectionTag, { label: rolesLabel, wide: true }),
        h(
          "div",
          { className: "cs-meta cs-meta--roles" },
          ...study.roles.map((item) =>
            h(
              "div",
              { key: item.label, className: "cs-meta__card" },
              h("p", { className: "cs-meta__label" }, item.label),
              h("p", { className: "cs-meta__value" }, item.value)
            )
          )
        )
      ),
      h(
        "section",
        { className: "cs-pair" },
        h(
          "div",
          { className: "cs-pair__col" },
          h(SectionTag, { label: "Key interaction states", wide: true }),
          h(
            "ul",
            { className: "cs-list" },
            ...study.interactions.map((item) => h("li", { key: item }, item))
          )
        ),
        h(
          "div",
          { className: "cs-pair__col" },
          h(SectionTag, { label: "Accessibility notes", wide: true }),
          h("p", { className: "cs-body" }, study.accessibility)
        )
      ),
      h(
        "section",
        { className: "cs-outcome" },
        h(
          "div",
          { className: "cs-outcome__inner" },
          h(
            "div",
            { className: "cs-outcome__tag" },
            h("span", null, "Final outcome / reflection")
          ),
          h("h2", { className: "cs-heading cs-heading--center" }, study.outcomeHeadline),
          h("p", { className: "cs-body cs-body--center" }, study.outcome)
        )
      )
    ),
    h(BackToHeroButton, { heroRef, reduceMotion: motionOff })
  );
}

function renderCaseStudyContent({ caseStudy, reduceMotion, onNavigateHome }) {
  if (caseStudy.layout === "docs") {
    return h(DocsCaseStudy, {
      study: caseStudy,
      reduceMotion,
      onNavigateHome,
    });
  }
  if (caseStudy.layout === "workflow") {
    return h(WorkflowCaseStudy, { study: caseStudy, reduceMotion });
  }

  return h(GenericCaseStudy, { study: caseStudy, reduceMotion });
}

export function CaseStudyPage({ caseStudy, reduceMotion, onNavigateHome }) {
  if (!caseStudy) return null;

  return h(
    Fragment,
    null,
    renderCaseStudyContent({ caseStudy, reduceMotion, onNavigateHome }),
    h(FooterSection, {
      onNavigate: onNavigateHome,
      reduceMotion,
    })
  );
}
