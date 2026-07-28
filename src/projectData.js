import { SHIPFLEX_CASE_STUDY } from "./shipflexCaseStudyData.js";
import { UNFLAPPABLE_CASE_STUDY } from "./unflappableCaseStudyData.js";
import { RENT_AI_CASE_STUDY } from "./rentAiCaseStudyData.js";
import { FLARE_CASE_STUDY } from "./flareCaseStudyData.js";
import { RALAMULI_CASE_STUDY } from "./ralamuliCaseStudyData.js";
import { AXIS_CASE_STUDY } from "./axisCaseStudyData.js";
import { KEEPUP_CASE_STUDY } from "./keepupCaseStudyData.js";

export const PROJECTS = [
  {
    slug: "shipflex",
    name: "ShipFlex",
    category: "Shipping Management Platform",
    platform: "Web Application",
    icon: "/assets/projects/first-project-icon.png",
    preview: "/assets/projects/project-thumbnails/shipflix-thumbnail.png",
    intro:
      "A B2B shipping platform that turns carrier selection, quoting, and fulfilment visibility into one calmer operational workflow.",
  },
  {
    slug: "unflappable",
    name: "Unflappable",
    category: "Wellbeing & Habit Tracking App",
    platform: "iOS Application",
    icon: "/assets/projects/project-thumbnails/unflappable-logo.png",
    preview: "/assets/projects/project-thumbnails/unflappable-thumbnail.png",
    intro:
      "A mobile product designed to help people reset under pressure, build steadier routines, and review progress without judgement.",
  },
  {
    slug: "rent-ai",
    name: "RentAI",
    category: "AI Property Management Platform",
    platform: "Web Application",
    icon: "/assets/projects/project-thumbnails/rent-ai-logo.png",
    preview: "/assets/projects/project-thumbnails/rent-ai-thumbnail.png",
    intro:
      "A property platform that brings rent collection, tenant visibility, and reconciliation into one operational dashboard.",
  },
  {
    slug: "flare",
    name: "Flare",
    category: "AI Communication Coaching App",
    platform: "iOS Application",
    icon: "/assets/projects/project-thumbnails/flare-logo.png",
    preview: "/assets/projects/project-thumbnails/flare-thumbnail.png",
    intro:
      "An AI coaching app that helps people practise conversations, build confidence, and grow through supportive feedback.",
  },
  {
    slug: "ralamuli",
    name: "Ralamuli Translator",
    category: "Language Learning & Translation App",
    platform: "iOS Application",
    icon: "/assets/projects/project-thumbnails/ralamuli-logo.png",
    preview: "/assets/projects/project-thumbnails/ralamuli-thumbnail.png",
    intro:
      "A translator and learning app that helps people move between English and Ralamuli with clearer practice and progress.",
  },
  {
    slug: "axis",
    name: "Axis Health",
    category: "Health & Wellness Platform",
    platform: "iOS Application",
    icon: "/assets/projects/project-thumbnails/axis-logo.png",
    preview: "/assets/projects/project-thumbnails/axis-thumbnail.png",
    intro:
      "A personalised health companion that brings nutrition, fitness, and vitals into one connected experience.",
  },
  {
    slug: "keepup",
    name: "KEEPUP",
    category: "Operational Workflow Design",
    platform: "System Architecture",
    icon: "/assets/projects/project-thumbnails/keepup-logo.png",
    preview: "/assets/projects/project-thumbnails/keepup-thumbnail.png",
    intro:
      "A workforce and operations platform that connects materials, tasks, workers, and supervisors in one clear project workflow.",
  },
  {
    slug: "athlete-connect",
    name: "Coming Soon",
    category: "We're putting the finishing touches — story on the way",
    platform: "Recruitment Platform",
    icon: "/assets/projects/project-thumbnails/athlete-connect-logo.png",
    preview: "/assets/projects/project-thumbnails/athlete-connect-thumbnail.png",
    previewVideo: "/assets/projects/project-thumbnails/athlete-connect-preview.mp4",
    previewVideoOnly: true,
    pending: true,
    intro:
      "A recruitment platform still coming together — the full case study and walkthrough will be here soon.",
  },
];

export const CASE_STUDIES = {
  shipflex: SHIPFLEX_CASE_STUDY,
  unflappable: UNFLAPPABLE_CASE_STUDY,
  "rent-ai": RENT_AI_CASE_STUDY,
  flare: FLARE_CASE_STUDY,
  ralamuli: RALAMULI_CASE_STUDY,
  axis: AXIS_CASE_STUDY,
  keepup: KEEPUP_CASE_STUDY,
  "athlete-connect": {
    slug: "athlete-connect",
    title: "Athlete Connect",
    layout: "workflow",
    eyebrow: "System Workflow",
    tagline:
      "Connecting student-athletes with coaches through one streamlined recruitment journey.",
    intro:
      "Athlete Connect is a recruitment platform designed to simplify how student-athletes and coaches discover each other, build meaningful profiles, and manage the recruitment process. Instead of relying on scattered emails, spreadsheets, and external tools, the platform brings profile creation, roster openings, applications, communication, and recruitment decisions into one connected workflow that supports both athletes and coaching staff.",
    heroImage: "/assets/projects/case-study/athlete-connect/figma/hero-thumbnail.png",
    heroLogo: "/assets/projects/case-study/athlete-connect/figma/logo.png",
    summary: [
      {
        label: "Project",
        value: "Athlete Recruitment & Matchmaking Platform",
      },
      {
        label: "Focus",
        value: "Workflow Architecture, User Journey Design & Recruitment Experience",
      },
      { label: "Role", value: "Product Designer" },
    ],
    overviewLabel: "Project Overview",
    overview:
      "The recruitment journey for student-athletes often involves multiple platforms, repeated information, and limited visibility into application progress. Coaches also spend significant time reviewing profiles, comparing athletes, and managing communication throughout the recruitment process. For this project, I focused on designing a connected workflow that brings both athlete and coach experiences together. From creating detailed profiles and defining preferences to reviewing applications, communicating, and making final recruitment decisions, every stage was structured to create a clearer, more transparent experience for everyone involved.",
    architectureLabel: "Workflow Architecture",
    architectureHeadline: "Designing one connected recruitment journey.",
    architecture:
      "The workflow was designed around two primary users: athletes looking for opportunities and coaches searching for the right players. Rather than creating separate experiences, both journeys remain connected throughout the recruitment lifecycle, ensuring applications, communication, and decisions stay synchronised from beginning to end.",
    workflowLabel: "Workflow Overview",
    workflow:
      "Athletes begin by creating their personal, academic, and athletic profiles before setting their recruitment preferences. Coaches create team profiles, define roster openings, and specify the type of athletes they are looking for. Once applications are submitted, coaches review profiles, communicate directly with athletes when needed, and make recruitment decisions. Every interaction remains connected, providing both parties with clear visibility throughout the recruitment process.",
    workflowImage:
      "/assets/projects/case-study/athlete-connect/figma/workflow-diagram.png",
    rolesLabel: "User Roles",
    roles: [
      {
        label: "Athlete",
        value:
          "Creates a complete profile, applies for roster openings, communicates with coaches, and manages recruitment opportunities.",
      },
      {
        label: "Coach",
        value:
          "Builds team profiles, publishes roster openings, reviews applicants, communicates with athletes, and manages recruitment decisions.",
      },
      {
        label: "Platform",
        value:
          "Matches athletes with suitable opportunities, manages application status, and keeps both users informed throughout the recruitment journey.",
      },
    ],
    interactions: [
      "Profile Created",
      "Profile Updated",
      "Application Submitted",
      "Coach Review",
      "Offer Sent",
      "Offer Accepted",
      "Offer Rejected",
      "Recruitment Completed",
    ],
    accessibility:
      "The workflow follows a clear step-by-step progression that helps athletes complete profile information without feeling overwhelmed while allowing coaches to review applicants efficiently. Information is grouped into logical stages, reducing complexity and making the recruitment process easier to understand for both user types.",
    outcomeHeadline:
      "Successful recruitment isn't just about finding the right player it's about creating a clear and connected journey for everyone involved.",
    outcome:
      "Designing Athlete Connect reinforced the importance of building experiences that serve both sides of a marketplace equally. By connecting athlete profiles, team requirements, applications, communication, and recruitment decisions into one continuous workflow, the platform creates a more transparent, efficient, and collaborative recruitment process for athletes and coaches alike.",
  },
};
