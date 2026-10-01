import { useEffect, type ReactNode } from "react";
import "./flare-case-study.css";
import "./axishealth-case-study.css";
import CaseStudyHomeTail from "./CaseStudyHomeTail";

const flareAsset = (name: string) => `/assets/flare-case-study/${name}`;
const axisAsset = (name: string) => `/assets/axishealth-case-study/${name}`;

const images = {
  profileLeft: axisAsset("axishealth-8511.webp"),
  profileRight: axisAsset("axishealth-8512.webp"),
  onboardingLeft: axisAsset("axishealth-8514.webp"),
  onboardingRight: axisAsset("axishealth-8515.webp"),
  dashboard: axisAsset("axishealth-8520.webp"),
  nutrition: axisAsset("axishealth-8525.webp"),
  exercise: axisAsset("axishealth-8530.webp"),
  peptides: axisAsset("axishealth-8535.webp"),
  progress: axisAsset("axishealth-8540.webp"),
  vitals: axisAsset("axishealth-8545.webp"),
  systemType: axisAsset("axishealth-8589.webp"),
  systemColor: axisAsset("axishealth-8590.webp"),
  systemFields: axisAsset("axishealth-8592.webp"),
  systemButtons: axisAsset("axishealth-8594.webp"),
  systemCards: axisAsset("axishealth-8596.webp"),
  systemCharts: axisAsset("axishealth-8598.webp"),
  systemNavigation: axisAsset("axishealth-8600.webp"),
} as const;

const metadata = [
  ["Role", "UI/UX Designer"],
  ["Timeline", "7 Days"],
  ["Platform", "iPhone Mobile Application"],
  ["Industry", "Digital Healthcare & Wellness"],
  ["Team", "--------------"],
  ["Tools", "Figma, ChatGPT, Replit ai"],
] as const;

const targetUsers = [
  ["Health-Conscious Individuals", "Track nutrition, exercise, body metrics, and daily progress through a centralized dashboard that encourages healthier habits and long-term consistency."],
  ["Fitness Enthusiasts", "Generate personalized workouts, monitor performance, manage calorie intake, and analyze progress using intelligent planning and performance tracking tools."],
  ["Wellness & Peptide Therapy Users", "Manage supplement schedules, calculate accurate dosages, monitor treatment outcomes, and record side effects through a structured health management experience."],
  ["Individuals Pursuing Long-Term Health Goals", "Visualize progress through comprehensive health analytics, vital tracking, progress photos, and AI-powered future goal visualization, creating motivation through measurable improvements."],
] as const;

const coreBenefits = [
  ["Comprehensive Health Tracking", "Monitor daily activity, nutrition, exercise, peptide treatments, and vital health metrics from a single dashboard, eliminating the need for multiple health and fitness applications."],
  ["Personalized Wellness Management", "Access intelligent progress insights, treatment schedules, and customized health recommendations that help users stay consistent and achieve their long-term wellness goals."],
] as const;

const userBenefits = [
  ["Build Healthier Daily Habits", "Daily tracking, reminders, progress visualization, and guided wellness features encourage users to remain consistent with workouts, nutrition plans, medications, and healthy routines."],
  ["Make Data-Driven Health Decisions", "Real-time analytics, treatment monitoring, body metrics, and historical progress provide users with the information they need to evaluate their performance, adjust their routines, and improve overall health with confidence."],
] as const;

function TextSection({ title, large = false, children }: { title: string; large?: boolean; children: ReactNode }) {
  return <section className={`flare-text-section${large ? " flare-text-section--large" : ""}`}><h2>{title}</h2><div className="flare-text-body">{children}</div></section>;
}

function ImageFrame({ className, children, label }: { className: string; children: ReactNode; label: string }) {
  return <figure className={`flare-visual ${className}`} aria-label={label}>{children}</figure>;
}

function SourceImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img className={className} src={src} alt={alt} loading="lazy" decoding="async" />;
}

function BenefitCard({ title, intro, items, className = "" }: { title: string; intro: string; items: ReadonlyArray<readonly [string, string]>; className?: string }) {
  return <section className={`flare-benefit-card ${className}`}><header><h3>{title}</h3><p>{intro}</p></header>{items.map(([heading, copy]) => <article key={heading}><h4>{heading}</h4><p>{copy}</p></article>)}</section>;
}

export default function AxisHealthCaseStudy() {
  useEffect(() => {
    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    const previousViewport = viewport?.content;
    const previousTitle = document.title;
    if (viewport) viewport.content = "width=device-width, initial-scale=1";
    document.title = "AxisHealth Case Study — Sami Perwaiz";
    window.scrollTo(0, 0);
    return () => {
      if (viewport && previousViewport) viewport.content = previousViewport;
      document.title = previousTitle;
    };
  }, []);

  const returnToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return <div className="flare-case axishealth-case flare-case--home-tail" id="top">
    <header className="flare-case-navbar">
      <img className="flare-navbar-bg" src={flareAsset("navbar-bg.png")} alt="" aria-hidden="true" />
      <a className="flare-navbar-back" href="/#projects"><img src={flareAsset("back-arrow.svg")} alt="" aria-hidden="true" /><span>Back to Projects</span></a>
      <a className="flare-navbar-hello" href="mailto:samiperwaiz@gmail.com">Say Hello</a>
    </header>

    <main className="flare-case-container flare-case-container--with-home-tail">
      <section className="flare-case-hero axishealth-hero">
        <div className="flare-hero-title-row"><div className="flare-hero-inner flare-hero-title"><span>Case Study</span><h1>AxisHealth</h1></div></div>
        <div className="flare-hero-description-row"><div className="flare-hero-inner flare-hero-description"><h2>Empowering Health Management Through Intelligent, Personalized Experiences</h2><div className="axishealth-hero-copy"><p>AxisHealth is a comprehensive mobile health platform designed to simplify personal wellness by bringing nutrition, fitness, supplementation, and health monitoring into a single experience. Built for individuals seeking a proactive approach to their well-being, the application helps users track progress, build healthy habits, and make informed decisions through personalized insights and intuitive tools.</p><p>From onboarding to long-term health tracking, every interaction is designed around clarity, accessibility, and ease of use. The experience combines structured health assessments, intelligent workout generation, meal planning, supplement management, and vital monitoring within a clean, user-centered interface. By reducing complexity and surfacing the right information at the right time, AxisHealth transforms everyday health management into a guided, motivating, and sustainable journey.</p></div></div></div>
      </section>

      <section className="flare-article-shell"><div className="flare-article">
        <section className="flare-metadata" aria-label="Project details">{metadata.map(([label, value]) => <article key={label}><h2>{label}</h2><p>{value}</p></article>)}</section>

        <TextSection title="Project Overview" large><p>Managing personal health often requires switching between multiple applications for nutrition, workouts, supplements, and health metrics. This fragmented experience makes it difficult for users to maintain consistency, understand their progress, and develop sustainable habits over time.</p><p>AxisHealth was designed to solve this challenge by creating a unified health ecosystem where users can manage every aspect of their wellness from one intuitive platform. From personalized onboarding and meal planning to workout generation, peptide management, and long-term vital tracking, every feature works together to provide meaningful guidance throughout the user's health journey.</p><p>As the UI/UX Designer, my goal was to create an experience that feels approachable regardless of a user's fitness knowledge. The interface prioritizes clarity, structured information architecture, and progressive disclosure, allowing users to focus on their goals without feeling overwhelmed by complex health data.</p></TextSection>

        <section className="axishealth-target-users"><TextSection title="Target Users"><p>AxisHealth is designed for individuals who want a smarter and more organized approach to managing their health. The experience balances simplicity with powerful health insights, making it suitable for users at different stages of their wellness journey.</p></TextSection><div className="flare-principles axishealth-user-grid">{targetUsers.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

        <TextSection title="Authentication &amp; Health Profile Setup"><p>The onboarding experience was designed to create a smooth transition into AxisHealth by combining account creation with personalized health profiling. Rather than overwhelming users with lengthy forms, the process is divided into clear, manageable steps that progressively collect essential information needed to personalize the user's wellness journey.</p><p>Users begin by creating an account before providing key health details such as physical measurements, activity level, primary fitness goals, and nutritional targets. This structured approach reduces cognitive load while enabling the platform to generate tailored recommendations for workouts, meal plans, and overall health guidance from the very first session.</p><p>The multi-step flow emphasizes clarity, accessibility, and user confidence through clean layouts, intuitive form controls, and clear progress indicators. By guiding users through each stage with focused interactions, the experience establishes a strong foundation for personalized health management while making the setup process feel simple, approachable, and efficient.</p></TextSection>
        <ImageFrame className="axishealth-visual--pair" label="AxisHealth authentication screens"><SourceImage className="axishealth-phone-left" src={images.profileLeft} alt="AxisHealth account creation screen" /><SourceImage className="axishealth-phone-right" src={images.profileRight} alt="AxisHealth health profile screen" /></ImageFrame>
        <ImageFrame className="axishealth-visual--pair" label="AxisHealth personalized health setup screens"><SourceImage className="axishealth-phone-left" src={images.onboardingLeft} alt="AxisHealth activity and goals setup" /><SourceImage className="axishealth-phone-right" src={images.onboardingRight} alt="AxisHealth nutrition target setup" /></ImageFrame>

        <TextSection title="Dashboard Experience"><p>The Dashboard serves as the central hub of AxisHealth, giving users a clear overview of their daily wellness goals from a single, easy-to-navigate screen. Instead of searching through multiple sections, users can instantly view calorie progress, exercise activity, scheduled tasks, meal plans, and recent health readings, helping them stay informed and focused throughout the day.</p><p>The interface was designed with a strong visual hierarchy that highlights the most important health metrics first while keeping secondary information easily accessible. Circular progress indicators, organized content cards, and actionable reminders enable users to quickly understand their daily status and take the next appropriate action without feeling overwhelmed.</p><p>By combining personalized insights, daily planning, and health tracking into one streamlined experience, the dashboard creates a motivating starting point for every session. The clean layout and intuitive navigation encourage users to build consistent wellness habits while making everyday health management feel simple, organized, and engaging.</p></TextSection>
        <ImageFrame className="axishealth-visual--phone" label="AxisHealth dashboard experience"><SourceImage src={images.dashboard} alt="AxisHealth wellness dashboard" /></ImageFrame>

        <TextSection title="Calorie &amp; Nutrition Tracking"><p>The Calorie &amp; Nutrition Tracking screen helps users stay on top of their daily nutritional goals through a simple and visually engaging interface. Instead of manually calculating progress, users can instantly view their remaining calorie allowance alongside a detailed breakdown of macronutrients, making it easier to understand how each meal contributes to their overall health objectives.</p><p>The experience was designed around clarity and actionable insights. A prominent circular progress indicator provides an immediate overview of daily calorie consumption, while dedicated protein, carbohydrate, and fat trackers help users maintain a balanced nutritional intake. Organized information cards and intuitive editing actions ensure users can quickly update their meals without interrupting their daily routine.</p><p>By transforming complex nutritional data into clear visual progress, the screen encourages healthier eating habits and consistent self-monitoring. The clean layout minimizes distractions while giving users the confidence to make informed dietary decisions that align with their personalized fitness and wellness goals.</p></TextSection>
        <ImageFrame className="axishealth-visual--phone" label="AxisHealth calorie and nutrition tracking"><SourceImage src={images.nutrition} alt="AxisHealth calorie and nutrition screen" /></ImageFrame>

        <TextSection title="Exercise &amp; Activity Tracking"><p>The Exercise &amp; Activity Tracking screen provides users with a comprehensive overview of their daily movement and fitness progress in one place. Designed to encourage consistency, the interface combines workout metrics, activity summaries, and personalized recommendations, allowing users to monitor their performance without navigating through multiple screens.</p><p>A set of visual progress indicators highlights key metrics such as daily activity, weekly performance, and step goals, giving users an instant understanding of how close they are to achieving their targets. Weekly workout statistics, including completed sessions, exercise duration, and calories burned, offer meaningful insights into overall fitness progress while reinforcing positive habits.</p><p>To create a more engaging workout experience, the screen also includes an integrated media player that enables users to listen to their preferred music or podcasts during exercise. A quick workout generator further simplifies planning by suggesting activities based on the user's available time, helping eliminate decision fatigue and making it easier to stay active every day.</p><p>The clean information hierarchy, intuitive navigation, and motivating visual feedback transform fitness tracking into a seamless daily experience, empowering users to maintain healthy routines and achieve their long-term wellness goals.</p></TextSection>
        <ImageFrame className="axishealth-visual--phone" label="AxisHealth exercise and activity tracking"><SourceImage src={images.exercise} alt="AxisHealth exercise and activity screen" /></ImageFrame>

        <TextSection title="Peptides &amp; Treatment Management"><p>The Peptides screen centralizes treatment planning by giving users a clear overview of their supplement and peptide routines. Instead of managing schedules through separate notes or reminders, the interface brings product information, dosage planning, and upcoming treatments together in a clean, easy-to-understand layout.</p><p>The screen highlights featured wellness products while providing quick access to premium peptide resources, helping users explore recommended treatments without interrupting their routine. A dedicated schedule section allows users to organize dosage plans, monitor upcoming administrations, and easily update their treatment timeline whenever needed.</p><p>To improve usability, empty states clearly communicate when no schedules have been created and guide users toward the next action, reducing confusion for first-time users. Simple editing controls and structured content hierarchy make it effortless to manage treatment plans while keeping the experience uncluttered and approachable.</p><p>By combining product discovery, treatment scheduling, and medication management into a single interface, the screen delivers a streamlined experience that helps users stay organized, maintain consistency, and confidently manage their wellness journey.</p></TextSection>
        <ImageFrame className="axishealth-visual--phone" label="AxisHealth peptide treatment management"><SourceImage src={images.peptides} alt="AxisHealth peptide management screen" /></ImageFrame>

        <TextSection title="Progress &amp; Side Effects Tracking"><p>The Progress &amp; Side Effects Tracking screen enables users to monitor how their treatment is affecting their overall well-being over time. Instead of relying on memory, users can quickly record changes across key health indicators such as energy levels, sleep quality, mood, mental clarity, strength, and other treatment outcomes through a simple, structured interface.</p><p>Each health metric can be marked as Improved, Unchanged, or Worsened, making it easy to identify trends and evaluate treatment effectiveness. Color-coded status indicators provide immediate visual feedback, allowing users to review their progress at a glance while creating meaningful records that can support future adjustments and healthcare discussions.</p><p>The clean layout minimizes complexity by presenting information in an organized checklist format, encouraging users to consistently log their experiences without adding unnecessary effort. This approach transforms routine health tracking into a simple daily habit, helping users make informed decisions throughout their wellness journey.</p></TextSection>
        <ImageFrame className="axishealth-visual--phone" label="AxisHealth progress and side effects tracking"><SourceImage src={images.progress} alt="AxisHealth treatment progress screen" /></ImageFrame>

        <TextSection title="Vitals &amp; Health Monitoring"><p>The Vitals Tracking screen provides users with a centralized view of their long-term health progress by combining body metrics, visual progress tracking, and future goal planning in one intuitive interface. Rather than displaying isolated data points, the screen presents meaningful insights that help users understand how their health evolves over time.</p><p>Users can maintain a visual record of their transformation through progress photos, log important health metrics, and review long-term trends to measure improvements consistently. A future goal visualization feature further enhances motivation by helping users define objectives and visualize their desired outcomes, making progress feel more tangible and achievable.</p><p>Designed with clarity and accessibility in mind, the interface organizes health information into easy-to-understand sections while maintaining a clean visual hierarchy. By bringing together vitals, progress tracking, and goal management, the experience empowers users to stay engaged, monitor meaningful improvements, and make informed decisions throughout their health and wellness journey.</p></TextSection>
        <ImageFrame className="axishealth-visual--phone" label="AxisHealth vitals and health monitoring"><SourceImage src={images.vitals} alt="AxisHealth vitals tracking screen" /></ImageFrame>

        <section className="flare-benefits-block"><TextSection title="Key Benefits"><p>AxisHealth is designed to simplify every aspect of personal health management through one connected platform. By combining fitness tracking, nutrition management, peptide scheduling, vital monitoring, and AI-powered wellness insights, the application helps users build healthier habits, monitor progress, and make informed decisions with confidence.</p></TextSection><BenefitCard title="Core Benefits" intro="Every feature is built to help users take control of their health journey through clear insights, personalized tracking, and an intuitive user experience." items={coreBenefits} /></section>
        <BenefitCard className="axishealth-user-benefits" title="User Benefits" intro="The experience is designed to make healthy living simple, measurable, and sustainable regardless of a user's fitness level or wellness objectives." items={userBenefits} />

        <TextSection title="Consistent User Experience"><p>Every screen in AxisHealth was designed around a unified design system to create a seamless and trustworthy healthcare experience. Consistent typography, color palettes, spacing, reusable components, and interaction patterns ensure users can navigate the application effortlessly while managing fitness, nutrition, treatments, and overall wellness.</p><p>The interface prioritizes clarity and usability by maintaining predictable layouts and familiar UI patterns across every feature. From health dashboards and calorie tracking to peptide management, progress analytics, and vital monitoring, every interaction follows the same visual language to reduce cognitive load and improve confidence.</p><p>Reusable design components including buttons, input fields, cards, charts, progress indicators, and feedback states create a cohesive experience that remains intuitive as users explore different sections of the platform. This consistency not only enhances usability but also allows the product to scale efficiently as new health features and AI-powered capabilities are introduced.</p><p>By establishing a strong and flexible design foundation, AxisHealth delivers a premium, reliable, and user-centered experience that makes managing personal health simple, organized, and engaging from start to finish.</p></TextSection>

        <ImageFrame className="axishealth-visual--system" label="AxisHealth typography and color system"><SourceImage className="axishealth-system-type" src={images.systemType} alt="AxisHealth typography system" /><SourceImage className="axishealth-system-color" src={images.systemColor} alt="AxisHealth color system" /></ImageFrame>
        <ImageFrame className="axishealth-visual--fields" label="AxisHealth form field system"><SourceImage src={images.systemFields} alt="AxisHealth form field components" /></ImageFrame>
        <ImageFrame className="axishealth-visual--buttons" label="AxisHealth button system"><SourceImage src={images.systemButtons} alt="AxisHealth button components" /></ImageFrame>
        <ImageFrame className="axishealth-visual--cards" label="AxisHealth card system"><SourceImage src={images.systemCards} alt="AxisHealth card components" /></ImageFrame>
        <ImageFrame className="axishealth-visual--charts" label="AxisHealth chart system"><SourceImage src={images.systemCharts} alt="AxisHealth chart and progress components" /></ImageFrame>
        <ImageFrame className="axishealth-visual--navigation" label="AxisHealth navigation system"><SourceImage src={images.systemNavigation} alt="AxisHealth navigation components" /></ImageFrame>

        <TextSection title="Final Outcome"><p>AxisHealth evolved into a comprehensive digital health platform that unifies fitness tracking, nutrition management, peptide therapy, vital monitoring, and wellness insights within a single intuitive experience. By bringing together personalized dashboards, progress analytics, treatment scheduling, and AI-assisted health guidance, the platform empowers users to make informed decisions, build healthier habits, and stay committed to their long-term wellness goals.</p><p>Throughout the design process, the focus remained on creating an experience that feels simple, trustworthy, and motivating. Every interaction was carefully crafted to reduce complexity, present meaningful health data clearly, and support users with actionable insights, resulting in a product that balances powerful healthcare functionality with an accessible, user-centered interface.</p></TextSection>

        <TextSection title="Key Design Takeaways" large><p>Designing AxisHealth reinforced the importance of creating healthcare experiences that simplify complex health data without overwhelming users. Every screen was designed to support informed decision-making through intuitive workflows, consistent interactions, and meaningful visual feedback that encourages long-term engagement.</p><p>The design process emphasized:</p><ul><li>Designing intuitive healthcare experiences that simplify complex wellness management.</li><li>Transforming health data into actionable insights through clear visual hierarchy.</li><li>Building a scalable design system with reusable components and consistent interaction patterns.</li><li>Creating engaging experiences that encourage healthy habits and long-term user retention.</li></ul></TextSection>

        <TextSection title="Looking Ahead"><p>AxisHealth was designed with scalability at its core. The platform can expand to support AI-powered health coaching, wearable device integrations, remote patient monitoring, telemedicine services, advanced health analytics, and personalized preventive care while maintaining the same clean, accessible, and user-friendly experience.</p></TextSection>
        <TextSection title="Final Note"><p>AxisHealth reflects my approach to designing modern digital healthcare products that combine usability, accessibility, and intelligent technology. By focusing on user-centered design, scalable UI systems, and meaningful health experiences, the platform empowers users to take control of their wellness journey while providing a seamless experience that grows with their evolving healthcare needs.</p></TextSection>
      </div></section>

      <nav className="flare-end-nav" aria-label="Case study navigation"><a href="/"><img className="flare-back-home-icon" src={flareAsset("back-home-arrow.svg")} alt="" aria-hidden="true" /><span><em>Back to</em> Home</span></a><button type="button" onClick={returnToTop}><img src={flareAsset("return-top-arrow.svg")} alt="" aria-hidden="true" /><span><em>Return to</em> Top</span></button></nav>
      <CaseStudyHomeTail />
    </main>
    <span className="flare-container-lines" aria-hidden="true" />
  </div>;
}
