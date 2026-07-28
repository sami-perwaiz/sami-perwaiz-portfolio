import { createElement as h } from "react";
import { useParams } from "react-router-dom";
import { CaseStudyPage } from "../CaseStudyPage.js";
import { CASE_STUDIES } from "../projectData.js";
import { NotFound } from "./NotFound.jsx";

/**
 * Dynamic case study route — /projects/:slug
 */
export function CaseStudy({ reduceMotion, onNavigateHome }) {
  const { slug: rawSlug = "" } = useParams();
  const slug = decodeURIComponent(rawSlug).replace(/\/+$/, "");
  const caseStudy = slug && CASE_STUDIES[slug] ? CASE_STUDIES[slug] : null;

  if (!caseStudy) {
    return h(NotFound, { onNavigate: onNavigateHome });
  }

  return h(CaseStudyPage, {
    key: `case-${caseStudy.slug}`,
    caseStudy,
    reduceMotion,
    onNavigateHome,
  });
}
