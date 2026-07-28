/** RentAI case study — Figma 40004105:19774 docs template */
export const RENT_AI_CASE_STUDY = {
  slug: "rent-ai",
  layout: "docs",
  title: "RentAI",
  eyebrow: "Case Study",
  tagline: "AI-Powered Rent Management Platform for Modern Property Managers",
  intro:
    "RentAI is an AI-powered web platform designed to simplify rent collection, tenant management, and payment reconciliation for landlords and property managers. By combining automated rent tracking, AI-assisted transaction matching, arrears management, and real-time financial insights into one centralized workspace, the platform helps users reduce manual work, improve payment visibility, and manage rental operations with greater confidence.",
  meta: [
    { label: "Role", value: "UI/UX Designer" },
    { label: "Timeline", value: "4 Days" },
    { label: "Platform", value: "Desktop Web Application" },
    { label: "Industry", value: "Property Management • Real Estate SaaS" },
    { label: "Team", value: "-------------" },
    { label: "Tools", value: "Figma, Gemini, Codex" },
  ],
  blocks: [
    {
      type: "overview",
      title: "Project Overview",
      paragraphs: [
        "Managing rental properties involves much more than collecting monthly payments. Property managers often need to monitor tenant payments, reconcile bank transactions, follow up on overdue rent, and maintain accurate financial records. When these tasks are handled manually across different systems, they become time-consuming, error-prone, and difficult to scale.",
        "RentAI was designed to simplify these operations by bringing rent collection, AI-powered transaction matching, tenant management, arrears tracking, and financial reporting into one centralized platform. The goal was to reduce administrative workload, improve payment visibility, and help property managers make faster, more informed decisions.",
        "As the UI/UX Designer, I focused on creating an intuitive dashboard that simplifies complex financial workflows while maintaining a clean and professional user experience. Every screen was designed to help users access critical information quickly, reduce unnecessary steps, and confidently manage rental operations.",
      ],
    },
    {
      type: "approach",
      title: "Design Approach",
      intro:
        "The design process centered around making financial management feel simple and approachable. Since users frequently interact with payment records, tenant information, and transaction reviews, the interface prioritizes clarity, logical organization, and efficient navigation. Each module follows a consistent structure that allows users to complete complex tasks with minimal effort while maintaining a seamless experience across the platform.",
      cards: [
        {
          title: "AI-Assisted Workflows",
          body: "Designed workflows that combine automation with user control, allowing AI to handle repetitive reconciliation tasks while keeping important financial decisions transparent and easy to review.",
        },
        {
          title: "Clear Information Architecture",
          body: "Structured the platform into intuitive modules for dashboards, tenants, transactions, arrears, referrals, and subscriptions, enabling users to locate information quickly and manage daily operations efficiently.",
        },
        {
          title: "Consistent User Interface",
          body: "Established a cohesive visual language using reusable layouts, tables, forms, cards, status indicators, and interactive elements to create a familiar experience throughout the application.",
        },
        {
          title: "Developer-Ready Design",
          body: "Prepared organized design files with clear interaction patterns, reusable components, and implementation-ready specifications to support a smooth development process and maintain design consistency.",
        },
      ],
    },
    {
      type: "feature",
      title: "Landing Page Experience",
      paragraphs: [
        "The RentAI landing page was designed to clearly communicate the platform's value from the very first interaction. Instead of overwhelming visitors with technical details, the homepage highlights how AI simplifies rent tracking, automates arrears detection, and streamlines property management through a clean, modern interface.",
        "The experience follows a clear content hierarchy, guiding users from the product's core benefits to its key features and frequently asked questions. Strong calls to action, concise messaging, and a professional visual style help build trust while encouraging property managers and landlords to explore the platform. The result is an engaging first impression that effectively introduces RentAI and supports user conversion.",
      ],
      showcase: "landing",
    },
    {
      type: "benefits",
      title: "Key Benefits",
      intro:
        "RentAI simplifies rent collection and financial management by combining AI-powered automation with an intuitive user experience. The platform helps property managers reduce manual effort, improve payment accuracy, and gain better visibility into rental operations through a centralized dashboard.",
      cards: [
        {
          title: "Business Benefits",
          intro:
            "Designed to help property managers streamline daily operations while improving financial oversight and reducing administrative workload.",
          items: [
            {
              title: "AI-Powered Payment Reconciliation",
              body: "Automatically matches incoming bank transactions with expected rent payments, minimizing manual reconciliation and improving payment accuracy.",
            },
            {
              title: "Smarter Arrears Management",
              body: "Detect overdue payments early with automated tracking, reminders, and actionable insights, helping property managers reduce outstanding balances more efficiently.",
            },
          ],
        },
        {
          title: "User Benefits",
          intro:
            "Built to simplify everyday financial workflows while making complex property management tasks easier to understand and complete.",
          items: [
            {
              title: "Centralized Property Dashboard",
              body: "Access tenant information, payment activity, transactions, and financial insights from one organized workspace without switching between multiple systems.",
            },
            {
              title: "Faster Decision Making",
              body: "Clear dashboards, AI-generated recommendations, and intuitive workflows enable users to review payments, identify issues, and take action with confidence.",
            },
          ],
        },
      ],
    },
    {
      type: "feature",
      title: "Getting Started Experience",
      paragraphs: [
        "The onboarding journey begins with a simple welcome screen that introduces RentAI and clearly communicates its purpose helping property managers automate rent tracking and detect arrears with AI. The minimal interface and focused call-to-action create an immediate understanding of the platform while guiding users naturally into the application.",
        "The sign-in experience follows the same design philosophy, keeping authentication straightforward and distraction-free. A clean form layout, strong visual contrast, and clear primary actions allow users to access the platform quickly and securely. Together, these screens establish a professional first impression while reinforcing the product's focus on simplicity, efficiency, and ease of use.",
      ],
      showcase: "getting-started-01",
      extraShowcases: ["getting-started-02"],
    },
    {
      type: "feature",
      title: "Dashboard Overview",
      paragraphs: [
        "The Dashboard serves as the central workspace for property managers, providing a real-time overview of rental income, payment collections, arrears, and tenant activity in one place. Instead of manually reviewing spreadsheets or switching between multiple systems, users can instantly monitor key financial metrics, track payment trends, and identify outstanding rent through a single, organized interface.",
        "Designed with a clear visual hierarchy, the dashboard prioritizes the most important insights while supporting deeper analysis through interactive charts and activity summaries. This enables users to monitor rental performance, review daily financial activity, and make informed decisions with greater speed and confidence.",
      ],
      showcase: "dashboard",
    },
    {
      type: "feature",
      title: "Referral & Partner Program",
      paragraphs: [
        "The Referral & Partner Program encourages organic growth by rewarding users for inviting new customers to the platform. Users can generate and share a unique referral link, monitor active referrals, and track commission earnings from a single, easy-to-manage workspace.",
        "The interface provides complete visibility into referral progress, subscription status, and recurring commissions through a clean dashboard. By presenting referral activity, earnings, and partner performance in one place, the experience makes it simple for users to measure the impact of their network and maximize the value of every successful referral.",
      ],
      showcase: "referrals",
    },
    {
      type: "feature",
      title: "AI-Powered Reconciliation",
      paragraphs: [
        "The reconciliation workspace uses AI to automatically match incoming bank transactions with expected rent payments, significantly reducing manual review and payment verification. Instead of comparing records one by one, property managers receive intelligent match suggestions with confidence scores, making reconciliation faster and more reliable.",
        "The interface clearly separates expected payments, AI-generated matches, and bank transactions into organized sections, allowing users to review, approve, or reject recommendations with confidence. This streamlined workflow minimizes errors, speeds up financial reconciliation, and helps maintain accurate payment records across the platform.",
      ],
      showcase: "reconciliation",
    },
    {
      type: "feature",
      title: "Tenant Management",
      paragraphs: [
        "The Tenant Management module provides a centralized view of all tenants, their assigned properties, rent amounts, payment status, and recent payment activity. With search and quick access to tenant details, property managers can efficiently monitor occupancy, identify overdue payments, and manage tenant records without navigating through multiple screens.",
        "The clean table layout prioritizes readability and status visibility, making it easy to distinguish between paid, unpaid, and partial payments at a glance. This streamlined interface helps reduce administrative effort, improves record management, and enables faster decision-making for day-to-day property operations.",
      ],
      showcase: "tenants",
    },
    {
      type: "feature",
      title: "Subscription & Billing",
      paragraphs: [
        "The Subscription & Billing section gives property managers a clear overview of available pricing plans, active referral discounts, and account upgrade options in one place. Users can compare features across plans, understand what each tier offers, and upgrade their subscription as their portfolio grows.",
        "The layout is designed to make plan selection simple by presenting pricing, feature comparisons, and subscription actions in a structured format. This approach reduces decision-making friction, improves transparency, and creates a seamless upgrade experience while supporting the evolving needs of landlords and property management businesses.",
      ],
      showcase: "billing",
    },
    {
      type: "closing",
      title: "Final Outcome",
      paragraphs: [
        "RentAI transformed the rent collection process into a smarter, AI-powered platform that helps landlords and property managers monitor payments, detect arrears early, and reconcile transactions with minimal manual effort. By combining automated rent tracking, intelligent matching, tenant management, and financial insights in a single dashboard, the platform streamlines day-to-day operations while improving accuracy and visibility.",
        "Throughout the project, the focus remained on creating a modern interface that simplifies complex property management workflows without overwhelming users. Clear navigation, consistent interaction patterns, and AI-assisted experiences make the platform efficient, scalable, and easy to use as property portfolios continue to grow.",
      ],
    },
    {
      type: "takeaways",
      title: "Key Design Takeaways",
      intro:
        "This project emphasized designing AI-powered workflows that simplify financial management while maintaining a clean and intuitive user experience. Every feature was built to reduce manual effort and help users make faster, more confident decisions.",
      lead: "The design focused on:",
      items: [
        "Designing AI-assisted workflows that automate repetitive rent management tasks.",
        "Making financial data and payment status easy to understand at a glance.",
        "Creating a consistent interface across dashboards, tenant management, and reconciliation.",
        "Balancing automation with user control to build trust in AI-generated recommendations.",
      ],
    },
    {
      type: "closing",
      title: "Looking Ahead",
      paragraphs: [
        "RentAI has a strong foundation that can easily evolve with future enhancements such as predictive payment analytics, automated tenant communication, deeper accounting integrations, and more advanced AI capabilities. The scalable design ensures new features can be introduced without disrupting the overall user experience.",
      ],
    },
    {
      type: "closing",
      title: "Final Note",
      paragraphs: [
        "RentAI reflects my approach to designing modern AI-powered SaaS products that solve real business challenges through thoughtful UX, clear information architecture, and intuitive interfaces. The result is a product that simplifies rent management, improves operational efficiency, and delivers a seamless experience for property managers and landlords.",
      ],
    },
  ],
  footer: "🎉 You've reached the end of this case study.",
};
