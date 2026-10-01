import { useEffect, type ReactNode } from "react";
import "./flare-case-study.css";
import CaseStudyHomeTail from "./CaseStudyHomeTail";

const asset = (name: string) => `/assets/flare-case-study/${name}`;

const images = {
  splash: asset("flare-20106.png"), onboardingLeft: asset("flare-20111.png"), onboardingRight: asset("flare-20112.png"),
  onboardingFinal: asset("flare-20114.png"), authLeft: asset("flare-20119.png"), authRight: asset("flare-20120.png"),
  home: asset("flare-20125.png"), homeGrid: asset("flare-20127.png"), coaching: asset("flare-20132.png"),
  completion: asset("flare-20134.png"), history: asset("flare-20139.png"), deleteDialog: asset("flare-20141.png"),
  insights: asset("flare-20146.png"), profile: asset("flare-20151.png"), systemType: asset("flare-20195.png"),
  systemColor: asset("flare-20196.png"), fields: asset("flare-20198.png"), buttons: asset("flare-20200.png"),
  toggles: asset("flare-20202.png"), cards: asset("flare-20204.png"),
} as const;

const metadata = [
  ["Role", "UI/UX Designer"], ["Timeline", "10 Days"], ["Platform", "iPhone Mobile Application"],
  ["Industry", "AI Communication & Personal Development"], ["Team", "--------------"], ["Tools", "Figma, Lovable, Gemini AI"],
] as const;

const principles = [
  ["Human-Centered Experience", "Designed user flows that make communication coaching approachable, helping users build confidence through simple, guided interactions."],
  ["Intuitive Navigation", "Structured the information architecture to ensure users can effortlessly move between coaching sessions, conversation history, progress tracking, and profile settings."],
  ["Engaging Visual Experience", "Created a clean, modern interface with consistent typography, spacing, and visual hierarchy that keeps users focused while maintaining an enjoyable experience."],
  ["AI-Driven Interaction", "Designed experiences that seamlessly integrate AI-generated insights and conversation guidance, making personalized coaching feel natural and easy to use."],
] as const;

function TextSection({ title, large = false, children }: { title: string; large?: boolean; children: ReactNode }) {
  return <section className={`flare-text-section${large ? " flare-text-section--large" : ""}`}><h2>{title}</h2><div className="flare-text-body">{children}</div></section>;
}

function ImageFrame({ className, children }: { className: string; children: ReactNode }) {
  return <figure className={`flare-visual ${className}`}>{children}</figure>;
}

function SourceImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img className={className} src={src} alt={alt} loading="lazy" decoding="async" />;
}

function BenefitCard({ title, intro, items }: { title: string; intro: string; items: ReadonlyArray<readonly [string, string]> }) {
  return <section className="flare-benefit-card"><header><h3>{title}</h3><p>{intro}</p></header>{items.map(([heading, copy]) => <article key={heading}><h4>{heading}</h4><p>{copy}</p></article>)}</section>;
}

export default function FlareCaseStudy() {
  useEffect(() => {
    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    const previousViewport = viewport?.content;
    const previousTitle = document.title;
    if (viewport) viewport.content = "width=device-width, initial-scale=1";
    document.title = "Flare Case Study — Sami Perwaiz";
    window.scrollTo(0, 0);
    return () => {
      if (viewport && previousViewport) viewport.content = previousViewport;
      document.title = previousTitle;
    };
  }, []);

  const returnToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return <div className="flare-case flare-case--home-tail" id="top">
    <header className="flare-case-navbar">
      <img className="flare-navbar-bg" src={asset("navbar-bg.png")} alt="" aria-hidden="true" />
      <a className="flare-navbar-back" href="/#projects"><img src={asset("back-arrow.svg")} alt="" aria-hidden="true" /><span>Back to Projects</span></a>
      <a className="flare-navbar-hello" href="mailto:samiperwaiz@gmail.com">Say Hello</a>
    </header>

    <main className="flare-case-container flare-case-container--with-home-tail">
      <section className="flare-case-hero">
        <div className="flare-hero-title-row"><div className="flare-hero-inner flare-hero-title"><span>Case Study</span><h1>Flare</h1></div></div>
        <div className="flare-hero-description-row"><div className="flare-hero-inner flare-hero-description"><h2>Smarter Conversations. Stronger Connections.</h2><p>Flare is an AI-powered communication coach designed for iPhone users who want to improve the way they communicate. Through personalized guidance, conversation practice, and actionable feedback, the app helps users build confidence, express themselves more clearly, and develop stronger relationships in both personal and professional settings.</p></div></div>
      </section>

      <section className="flare-article-shell"><div className="flare-article">
        <section className="flare-metadata" aria-label="Project details">{metadata.map(([label, value]) => <article key={label}><h2>{label}</h2><p>{value}</p></article>)}</section>

        <TextSection title="Project Overview" large>
          <p>Effective communication is one of the most valuable personal and professional skills, yet many people struggle with expressing themselves clearly, handling difficult conversations, and building confidence in social interactions. Existing communication apps often provide generic advice instead of practical, personalized guidance that users can apply in real situations.</p>
          <p>Flare was designed to bridge that gap by combining AI-powered conversation coaching with actionable feedback. The app helps users practice communication, improve clarity, strengthen confidence, and develop healthier conversation habits through an intuitive and engaging mobile experience.</p>
          <p>As the UI/UX Designer, my focus was on creating an interface that felt approachable, distraction-free, and easy to navigate. Every interaction was designed to make learning feel natural while encouraging users to return regularly and build lasting communication habits.</p>
        </TextSection>

        <section className="flare-philosophy"><TextSection title="Design Philosophy"><p>The design philosophy centered on making communication coaching feel simple, supportive, and approachable. Instead of overwhelming users with complex dashboards or unnecessary features, every screen was crafted to guide users through a focused learning journey with clear actions and meaningful feedback.</p></TextSection><div className="flare-principles">{principles.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

        <TextSection title="Splash Screen"><p>The splash screen creates the first impression of Flare by introducing the brand with a clean and distraction-free experience. A minimalist layout keeps the focus on the product identity while the application loads, ensuring users transition smoothly into the app without unnecessary interruptions.</p><p>The simple visual approach establishes a modern and approachable personality from the very first interaction. By emphasizing the Flare brand through bold typography and generous white space, the splash screen delivers a polished start that feels fast, professional, and welcoming.</p></TextSection>
        <ImageFrame className="flare-visual--single"><SourceImage src={images.splash} alt="Flare splash screen" /></ImageFrame>

        <TextSection title="Getting Started"><p>The onboarding experience introduces users to Flare through a series of simple, engaging screens that communicate the app's purpose before they begin. Rather than presenting lengthy explanations, each screen highlights a core value of the product with clear messaging and friendly illustrations, helping users quickly understand what Flare offers.</p><p>The visual storytelling creates a welcoming first impression while setting the tone for the experience ahead. Soft illustrations, minimal layouts, and concise copy make the onboarding feel approachable and enjoyable, allowing users to build confidence in the product before entering the app.</p><p>The journey concludes with a clear call to action, encouraging users to get started and smoothly transition into the main experience. This lightweight onboarding keeps the process quick while establishing the personality and value of the Flare brand from the very beginning.</p></TextSection>
        <ImageFrame className="flare-visual--pair"><SourceImage className="flare-pair-left" src={images.onboardingLeft} alt="Flare onboarding screen: Breathe In, Feel Better" /><SourceImage className="flare-pair-right" src={images.onboardingRight} alt="Flare onboarding screen: Small Moments, Big Impact" /></ImageFrame>
        <ImageFrame className="flare-visual--single"><SourceImage src={images.onboardingFinal} alt="Flare onboarding screen: Built for Real You" /></ImageFrame>

        <TextSection title="Authentication Experience"><p>The authentication flow was designed to provide users with a quick and seamless way to access Flare. The login and sign-up screens follow a clean, minimal layout that reduces distractions while making account creation and sign-in simple and intuitive.</p><p>The forms use clear labels, familiar input patterns, and straightforward actions to minimize friction for first-time and returning users. A visual hierarchy, generous spacing, and prominent call-to-action buttons help users complete the process with confidence, creating a smooth transition into the core experience.</p><p>By keeping the interface lightweight and approachable, the authentication flow establishes trust from the very beginning while maintaining a consistent design language throughout the application.</p></TextSection>
        <ImageFrame className="flare-visual--pair"><SourceImage className="flare-pair-left" src={images.authLeft} alt="Flare login screen" /><SourceImage className="flare-pair-right" src={images.authRight} alt="Flare sign-up screen" /></ImageFrame>

        <TextSection title="Home Screen"><p>The home screen serves as the starting point for every coaching session, allowing users to quickly choose the communication style they want to develop. Rather than navigating through multiple menus, users can select traits such as Confident, Calm, Friendly, or Assertive and begin a personalized session with a single tap.</p><p>The interface is designed around simplicity and exploration. A clean grid layout, color-coded personality cards, and a prominent call-to-action make it easy to browse different communication styles without feeling overwhelmed. Each option represents a unique coaching path, helping users focus on the skills that matter most to their personal or professional conversations.</p><p>By combining an intuitive layout with clear visual hierarchy, the home screen creates an engaging starting experience that encourages users to return regularly and practice building stronger communication habits.</p></TextSection>
        <ImageFrame className="flare-visual--single"><SourceImage src={images.home} alt="Flare home screen" /></ImageFrame>
        <ImageFrame className="flare-visual--tall"><SourceImage src={images.homeGrid} alt="Flare communication style cards" /></ImageFrame>

        <TextSection title="AI Coaching Session"><p>The AI coaching session is the core experience of Flare, guiding users through real-time conversation practice in a supportive and distraction-free environment. As users speak naturally, the app captures their responses through live transcription, creating an interactive coaching experience that feels more like a conversation than a traditional exercise.</p><p>The interface keeps users focused by presenting only the information they need during the session. Clear visual hierarchy, live feedback, and a simple recording flow reduce distractions, allowing users to concentrate on expressing themselves with confidence.</p><p>At the end of each session, users receive a completion screen that celebrates their progress and encourages continued practice. This positive reinforcement helps build consistency while making every coaching session feel rewarding and motivating.</p></TextSection>
        <ImageFrame className="flare-visual--single"><SourceImage src={images.coaching} alt="Flare live AI coaching session" /></ImageFrame>
        <ImageFrame className="flare-visual--dialog"><SourceImage src={images.completion} alt="Flare session complete dialog" /></ImageFrame>

        <TextSection title="Session History & Management"><p>Every coaching session is saved in a dedicated history, giving users a simple way to revisit their past conversations and reflect on their personal growth over time. Instead of treating each interaction as temporary, Flare builds a timeline of completed sessions that users can review whenever they need encouragement or perspective.</p><p>The history interface is designed for quick access and effortless management. Users can open previous sessions, start a new coaching session directly from the history screen, or remove entries they no longer wish to keep. Clear confirmation dialogs help prevent accidental deletions while maintaining complete control over personal session data. This thoughtful approach encourages continuous self-improvement while keeping the experience organized, private, and easy to manage.</p></TextSection>
        <ImageFrame className="flare-visual--single"><SourceImage src={images.history} alt="Flare session history screen" /></ImageFrame>
        <ImageFrame className="flare-visual--dialog"><SourceImage src={images.deleteDialog} alt="Flare remove session confirmation dialog" /></ImageFrame>

        <TextSection title="AI Session Insights"><p>After each completed coaching session, Flare generates a personalized summary that helps users understand how they performed during the conversation. Instead of ending the session without feedback, the app highlights key moments, confidence levels, communication patterns, and practical suggestions that users can apply in future interactions.</p><p>The insights are presented in a clean, easy-to-read layout that encourages reflection without overwhelming the user. Users can review their emotional timeline, explore AI-generated feedback, save the report for future reference, or share their progress with others.</p><p>By turning every session into a learning opportunity, Flare helps users build confidence, recognize improvement, and develop stronger communication habits over time.</p></TextSection>
        <ImageFrame className="flare-visual--single"><SourceImage src={images.insights} alt="Flare AI session insights screen" /></ImageFrame>

        <TextSection title="Profile & Preferences"><p>The profile section gives users a single place to manage their personal information, notification preferences, and application settings. Instead of scattering account options across multiple screens, Flare brings essential controls together in a clean, distraction-free interface that is quick to navigate and easy to understand.</p><p>Users can view and update their profile details, customize reminder preferences, and manage advanced features based on how they use the app. A simple visual summary also provides a snapshot of recent emotional trends, helping users stay aware of their overall well-being while maintaining full control over their experience. The streamlined layout ensures account management feels effortless, consistent, and aligned with Flare's calm, user-focused design philosophy.</p></TextSection>
        <ImageFrame className="flare-visual--single"><SourceImage src={images.profile} alt="Flare profile and preferences screen" /></ImageFrame>

        <section className="flare-benefits-block"><TextSection title="Key Benefits"><p>Flare is designed to help users build stronger communication skills through structured AI coaching and real-time feedback. By combining guided speaking sessions, personalized insights, session history, and performance analysis, the app creates a continuous learning experience that supports confidence, self-awareness, and long-term personal growth.</p></TextSection><BenefitCard title="Core Benefits" intro="Every feature is focused on helping users communicate with greater confidence while making practice sessions engaging, insightful, and easy to revisit." items={[["Stay Focused on What Matters", "Practice real-world conversations in a guided environment with live AI coaching, helping users improve confidence and communication skills through consistent repetition."], ["Personalized Session Feedback", "Receive detailed AI-generated insights after every session, including communication strengths, improvement opportunities, and actionable recommendations for future practice."]]} /></section>

        <BenefitCard title="User Benefits" intro="The experience is designed to make communication practice approachable, measurable, and motivating for users at every skill level." items={[["Track Personal Growth", "Review previous coaching sessions, monitor improvements over time, and gain a clear understanding of communication progress through organized session history and insights."], ["Build Confidence Through Consistency", "Regular guided practice, thoughtful feedback, and easy access to past sessions encourage users to develop lasting confidence and stronger everyday communication habits."]]} />

        <TextSection title="Consistent User Experience"><p>Every interface element in Flare was designed to create a cohesive and distraction-free experience. Typography, colors, buttons, form fields, interactive controls, and reusable UI patterns follow a unified visual language that makes the application feel familiar and intuitive across every screen.</p><p>Consistency extends beyond aesthetics to improve usability. Whether users are updating account settings, completing coaching sessions, reviewing AI insights, or managing preferences, familiar components reduce cognitive load and create predictable interactions. This unified design approach helps users stay focused on their communication goals while ensuring the product remains scalable, maintainable, and easy to navigate as new features are introduced.</p></TextSection>

        <ImageFrame className="flare-visual--system"><SourceImage className="flare-system-type" src={images.systemType} alt="Flare typography design tokens" /><SourceImage className="flare-system-color" src={images.systemColor} alt="Flare color design tokens" /></ImageFrame>
        <ImageFrame className="flare-visual--fields"><SourceImage src={images.fields} alt="Flare form field components" /></ImageFrame>
        <ImageFrame className="flare-visual--buttons"><SourceImage src={images.buttons} alt="Flare button components" /></ImageFrame>
        <ImageFrame className="flare-visual--toggles"><SourceImage src={images.toggles} alt="Flare toggle components" /></ImageFrame>
        <ImageFrame className="flare-visual--cards"><SourceImage src={images.cards} alt="Flare coaching style card components" /></ImageFrame>

        <figure className="flare-video-frame" aria-label="Flare product video preview">
          <video className="flare-product-video" controls preload="metadata" playsInline>
            <source src={asset("flare-product-demo.m4v")} type="video/mp4" />
            Your browser does not support embedded video playback.
          </video>
        </figure>
        <p className="flare-note"><strong>Note:</strong> Maintaining a consistent design language and reusable interface patterns ensures a seamless user experience while supporting future product scalability and feature expansion.</p>

        <TextSection title="Final Outcome"><p>Flare evolved into an AI-powered communication coaching platform that transforms everyday conversations into opportunities for personal growth. By combining guided speaking sessions, real-time AI transcription, personalized feedback, session history, and actionable insights, the product helps users build confidence, improve communication skills, and measure their progress over time.</p><p>Throughout the design process, the focus remained on creating an experience that feels approachable, supportive, and easy to navigate. Every interaction was designed to reduce friction, encourage consistent practice, and deliver meaningful feedback without overwhelming the user, resulting in a product that balances intelligent AI capabilities with a simple and intuitive user experience.</p></TextSection>

        <TextSection title="Key Design Takeaways" large><p>Designing Flare reinforced the importance of combining artificial intelligence with thoughtful user experience. Every screen was crafted to make communication practice feel natural, encouraging users to learn through guidance, reflection, and continuous improvement.</p><p>The design process emphasized:</p><ul><li>Creating intuitive AI-assisted coaching experiences.</li><li>Simplifying complex communication feedback into actionable insights.</li><li>Building consistent and accessible interaction patterns across the application.</li><li>Designing experiences that encourage confidence through regular practice.</li></ul></TextSection>

        <TextSection title="Looking Ahead"><p>Flare is designed with scalability in mind. The platform can expand with advanced AI coaching, personalized learning paths, voice analytics, conversation simulations, and deeper performance insights while maintaining the same clean, user-centered experience that supports continuous learning.</p></TextSection>
        <TextSection title="Final Note"><p>Flare reflects my approach to designing AI-powered digital products that combine intelligent technology with human-centered design. By focusing on clarity, usability, and meaningful interactions, the product transforms communication practice into an engaging experience that helps users build confidence, improve speaking skills, and grow through consistent feedback.</p></TextSection>
      </div></section>

      <nav className="flare-end-nav" aria-label="Case study navigation"><a href="/"><img className="flare-back-home-icon" src={asset("back-home-arrow.svg")} alt="" aria-hidden="true" /><span><em>Back to</em> Home</span></a><button type="button" onClick={returnToTop}><img src={asset("return-top-arrow.svg")} alt="" aria-hidden="true" /><span><em>Return to</em> Top</span></button></nav>
      <CaseStudyHomeTail />
    </main>
    <span className="flare-container-lines" aria-hidden="true" />
  </div>;
}
