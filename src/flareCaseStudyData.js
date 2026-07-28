/** Flare case study — Figma 40004113:20010 docs template */
export const FLARE_CASE_STUDY = {
  slug: "flare",
  layout: "docs",
  title: "Flare",
  eyebrow: "Case Study",
  tagline: "Smarter Conversations. Stronger Connections.",
  intro:
    "Flare is an AI-powered communication coach designed for iPhone users who want to improve the way they communicate. Through personalized guidance, conversation practice, and actionable feedback, the app helps users build confidence, express themselves more clearly, and develop stronger relationships in both personal and professional settings.",
  meta: [
    { label: "Role", value: "UI/UX Designer" },
    { label: "Timeline", value: "10 Days" },
    { label: "Platform", value: "iPhone Mobile Application" },
    { label: "Industry", value: "AI Communication & Personal Development" },
    { label: "Team", value: "--------------" },
    { label: "Tools", value: "Figma, Lovable, Gemini AI" },
  ],
  blocks: [
    {
      type: "overview",
      title: "Project Overview",
      paragraphs: [
        "Effective communication is one of the most valuable personal and professional skills, yet many people struggle with expressing themselves clearly, handling difficult conversations, and building confidence in social interactions. Existing communication apps often provide generic advice instead of practical, personalized guidance that users can apply in real situations.",
        "Flare was designed to bridge that gap by combining AI-powered conversation coaching with actionable feedback. The app helps users practice communication, improve clarity, strengthen confidence, and develop healthier conversation habits through an intuitive and engaging mobile experience.",
        "As the UI/UX Designer, my focus was on creating an interface that felt approachable, distraction-free, and easy to navigate. Every interaction was designed to make learning feel natural while encouraging users to return regularly and build lasting communication habits.",
      ],
    },
    {
      type: "approach",
      title: "Design Philosophy",
      intro:
        "The design philosophy centered on making communication coaching feel simple, supportive, and approachable. Instead of overwhelming users with complex dashboards or unnecessary features, every screen was crafted to guide users through a focused learning journey with clear actions and meaningful feedback.",
      cards: [
        {
          title: "Human-Centered Experience",
          body: "Designed user flows that make communication coaching approachable, helping users build confidence through simple, guided interactions.",
        },
        {
          title: "Intuitive Navigation",
          body: "Structured the information architecture to ensure users can effortlessly move between coaching sessions, conversation history, progress tracking, and profile settings.",
        },
        {
          title: "Engaging Visual Experience",
          body: "Created a clean, modern interface with consistent typography, spacing, and visual hierarchy that keeps users focused while maintaining an enjoyable experience.",
        },
        {
          title: "AI-Driven Interaction",
          body: "Designed experiences that seamlessly integrate AI-generated insights and conversation guidance, making personalized coaching feel natural and easy to use.",
        },
      ],
    },
    {
      type: "feature",
      title: "Splash Screen",
      paragraphs: [
        "The splash screen creates the first impression of Flare by introducing the brand with a clean and distraction-free experience. A minimalist layout keeps the focus on the product identity while the application loads, ensuring users transition smoothly into the app without unnecessary interruptions.",
        "The simple visual approach establishes a modern and approachable personality from the very first interaction. By emphasizing the Flare brand through bold typography and generous white space, the splash screen delivers a polished start that feels fast, professional, and welcoming.",
      ],
      showcase: "splash",
    },
    {
      type: "feature",
      title: "Getting Started",
      paragraphs: [
        "The onboarding experience introduces users to Flare through a series of simple, engaging screens that communicate the app's purpose before they begin. Rather than presenting lengthy explanations, each screen highlights a core value of the product with clear messaging and friendly illustrations, helping users quickly understand what Flare offers.",
        "The visual storytelling creates a welcoming first impression while setting the tone for the experience ahead. Soft illustrations, minimal layouts, and concise copy make the onboarding feel approachable and enjoyable, allowing users to build confidence in the product before entering the app.",
        "The journey concludes with a clear call to action, encouraging users to get started and smoothly transition into the main experience. This lightweight onboarding keeps the process quick while establishing the personality and value of the Flare brand from the very beginning.",
      ],
      showcase: "onboarding-dual",
      extraShowcases: ["onboarding-single"],
    },
    {
      type: "feature",
      title: "Authentication Experience",
      paragraphs: [
        "The authentication flow was designed to provide users with a quick and seamless way to access Flare. The login and sign-up screens follow a clean, minimal layout that reduces distractions while making account creation and sign-in simple and intuitive.",
        "The forms use clear labels, familiar input patterns, and straightforward actions to minimize friction for first-time and returning users. A visual hierarchy, generous spacing, and prominent call-to-action buttons help users complete the process with confidence, creating a smooth transition into the core experience.",
        "By keeping the interface lightweight and approachable, the authentication flow establishes trust from the very beginning while maintaining a consistent design language throughout the application.",
      ],
      showcase: "auth-dual",
    },
    {
      type: "feature",
      title: "Home Screen",
      paragraphs: [
        "The home screen serves as the starting point for every coaching session, allowing users to quickly choose the communication style they want to develop. Rather than navigating through multiple menus, users can select traits such as Confident, Calm, Friendly, or Assertive and begin a personalized session with a single tap.",
        "The interface is designed around simplicity and exploration. A clean grid layout, color-coded personality cards, and a prominent call-to-action make it easy to browse different communication styles without feeling overwhelmed. Each option represents a unique coaching path, helping users focus on the skills that matter most to their personal or professional conversations.",
        "By combining an intuitive layout with clear visual hierarchy, the home screen creates an engaging starting experience that encourages users to return regularly and practice building stronger communication habits.",
      ],
      showcase: "home",
      extraShowcases: ["home-detail"],
    },
    {
      type: "feature",
      title: "AI Coaching Session",
      paragraphs: [
        "The AI coaching session is the core experience of Flare, guiding users through real-time conversation practice in a supportive and distraction-free environment. As users speak naturally, the app captures their responses through live transcription, creating an interactive coaching experience that feels more like a conversation than a traditional exercise.",
        "The interface keeps users focused by presenting only the information they need during the session. Clear visual hierarchy, live feedback, and a simple recording flow reduce distractions, allowing users to concentrate on expressing themselves with confidence.",
        "At the end of each session, users receive a completion screen that celebrates their progress and encourages continued practice. This positive reinforcement helps build consistency while making every coaching session feel rewarding and motivating.",
      ],
      showcase: "coaching-session",
      extraShowcases: ["coaching-complete"],
    },
    {
      type: "feature",
      title: "Session History & Management",
      paragraphs: [
        "Every coaching session is saved in a dedicated history, giving users a simple way to revisit their past conversations and reflect on their personal growth over time. Instead of treating each interaction as temporary, Flare builds a timeline of completed sessions that users can review whenever they need encouragement or perspective.",
        "The history interface is designed for quick access and effortless management. Users can open previous sessions, start a new coaching session directly from the history screen, or remove entries they no longer wish to keep. Clear confirmation dialogs help prevent accidental deletions while maintaining complete control over personal session data. This thoughtful approach encourages continuous self-improvement while keeping the experience organized, private, and easy to manage.",
      ],
      showcase: "history",
      extraShowcases: ["history-delete"],
    },
    {
      type: "feature",
      title: "AI Session Insights",
      paragraphs: [
        "After each completed coaching session, Flare generates a personalized summary that helps users understand how they performed during the conversation. Instead of ending the session without feedback, the app highlights key moments, confidence levels, communication patterns, and practical suggestions that users can apply in future interactions.",
        "The insights are presented in a clean, easy-to-read layout that encourages reflection without overwhelming the user. Users can review their emotional timeline, explore AI-generated feedback, save the report for future reference, or share their progress with others. By turning every session into a learning opportunity, Flare helps users build confidence, recognize improvement, and develop stronger communication habits over time.",
      ],
      showcase: "insights",
    },
    {
      type: "feature",
      title: "Profile & Preferences",
      paragraphs: [
        "The profile section gives users a single place to manage their personal information, notification preferences, and application settings. Instead of scattering account options across multiple screens, Flare brings essential controls together in a clean, distraction-free interface that is quick to navigate and easy to understand.",
        "Users can view and update their profile details, customize reminder preferences, and manage advanced features based on how they use the app. A simple visual summary also provides a snapshot of recent emotional trends, helping users stay aware of their overall well-being while maintaining full control over their experience. The streamlined layout ensures account management feels effortless, consistent, and aligned with Flare's calm, user-focused design philosophy.",
      ],
      showcase: "profile",
    },
    {
      type: "benefits",
      title: "Key Benefits",
      intro:
        "Flare is designed to help users build stronger communication skills through structured AI coaching and real-time feedback. By combining guided speaking sessions, personalized insights, session history, and performance analysis, the app creates a continuous learning experience that supports confidence, self-awareness, and long-term personal growth.",
      cards: [
        {
          title: "Core Benefits",
          intro:
            "Every feature is focused on helping users communicate with greater confidence while making practice sessions engaging, insightful, and easy to revisit.",
          items: [
            {
              title: "Stay Focused on What Matters",
              body: "Practice real-world conversations in a guided environment with live AI coaching, helping users improve confidence and communication skills through consistent repetition.",
            },
            {
              title: "Personalized Session Feedback",
              body: "Receive detailed AI-generated insights after every session, including communication strengths, improvement opportunities, and actionable recommendations for future practice.",
            },
          ],
        },
        {
          title: "User Benefits",
          intro:
            "The experience is designed to make communication practice approachable, measurable, and motivating for users at every skill level.",
          items: [
            {
              title: "Track Personal Growth",
              body: "Review previous coaching sessions, monitor improvements over time, and gain a clear understanding of communication progress through organized session history and insights.",
            },
            {
              title: "Build Confidence Through Consistency",
              body: "Regular guided practice, thoughtful feedback, and easy access to past sessions encourage users to develop lasting confidence and stronger everyday communication habits.",
            },
          ],
        },
      ],
    },
    {
      type: "feature",
      title: "Consistent User Experience",
      paragraphs: [
        "Every interface element in Flare was designed to create a cohesive and distraction-free experience. Typography, colors, buttons, form fields, interactive controls, and reusable UI patterns follow a unified visual language that makes the application feel familiar and intuitive across every screen.",
        "Consistency extends beyond aesthetics to improve usability. Whether users are updating account settings, completing coaching sessions, reviewing AI insights, or managing preferences, familiar components reduce cognitive load and create predictable interactions. This unified design approach helps users stay focused on their communication goals while ensuring the product remains scalable, maintainable, and easy to navigate as new features are introduced.",
      ],
      showcase: "design-dual",
    },
    { type: "showcase", variant: "design-forms" },
    { type: "showcase", variant: "design-buttons" },
    { type: "showcase", variant: "design-toggles" },
    { type: "showcase", variant: "design-icons" },
    { type: "showcase", variant: "design-premium" },
    {
      type: "note",
      text: "Maintaining a consistent design language and reusable interface patterns ensures a seamless user experience while supporting future product scalability and feature expansion.",
    },
    {
      type: "closing",
      title: "Final Outcome",
      paragraphs: [
        "Flare evolved into an AI-powered communication coaching platform that transforms everyday conversations into opportunities for personal growth. By combining guided speaking sessions, real-time AI transcription, personalized feedback, session history, and actionable insights, the product helps users build confidence, improve communication skills, and measure their progress over time.",
        "Throughout the design process, the focus remained on creating an experience that feels approachable, supportive, and easy to navigate. Every interaction was designed to reduce friction, encourage consistent practice, and deliver meaningful feedback without overwhelming the user, resulting in a product that balances intelligent AI capabilities with a simple and intuitive user experience.",
      ],
    },
    {
      type: "takeaways",
      title: "Key Design Takeaways",
      intro:
        "Designing Flare reinforced the importance of combining artificial intelligence with thoughtful user experience. Every screen was crafted to make communication practice feel natural, encouraging users to learn through guidance, reflection, and continuous improvement.",
      lead: "The design process emphasized:",
      items: [
        "Creating intuitive AI-assisted coaching experiences.",
        "Simplifying complex communication feedback into actionable insights.",
        "Building consistent and accessible interaction patterns across the application.",
        "Designing experiences that encourage confidence through regular practice.",
      ],
    },
    {
      type: "closing",
      title: "Looking Ahead",
      paragraphs: [
        "Flare is designed with scalability in mind. The platform can expand with advanced AI coaching, personalized learning paths, voice analytics, conversation simulations, and deeper performance insights while maintaining the same clean, user-centered experience that supports continuous learning.",
      ],
    },
    {
      type: "closing",
      title: "Final Note",
      paragraphs: [
        "Flare reflects my approach to designing AI-powered digital products that combine intelligent technology with human-centered design. By focusing on clarity, usability, and meaningful interactions, the product transforms communication practice into an engaging experience that helps users build confidence, improve speaking skills, and grow through consistent feedback.",
      ],
    },
  ],
  footer: "🎉 You've reached the end of this case study.",
};
