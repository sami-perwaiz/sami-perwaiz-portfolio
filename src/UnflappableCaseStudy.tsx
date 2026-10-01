import { useEffect, type ReactNode } from "react";
import "./flare-case-study.css";
import "./unflappable-case-study.css";
import CaseStudyHomeTail from "./CaseStudyHomeTail";

const flareAsset = (name: string) => `/assets/flare-case-study/${name}`;
const unflappableAsset = (name: string) => `/assets/unflappable-case-study/${name}`;

const images = {
  welcome: unflappableAsset("unflappable-19590.webp"),
  onboardingRole: unflappableAsset("unflappable-19595.webp"),
  onboardingChallenge: unflappableAsset("unflappable-19596.webp"),
  onboardingGoal: unflappableAsset("unflappable-19598.webp"),
  onboardingReminder: unflappableAsset("unflappable-19599.webp"),
  dashboardMission: unflappableAsset("unflappable-19604.webp"),
  dashboardCompleted: unflappableAsset("unflappable-19605.webp"),
  weeklyReview: unflappableAsset("unflappable-19607.webp"),
  missionHistory: unflappableAsset("unflappable-19608.webp"),
  resetIntro: unflappableAsset("unflappable-19613.webp"),
  resetTrigger: unflappableAsset("unflappable-19615.webp"),
  resetFeeling: unflappableAsset("unflappable-19616.webp"),
  resetResult: unflappableAsset("unflappable-19618.webp"),
  resetHistory: unflappableAsset("unflappable-19620.webp"),
  progress: unflappableAsset("unflappable-19625.webp"),
  systemNavigation: unflappableAsset("unflappable-19685.webp"),
  systemDetail: unflappableAsset("unflappable-19686.webp"),
  systemFields: unflappableAsset("unflappable-19688.webp"),
  systemButtons: unflappableAsset("unflappable-19771.webp"),
  systemToggle: unflappableAsset("unflappable-19694.webp"),
  systemControl: unflappableAsset("unflappable-19696.webp"),
  systemInput: unflappableAsset("unflappable-19698.webp"),
  systemPremium: unflappableAsset("unflappable-19700.webp"),
} as const;

const metadata = [
  ["Role", "Senior UI/UX Designer"],
  ["Timeline", "09 Days"],
  ["Platform", "iPhone Mobile Application"],
  ["Industry", "Productivity & Personal Development"],
  ["Team", "1 UI/UX Designers"],
  ["Tools", "Figma, ChatGPT, OKLCH Gradient"],
] as const;

const principles = [
  ["Clarity-First Experience", "Designed streamlined user journeys that reduce cognitive load, helping users focus on one meaningful action instead of juggling multiple priorities."],
  ["Thoughtful Navigation", "Created a simple and intuitive information structure that allows users to move naturally between daily missions, resets, progress tracking, and account settings."],
  ["Consistent Visual Language", "Established reusable interface patterns, typography, spacing, and interaction behaviors to create a cohesive experience across every screen."],
  ["Collaborative Product Delivery", "Worked closely with the design team throughout the project, refining user flows, validating interactions, and preparing production-ready designs for smooth developer implementation."],
] as const;

const coreBenefits = [
  ["Stay Focused on What Matters", "Set one clear daily mission with supporting actions, making it easier to prioritize meaningful work without feeling overwhelmed."],
  ["Recover from Pressure Faster", "The guided Reset flow helps users acknowledge challenges, reframe their mindset, and return to action with clarity and confidence."],
  ["Build Lasting Consistency", "Track daily missions, streaks, and weekly progress to reinforce positive habits and maintain momentum over time."],
  ["Simple & Distraction-Free Experience", "A clean, focused interface removes unnecessary complexity, allowing users to concentrate on taking action instead of managing complicated workflows."],
] as const;

const userBenefits = [
  ["Personalized Onboarding", "Tailored questions during onboarding customize the experience based on each user's role, challenges, goals, and daily routine."],
  ["Clear Daily Direction", "The Home Dashboard provides one central place to manage today's mission, review progress, and access essential actions without distraction."],
  ["Meaningful Progress Tracking", "Visual insights into streaks, completed missions, and reset history help users recognize growth and stay motivated."],
  ["Encourages Healthy Habits", "By combining planning, reflection, and guided recovery, Unflappable supports users in building long-term habits instead of relying on short-term motivation."],
] as const;

function TextSection({ title, large = false, children }: { title: string; large?: boolean; children: ReactNode }) {
  return <section className={`flare-text-section${large ? " flare-text-section--large" : ""}`}><h2>{title}</h2><div className="flare-text-body">{children}</div></section>;
}

function ImageFrame({ className, children, label }: { className: string; children: ReactNode; label: string }) {
  return <figure className={`flare-visual ${className}`} aria-label={label}>{children}</figure>;
}

function SourceImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img className={className} src={src} alt={alt} loading="eager" decoding="async" />;
}

function BenefitCard({ title, intro, items }: { title: string; intro: string; items: ReadonlyArray<readonly [string, string]> }) {
  return <section className="flare-benefit-card unflappable-benefit-card"><header><h3>{title}</h3><p>{intro}</p></header>{items.map(([heading, copy]) => <article key={heading}><h4>{heading}</h4><p>{copy}</p></article>)}</section>;
}

export default function UnflappableCaseStudy() {
  useEffect(() => {
    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    const previousViewport = viewport?.content;
    const previousTitle = document.title;
    if (viewport) viewport.content = "width=device-width, initial-scale=1";
    document.title = "Unflappable Case Study — Sami Perwaiz";
    window.scrollTo(0, 0);
    return () => {
      if (viewport && previousViewport) viewport.content = previousViewport;
      document.title = previousTitle;
    };
  }, []);

  const returnToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return <div className="flare-case unflappable-case flare-case--home-tail" id="top">
    <header className="flare-case-navbar">
      <img className="flare-navbar-bg" src={flareAsset("navbar-bg.png")} alt="" aria-hidden="true" />
      <a className="flare-navbar-back" href="/#projects"><img src={flareAsset("back-arrow.svg")} alt="" aria-hidden="true" /><span>Back to Projects</span></a>
      <a className="flare-navbar-hello" href="mailto:samiperwaiz@gmail.com">Say Hello</a>
    </header>

    <main className="flare-case-container flare-case-container--with-home-tail">
      <section className="flare-case-hero">
        <div className="flare-hero-title-row"><div className="flare-hero-inner flare-hero-title"><span>Case Study</span><h1>Unflappable</h1></div></div>
        <div className="flare-hero-description-row"><div className="flare-hero-inner flare-hero-description"><h2>Stay Calm. Execute Anyway.</h2><p>Unflappable is an iPhone-first productivity app designed to help founders, entrepreneurs, creators, and professionals stay focused under pressure. Instead of managing endless to-do lists, the app guides users through a simple daily workflow of setting one clear mission, recovering quickly from setbacks, tracking progress, and building consistent follow-through.</p></div></div>
      </section>

      <section className="flare-article-shell"><div className="flare-article">
        <section className="flare-metadata" aria-label="Project details">{metadata.map(([label, value]) => <article key={label}><h2>{label}</h2><p>{value}</p></article>)}</section>

        <TextSection title="Project Overview" large><p>Staying productive isn't just about managing tasks it's about maintaining focus when distractions, pressure, and uncertainty take over. Many productivity apps become overloaded with features, making it harder for users to decide what to do next instead of helping them take action.</p><p>Unflappable was created to solve this challenge through a simple daily workflow centered around clarity, execution, recovery, and reflection. From creating a daily mission to completing a guided reset and reviewing weekly progress, every interaction encourages users to stay consistent without adding unnecessary complexity.</p><p>As the Senior UI/UX Designer, my focus was on designing an experience that feels calm, intuitive, and distraction-free. Every screen was simplified to reduce decision fatigue while keeping users focused on one meaningful action at a time, creating a product that is both functional and enjoyable to use.</p></TextSection>

        <section className="flare-philosophy"><TextSection title="Design Philosophy"><p>Rather than overwhelming users with dashboards and countless features, the design emphasizes clarity, focus, and momentum. Every interaction was carefully structured to help users move forward with confidence while maintaining a clean, premium, and approachable experience across the entire application.</p></TextSection><div className="flare-principles">{principles.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

        <TextSection title="Welcome Experience"><p>The first interaction with Unflappable was designed to create a calm and focused introduction to the app. Instead of overwhelming users with information, the welcome screen immediately communicates the product's purpose through a simple interface and a clear value proposition—helping users stay calm, make better decisions, and take meaningful action under pressure.</p><p>The minimal layout, clean typography, and spacious design establish a distraction-free experience that reflects the app's overall philosophy from the very first screen.</p></TextSection>
        <ImageFrame className="unflappable-visual--single-phone" label="Unflappable welcome experience"><SourceImage src={images.welcome} alt="Unflappable welcome screen" /></ImageFrame>

        <TextSection title="Personalized Onboarding"><p>The onboarding experience helps tailor the app to each user's goals without adding unnecessary complexity. Rather than asking users to complete lengthy forms, the process is broken into a series of short, focused questions that can be answered in just a few taps.</p><p>Users begin by selecting their primary role, identifying the biggest challenge affecting their productivity, defining what they want to improve, and choosing whether they'd like to receive daily reminders. These preferences personalize the experience from day one, allowing Unflappable to provide more relevant guidance while keeping the setup process quick, intuitive, and engaging.</p><p>This structured onboarding creates a smooth transition into the app, ensuring users can start their first mission with clarity and confidence.</p></TextSection>
        <ImageFrame className="unflappable-visual--phone-pair" label="Unflappable onboarding roles and challenges"><SourceImage className="unflappable-phone-left" src={images.onboardingRole} alt="Select your role onboarding screen" /><SourceImage className="unflappable-phone-right" src={images.onboardingChallenge} alt="Select your biggest challenge onboarding screen" /></ImageFrame>
        <ImageFrame className="unflappable-visual--phone-pair" label="Unflappable onboarding goals and reminders"><SourceImage className="unflappable-phone-left" src={images.onboardingGoal} alt="Select what to improve onboarding screen" /><SourceImage className="unflappable-phone-right" src={images.onboardingReminder} alt="Daily reminder onboarding screen" /></ImageFrame>

        <TextSection title="Home Dashboard &amp; Daily Mission"><p>The Home Dashboard was designed to become the user's daily command center, helping them stay focused on what matters most without unnecessary distractions. Instead of presenting multiple competing priorities, the experience encourages users to define one clear daily mission, track their progress, and build momentum through small, consistent actions.</p><p>The dashboard combines personalized greetings, progress indicators, streak tracking, and weekly review reminders into a clean, easy-to-navigate interface. As users complete each action, the mission updates in real time, providing immediate feedback and a clear sense of accomplishment.</p><p>This focused workflow helps users maintain clarity, follow through on their goals, and develop lasting daily habits while keeping the overall experience calm, intuitive, and motivating.</p></TextSection>
        <ImageFrame className="unflappable-visual--phone-pair" label="Unflappable daily mission screens"><SourceImage className="unflappable-phone-left" src={images.dashboardMission} alt="Daily mission dashboard" /><SourceImage className="unflappable-phone-right" src={images.dashboardCompleted} alt="Completed daily mission dashboard" /></ImageFrame>
        <ImageFrame className="unflappable-visual--phone-pair" label="Unflappable weekly review and mission history"><SourceImage className="unflappable-phone-left" src={images.weeklyReview} alt="Weekly review screen" /><SourceImage className="unflappable-phone-right" src={images.missionHistory} alt="Mission history screen" /></ImageFrame>

        <TextSection title="Reset Flow"><p>The Reset Flow is the signature experience of Unflappable, designed to help users pause, regain clarity, and move forward when they feel overwhelmed or stuck. Instead of allowing stress to interrupt productivity, the flow guides users through a simple step-by-step process that transforms emotional reactions into practical next actions.</p><p>Users begin by identifying what triggered their current situation, followed by selecting how they're feeling. Based on these inputs, the app provides a thoughtful reframe and a single recommended next step to help users refocus. Completed resets are saved to a history screen, allowing users to reflect on recurring patterns and measure their personal growth over time. This calm, structured approach encourages resilience while keeping the experience fast, focused, and easy to use.</p></TextSection>
        <ImageFrame className="unflappable-visual--single-phone" label="Unflappable reset introduction"><SourceImage src={images.resetIntro} alt="Unflappable reset introduction screen" /></ImageFrame>
        <ImageFrame className="unflappable-visual--phone-pair" label="Unflappable reset questions"><SourceImage className="unflappable-phone-left" src={images.resetTrigger} alt="Reset trigger selection screen" /><SourceImage className="unflappable-phone-right" src={images.resetFeeling} alt="Reset feeling selection screen" /></ImageFrame>
        <ImageFrame className="unflappable-visual--reset-result" label="Unflappable reset result"><SourceImage src={images.resetResult} alt="Reset recommendation result" /></ImageFrame>
        <ImageFrame className="unflappable-visual--phone unflappable-visual--reset-history" label="Unflappable reset history"><SourceImage src={images.resetHistory} alt="Reset history screen" /></ImageFrame>

        <TextSection title="Progress &amp; Performance Tracking"><p>The Progress screen gives users a clear view of their consistency and daily performance, making it easy to see how small actions contribute to long-term growth. Instead of focusing only on completed tasks, the experience highlights meaningful metrics such as day streaks, mission completion, reset activity, and overall progress to encourage sustainable habits.</p><p>Designed with simplicity in mind, the screen presents key insights in a clean and organized layout that users can understand at a glance. By turning daily actions into visible progress, Unflappable reinforces positive behavior, keeps users motivated, and helps them stay committed to their personal goals without overwhelming them with unnecessary data.</p></TextSection>
        <ImageFrame className="unflappable-visual--phone" label="Unflappable progress tracking"><SourceImage src={images.progress} alt="Progress and performance tracking screen" /></ImageFrame>

        <section className="flare-benefits-block"><TextSection title="Key Benefits"><p>Unflappable is built to help users stay focused, recover quickly from pressure, and consistently follow through on what matters most. By combining daily planning, guided reflection, progress tracking, and emotional reset tools, the app creates a simple system that supports both productivity and personal growth.</p></TextSection><BenefitCard title="Core Benefits" intro="Every feature is designed to reduce distractions, encourage consistent action, and help users stay in control throughout their day." items={coreBenefits} /></section>
        <BenefitCard title="User Benefits" intro="The experience was designed to make productivity feel intentional, sustainable, and easy to maintain every day." items={userBenefits} />

        <TextSection title="Consistent User Experience"><p>Every interaction in Unflappable was designed to feel familiar, predictable, and effortless. From typography and colors to forms, buttons, status indicators, and interactive elements, each interface follows a consistent visual language that helps users focus on their goals instead of learning new patterns on every screen.</p><p>The interface emphasizes clarity and simplicity while supporting important actions such as managing account settings, updating preferences, tracking progress, and accessing premium features. By maintaining consistency throughout the app, users can navigate confidently, complete tasks with minimal friction, and enjoy a smooth experience that feels cohesive from start to finish.</p></TextSection>

        <ImageFrame className="unflappable-visual--system-navigation" label="Unflappable navigation system"><SourceImage className="unflappable-system-main" src={images.systemNavigation} alt="Unflappable navigation components" /><SourceImage className="unflappable-system-detail" src={images.systemDetail} alt="Unflappable navigation detail" /></ImageFrame>
        <ImageFrame className="unflappable-visual--system-fields" label="Unflappable field system"><SourceImage src={images.systemFields} alt="Unflappable form field components" /></ImageFrame>
        <ImageFrame className="unflappable-visual--system-buttons" label="Unflappable button system"><SourceImage src={images.systemButtons} alt="Unflappable button components" /></ImageFrame>
        <ImageFrame className="unflappable-visual--system-toggle" label="Unflappable toggle system"><SourceImage src={images.systemToggle} alt="Unflappable toggle component" /></ImageFrame>
        <ImageFrame className="unflappable-visual--system-control" label="Unflappable selection controls"><SourceImage src={images.systemControl} alt="Unflappable selection controls" /></ImageFrame>
        <ImageFrame className="unflappable-visual--system-input" label="Unflappable compact inputs"><SourceImage src={images.systemInput} alt="Unflappable compact input components" /></ImageFrame>
        <ImageFrame className="unflappable-visual--system-premium" label="Unflappable premium controls"><SourceImage src={images.systemPremium} alt="Unflappable premium feature components" /></ImageFrame>

        <p className="flare-note"><strong>Note:</strong> Maintaining consistent visual patterns and interaction behaviors across the app helps reduce cognitive load, making every experience feel intuitive, reliable, and easy to navigate.</p>

        <TextSection title="Final Outcome"><p>Unflappable became more than a productivity app it evolved into a focused companion that helps users stay calm, regain clarity, and consistently follow through on what matters most. By combining personalized onboarding, daily missions, guided resets, and progress tracking, the app creates a simple system that supports both personal growth and sustainable productivity.</p><p>Throughout the design process, the focus remained on reducing cognitive load while creating an experience that feels calm, intentional, and easy to navigate. Every interaction was designed to encourage meaningful action without overwhelming users, resulting in a product that balances functionality with simplicity.</p></TextSection>

        <TextSection title="Key Design Takeaways" large><p>Designing Unflappable reinforced the importance of creating experiences that support both emotional well-being and productivity. Every screen was crafted to minimize distractions, encourage consistency, and help users build habits that last over time.</p><p>The design process focused on:</p><ul><li>Creating calm and distraction-free user experiences.</li><li>Simplifying complex behaviors into clear daily actions.</li><li>Building consistent interaction patterns across the product.</li><li>Designing interfaces that motivate progress without overwhelming users.</li></ul></TextSection>

        <TextSection title="Looking Ahead"><p>Unflappable was designed with future growth in mind. The product foundation can easily support additional coaching experiences, personalized insights, advanced habit tracking, AI-powered guidance, and new wellness features while maintaining the same simple and intuitive user experience.</p></TextSection>
        <TextSection title="Final Note"><p>Unflappable reflects my approach to designing thoughtful digital products that balance usability, emotional design, and purposeful interactions. By combining user-centered thinking with clear workflows and a consistent visual experience, the product helps users stay focused, build resilience, and make meaningful progress every day.</p></TextSection>
      </div></section>

      <nav className="flare-end-nav" aria-label="Case study navigation"><a href="/"><img className="flare-back-home-icon" src={flareAsset("back-home-arrow.svg")} alt="" aria-hidden="true" /><span><em>Back to</em> Home</span></a><button type="button" onClick={returnToTop}><img src={flareAsset("return-top-arrow.svg")} alt="" aria-hidden="true" /><span><em>Return to</em> Top</span></button></nav>
      <CaseStudyHomeTail />
    </main>
    <span className="flare-container-lines" aria-hidden="true" />
  </div>;
}
