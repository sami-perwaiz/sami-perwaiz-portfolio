/** Axis Health case study — Figma 40004241:8415 docs template */
export const AXIS_CASE_STUDY = {
  slug: "axis",
  layout: "docs",
  title: "AxisHealth",
  eyebrow: "Case Study",
  tagline: "Empowering Health Management Through Intelligent, Personalized Experiences",
  intro: [
    "AxisHealth is a comprehensive mobile health platform designed to simplify personal wellness by bringing nutrition, fitness, supplementation, and health monitoring into a single experience. Built for individuals seeking a proactive approach to their well-being, the application helps users track progress, build healthy habits, and make informed decisions through personalized insights and intuitive tools.",
    "From onboarding to long-term health tracking, every interaction is designed around clarity, accessibility, and ease of use. The experience combines structured health assessments, intelligent workout generation, meal planning, supplement management, and vital monitoring within a clean, user-centered interface. By reducing complexity and surfacing the right information at the right time, AxisHealth transforms everyday health management into a guided, motivating, and sustainable journey.",
  ],
  meta: [
    { label: "Role", value: "UI/UX Designer" },
    { label: "Timeline", value: "7 Days" },
    { label: "Platform", value: "iPhone Mobile Application" },
    { label: "Industry", value: "Digital Healthcare & Wellness" },
    { label: "Team", value: "--------------" },
    { label: "Tools", value: "Figma, ChatGPT, Replit ai" },
  ],
  blocks: [
    {
      type: "overview",
      title: "Project Overview",
      paragraphs: [
        "Managing personal health often requires switching between multiple applications for nutrition, workouts, supplements, and health metrics. This fragmented experience makes it difficult for users to maintain consistency, understand their progress, and develop sustainable habits over time.",
        "AxisHealth was designed to solve this challenge by creating a unified health ecosystem where users can manage every aspect of their wellness from one intuitive platform. From personalized onboarding and meal planning to workout generation, peptide management, and long-term vital tracking, every feature works together to provide meaningful guidance throughout the user's health journey.",
        "As the UI/UX Designer, my goal was to create an experience that feels approachable regardless of a user's fitness knowledge. The interface prioritizes clarity, structured information architecture, and progressive disclosure, allowing users to focus on their goals without feeling overwhelmed by complex health data.",
      ],
    },
    {
      type: "approach",
      title: "Target Users",
      intro:
        "AxisHealth is designed for individuals who want a smarter and more organized approach to managing their health. The experience balances simplicity with powerful health insights, making it suitable for users at different stages of their wellness journey.",
      cards: [
        {
          title: "Health-Conscious Individuals",
          body: "Track nutrition, exercise, body metrics, and daily progress through a centralized dashboard that encourages healthier habits and long-term consistency.",
        },
        {
          title: "Fitness Enthusiasts",
          body: "Generate personalized workouts, monitor performance, manage calorie intake, and analyze progress using intelligent planning and performance tracking tools.",
        },
        {
          title: "Wellness & Peptide Therapy Users",
          body: "Manage supplement schedules, calculate accurate dosages, monitor treatment outcomes, and record side effects through a structured health management experience.",
        },
        {
          title: "Individuals Pursuing Long-Term Health Goals",
          body: "Visualize progress through comprehensive health analytics, vital tracking, progress photos, and AI-powered future goal visualization, creating motivation through measurable improvements.",
        },
      ],
    },
    {
      type: "feature",
      title: "Authentication & Health Profile Setup",
      paragraphs: [
        "The onboarding experience was designed to create a smooth transition into AxisHealth by combining account creation with personalized health profiling. Rather than overwhelming users with lengthy forms, the process is divided into clear, manageable steps that progressively collect essential information needed to personalize the user's wellness journey.",
        "Users begin by creating an account before providing key health details such as physical measurements, activity level, primary fitness goals, and nutritional targets. This structured approach reduces cognitive load while enabling the platform to generate tailored recommendations for workouts, meal plans, and overall health guidance from the very first session.",
        "The multi-step flow emphasizes clarity, accessibility, and user confidence through clean layouts, intuitive form controls, and clear progress indicators. By guiding users through each stage with focused interactions, the experience establishes a strong foundation for personalized health management while making the setup process feel simple, approachable, and efficient.",
      ],
      showcase: "onboarding-dual-1",
      extraShowcases: ["onboarding-dual-2"],
    },
    {
      type: "feature",
      title: "Dashboard Experience",
      paragraphs: [
        "The Dashboard serves as the central hub of AxisHealth, giving users a clear overview of their daily wellness goals from a single, easy-to-navigate screen. Instead of searching through multiple sections, users can instantly view calorie progress, exercise activity, scheduled tasks, meal plans, and recent health readings, helping them stay informed and focused throughout the day.",
        "The interface was designed with a strong visual hierarchy that highlights the most important health metrics first while keeping secondary information easily accessible. Circular progress indicators, organized content cards, and actionable reminders enable users to quickly understand their daily status and take the next appropriate action without feeling overwhelmed.",
        "By combining personalized insights, daily planning, and health tracking into one streamlined experience, the dashboard creates a motivating starting point for every session. The clean layout and intuitive navigation encourage users to build consistent wellness habits while making everyday health management feel simple, organized, and engaging.",
      ],
      showcase: "dashboard",
    },
    {
      type: "feature",
      title: "Calorie & Nutrition Tracking",
      paragraphs: [
        "The Calorie & Nutrition Tracking screen helps users stay on top of their daily nutritional goals through a simple and visually engaging interface. Instead of manually calculating progress, users can instantly view their remaining calorie allowance alongside a detailed breakdown of macronutrients, making it easier to understand how each meal contributes to their overall health objectives.",
        "The experience was designed around clarity and actionable insights. A prominent circular progress indicator provides an immediate overview of daily calorie consumption, while dedicated protein, carbohydrate, and fat trackers help users maintain a balanced nutritional intake. Organized information cards and intuitive editing actions ensure users can quickly update their meals without interrupting their daily routine.",
        "By transforming complex nutritional data into clear visual progress, the screen encourages healthier eating habits and consistent self-monitoring. The clean layout minimizes distractions while giving users the confidence to make informed dietary decisions that align with their personalized fitness and wellness goals.",
      ],
      showcase: "nutrition",
    },
    {
      type: "feature",
      title: "Exercise & Activity Tracking",
      paragraphs: [
        "The Exercise & Activity Tracking screen provides users with a comprehensive overview of their daily movement and fitness progress in one place. Designed to encourage consistency, the interface combines workout metrics, activity summaries, and personalized recommendations, allowing users to monitor their performance without navigating through multiple screens.",
        "A set of visual progress indicators highlights key metrics such as daily activity, weekly performance, and step goals, giving users an instant understanding of how close they are to achieving their targets. Weekly workout statistics, including completed sessions, exercise duration, and calories burned, offer meaningful insights into overall fitness progress while reinforcing positive habits.",
        "To create a more engaging workout experience, the screen also includes an integrated media player that enables users to listen to their preferred music or podcasts during exercise. A quick workout generator further simplifies planning by suggesting activities based on the user's available time, helping eliminate decision fatigue and making it easier to stay active every day.",
        "The clean information hierarchy, intuitive navigation, and motivating visual feedback transform fitness tracking into a seamless daily experience, empowering users to maintain healthy routines and achieve their long-term wellness goals.",
      ],
      showcase: "exercise",
    },
    {
      type: "feature",
      title: "Peptides & Treatment Management",
      paragraphs: [
        "The Peptides screen centralizes treatment planning by giving users a clear overview of their supplement and peptide routines. Instead of managing schedules through separate notes or reminders, the interface brings product information, dosage planning, and upcoming treatments together in a clean, easy-to-understand layout.",
        "The screen highlights featured wellness products while providing quick access to premium peptide resources, helping users explore recommended treatments without interrupting their routine. A dedicated schedule section allows users to organize dosage plans, monitor upcoming administrations, and easily update their treatment timeline whenever needed.",
        "To improve usability, empty states clearly communicate when no schedules have been created and guide users toward the next action, reducing confusion for first-time users. Simple editing controls and structured content hierarchy make it effortless to manage treatment plans while keeping the experience uncluttered and approachable.",
        "By combining product discovery, treatment scheduling, and medication management into a single interface, the screen delivers a streamlined experience that helps users stay organized, maintain consistency, and confidently manage their wellness journey.",
      ],
      showcase: "peptides",
    },
    {
      type: "feature",
      title: "Progress & Side Effects Tracking",
      paragraphs: [
        "The Progress & Side Effects Tracking screen enables users to monitor how their treatment is affecting their overall well-being over time. Instead of relying on memory, users can quickly record changes across key health indicators such as energy levels, sleep quality, mood, mental clarity, strength, and other treatment outcomes through a simple, structured interface.",
        "Each health metric can be marked as Improved, Unchanged, or Worsened, making it easy to identify trends and evaluate treatment effectiveness. Color-coded status indicators provide immediate visual feedback, allowing users to review their progress at a glance while creating meaningful records that can support future adjustments and healthcare discussions.",
        "The clean layout minimizes complexity by presenting information in an organized checklist format, encouraging users to consistently log their experiences without adding unnecessary effort. This approach transforms routine health tracking into a simple daily habit, helping users make informed decisions throughout their wellness journey.",
      ],
      showcase: "progress-side",
    },
    {
      type: "feature",
      title: "Vitals & Health Monitoring",
      paragraphs: [
        "The Vitals Tracking screen provides users with a centralized view of their long-term health progress by combining body metrics, visual progress tracking, and future goal planning in one intuitive interface. Rather than displaying isolated data points, the screen presents meaningful insights that help users understand how their health evolves over time.",
        "Users can maintain a visual record of their transformation through progress photos, log important health metrics, and review long-term trends to measure improvements consistently. A future goal visualization feature further enhances motivation by helping users define objectives and visualize their desired outcomes, making progress feel more tangible and achievable.",
        "Designed with clarity and accessibility in mind, the interface organizes health information into easy-to-understand sections while maintaining a clean visual hierarchy. By bringing together vitals, progress tracking, and goal management, the experience empowers users to stay engaged, monitor meaningful improvements, and make informed decisions throughout their health and wellness journey.",
      ],
      showcase: "vitals",
    },
    {
      type: "benefits",
      title: "Key Benefits",
      intro:
        "AxisHealth is designed to simplify every aspect of personal health management through one connected platform. By combining fitness tracking, nutrition management, peptide scheduling, vital monitoring, and AI-powered wellness insights, the application helps users build healthier habits, monitor progress, and make informed decisions with confidence.",
      cards: [
        {
          title: "Core Benefits",
          intro:
            "Every feature is built to help users take control of their health journey through clear insights, personalized tracking, and an intuitive user experience.",
          items: [
            {
              title: "Comprehensive Health Tracking",
              body: "Monitor daily activity, nutrition, exercise, peptide treatments, and vital health metrics from a single dashboard, eliminating the need for multiple health and fitness applications.",
            },
            {
              title: "Personalized Wellness Management",
              body: "Access intelligent progress insights, treatment schedules, and customized health recommendations that help users stay consistent and achieve their long-term wellness goals.",
            },
          ],
        },
        {
          title: "User Benefits",
          intro:
            "The experience is designed to make healthy living simple, measurable, and sustainable regardless of a user's fitness level or wellness objectives.",
          items: [
            {
              title: "Build Healthier Daily Habits",
              body: "Daily tracking, reminders, progress visualization, and guided wellness features encourage users to remain consistent with workouts, nutrition plans, medications, and healthy routines.",
            },
            {
              title: "Make Data-Driven Health Decisions",
              body: "Real-time analytics, treatment monitoring, body metrics, and historical progress provide users with the information they need to evaluate their performance, adjust their routines, and improve overall health with confidence.",
            },
          ],
        },
      ],
    },
    {
      type: "feature",
      title: "Consistent User Experience",
      paragraphs: [
        "Every screen in AxisHealth was designed around a unified design system to create a seamless and trustworthy healthcare experience. Consistent typography, color palettes, spacing, reusable components, and interaction patterns ensure users can navigate the application effortlessly while managing fitness, nutrition, treatments, and overall wellness.",
        "The interface prioritizes clarity and usability by maintaining predictable layouts and familiar UI patterns across every feature. From health dashboards and calorie tracking to peptide management, progress analytics, and vital monitoring, every interaction follows the same visual language to reduce cognitive load and improve confidence.",
        "Reusable design components including buttons, input fields, cards, charts, progress indicators, and feedback states create a cohesive experience that remains intuitive as users explore different sections of the platform. This consistency not only enhances usability but also allows the product to scale efficiently as new health features and AI-powered capabilities are introduced.",
        "By establishing a strong and flexible design foundation, AxisHealth delivers a premium, reliable, and user-centered experience that makes managing personal health simple, organized, and engaging from start to finish.",
      ],
      showcase: "design-dual",
    },
    { type: "showcase", variant: "design-forms" },
    { type: "showcase", variant: "design-palette" },
    { type: "showcase", variant: "design-buttons" },
    { type: "showcase", variant: "design-icons" },
    { type: "showcase", variant: "design-status" },
    {
      type: "closing",
      title: "Final Outcome",
      paragraphs: [
        "AxisHealth evolved into a comprehensive digital health platform that unifies fitness tracking, nutrition management, peptide therapy, vital monitoring, and wellness insights within a single intuitive experience. By bringing together personalized dashboards, progress analytics, treatment scheduling, and AI-assisted health guidance, the platform empowers users to make informed decisions, build healthier habits, and stay committed to their long-term wellness goals.",
        "Throughout the design process, the focus remained on creating an experience that feels simple, trustworthy, and motivating. Every interaction was carefully crafted to reduce complexity, present meaningful health data clearly, and support users with actionable insights, resulting in a product that balances powerful healthcare functionality with an accessible, user-centered interface.",
      ],
    },
    {
      type: "takeaways",
      title: "Key Design Takeaways",
      intro:
        "Designing AxisHealth reinforced the importance of creating healthcare experiences that simplify complex health data without overwhelming users. Every screen was designed to support informed decision-making through intuitive workflows, consistent interactions, and meaningful visual feedback that encourages long-term engagement.",
      lead: "The design process emphasized:",
      items: [
        "Designing intuitive healthcare experiences that simplify complex wellness management.",
        "Transforming health data into actionable insights through clear visual hierarchy.",
        "Building a scalable design system with reusable components and consistent interaction patterns.",
        "Creating engaging experiences that encourage healthy habits and long-term user retention.",
      ],
    },
    {
      type: "closing",
      title: "Looking Ahead",
      paragraphs: [
        "AxisHealth was designed with scalability at its core. The platform can expand to support AI-powered health coaching, wearable device integrations, remote patient monitoring, telemedicine services, advanced health analytics, and personalized preventive care while maintaining the same clean, accessible, and user-friendly experience.",
      ],
    },
    {
      type: "closing",
      title: "Final Note",
      paragraphs: [
        "AxisHealth reflects my approach to designing modern digital healthcare products that combine usability, accessibility, and intelligent technology. By focusing on user-centered design, scalable UI systems, and meaningful health experiences, the platform empowers users to take control of their wellness journey while providing a seamless experience that grows with their evolving healthcare needs.",
      ],
    },
  ],
  footer: "🎉 You've reached the end of this case study.",
};
