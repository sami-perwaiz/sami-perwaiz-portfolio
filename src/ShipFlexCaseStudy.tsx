import { useEffect, type ReactNode } from "react";
import "./flare-case-study.css";
import "./shipflex-case-study.css";
import CaseStudyHomeTail from "./CaseStudyHomeTail";

const flareAsset = (name: string) => `/assets/flare-case-study/${name}`;
const shipFlexAsset = (name: string) => `/assets/shipflex-case-study/${name}`;
const optimizedShipFlexAsset = (name: string) => `/assets/optimized/case-studies/shipflex/${name}`;

const images = {
  login: optimizedShipFlexAsset("shipflex-19031-1440.webp"),
  dashboard: optimizedShipFlexAsset("shipflex-19036-1920.webp"),
  shipments: optimizedShipFlexAsset("shipflex-19096-1920.webp"),
  navigation: shipFlexAsset("shipflex-19101.webp"),
  navigationDetail: shipFlexAsset("shipflex-19102.webp"),
  fields: shipFlexAsset("shipflex-19104.webp"),
  buttons: shipFlexAsset("shipflex-19106.webp"),
  toggle: shipFlexAsset("shipflex-19108.webp"),
  controls: shipFlexAsset("shipflex-19110.webp"),
  fullProduct: shipFlexAsset("shipflex-19112.webp"),
} as const;

const metadata = [
  ["Role", "Lead UI/UX Designer & Systems Architect"],
  ["Timeline", "8 Weeks"],
  ["Platform", "Desktop Web Application"],
  ["Industry", "eCommerce Logistics & Shipping"],
  ["Team", "2 UI/UX Designers"],
  ["Tools", "Figma, ChatGPT, Claude AI"],
] as const;

const approach = [
  ["User-Centered Workflows", "Mapped and optimized key shipping journeys to reduce unnecessary steps and create a faster, more intuitive fulfillment experience."],
  ["Information Architecture", "Organized navigation and product structure to provide quick access to core shipping, analytics, and configuration features."],
  ["Scalable Design System", "Built a reusable component library with consistent colors, typography, spacing, buttons, tables, forms, and status indicators to ensure a cohesive user experience."],
  ["Developer Collaboration", "Prepared organized design specifications, interactive prototypes, and reusable components to support smooth implementation and maintain design consistency throughout development."],
] as const;

const businessBenefits = [
  ["Centralized Shipping Management", "Manage shipments, orders, analytics, and store integrations from one unified dashboard, eliminating the need to switch between multiple platforms."],
  ["Faster Fulfillment Process", "Streamlined workflows and reusable shipping tools reduce repetitive tasks, helping merchants process orders more efficiently."],
  ["Real-Time Shipping Insights", "Interactive dashboards provide instant visibility into shipment performance, carrier utilization, shipping costs, and operational trends."],
  ["Seamless Store Integrations", "Connect platforms like Shopify and TikTok to automatically sync orders and simplify fulfillment without additional manual effort."],
] as const;

const userBenefits = [
  ["Compare Carrier Rates Instantly", "View and compare multiple carrier options in one place to choose the best shipping method based on cost, speed, or overall value."],
  ["Simplified Shipment Creation", "Create shipments through a guided workflow with organized forms, clear validation, and an intuitive interface that minimizes errors."],
  ["Better Tracking Experience", "Monitor shipment status, delivery progress, and fulfillment health from a centralized dashboard with real-time updates."],
  ["Consistent & Scalable Experience", "A reusable design system ensures every module follows the same visual language, creating a familiar experience as the platform continues to grow."],
] as const;

function TextSection({ title, large = false, children }: { title: string; large?: boolean; children: ReactNode }) {
  return <section className={`flare-text-section${large ? " flare-text-section--large" : ""}`}><h2>{title}</h2><div className="flare-text-body">{children}</div></section>;
}

function ImageFrame({ className, children, label }: { className: string; children: ReactNode; label: string }) {
  return <figure className={`flare-visual ${className}`} aria-label={label}>{children}</figure>;
}

function SourceImage({ src, alt, className, srcSet, sizes }: { src: string; alt: string; className?: string; srcSet?: string; sizes?: string }) {
  return <img className={className} src={src} srcSet={srcSet} sizes={sizes} alt={alt} loading="lazy" decoding="async" />;
}

function BenefitCard({ title, intro, items }: { title: string; intro: string; items: ReadonlyArray<readonly [string, string]> }) {
  return <section className="flare-benefit-card shipflex-benefit-card"><header><h3>{title}</h3><p>{intro}</p></header>{items.map(([heading, copy]) => <article key={heading}><h4>{heading}</h4><p>{copy}</p></article>)}</section>;
}

export default function ShipFlexCaseStudy() {
  useEffect(() => {
    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    const previousViewport = viewport?.content;
    const previousTitle = document.title;
    if (viewport) viewport.content = "width=device-width, initial-scale=1";
    document.title = "ShipFlex Case Study — Sami Perwaiz";
    window.scrollTo(0, 0);
    return () => {
      if (viewport && previousViewport) viewport.content = previousViewport;
      document.title = previousTitle;
    };
  }, []);

  const returnToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return <div className="flare-case shipflex-case flare-case--home-tail" id="top">
    <header className="flare-case-navbar">
      <img className="flare-navbar-bg" src="/assets/optimized/flare/navbar-bg.webp" alt="" aria-hidden="true" width={1024} height={43} />
      <a className="flare-navbar-back" href="/#projects"><img src={flareAsset("back-arrow.svg")} alt="" aria-hidden="true" /><span>Back to Projects</span></a>
      <a className="flare-navbar-hello" href="mailto:samiperwaiz@gmail.com">Say Hello</a>
    </header>

    <main className="flare-case-container flare-case-container--with-home-tail">
      <section className="flare-case-hero">
        <div className="flare-hero-title-row"><div className="flare-hero-inner flare-hero-title"><span>Case Study</span><h1>ShipFlex</h1></div></div>
        <div className="flare-hero-description-row"><div className="flare-hero-inner flare-hero-description"><h2>Smart Shipping &amp; Fulfillment Platform for Growing eCommerce Businesses</h2><p>ShipFlex is a web-based shipping management platform built to simplify the fulfillment process for online businesses. It brings shipment creation, real-time carrier rate comparison, order management, store integrations, shipping analytics, and branded tracking experiences into one centralized workspace, helping merchants manage their shipping operations more efficiently.</p></div></div>
      </section>

      <section className="flare-article-shell"><div className="flare-article">
        <section className="flare-metadata" aria-label="Project details">{metadata.map(([label, value]) => <article key={label}><h2>{label}</h2><p>{value}</p></article>)}</section>

        <TextSection title="Project Overview" large>
          <p>Managing shipping operations across different carriers and sales channels can quickly become complex, especially for growing eCommerce businesses. Merchants often rely on multiple platforms to create shipments, compare carrier rates, manage orders, and track deliveries, leading to inefficient workflows and unnecessary manual effort.</p>
          <p>ShipFlex was designed to centralize these operations into a single platform that simplifies shipment management from start to finish. The product combines real-time shipping rate comparison, order fulfillment, analytics, carrier integrations, and branded customer experiences to help businesses streamline their daily operations.</p>
          <p>The design focused on creating a clean, scalable interface that reduces complexity while keeping frequently used actions easy to access. Every workflow was structured to improve efficiency, maintain consistency across modules, and support future product growth.</p>
        </TextSection>

        <section className="flare-philosophy shipflex-approach"><TextSection title="Design Approach"><p>The project was driven by the goal of creating an intuitive product that simplifies complex shipping workflows without overwhelming users. Every module was designed with consistency, scalability, and usability in mind, ensuring merchants could complete common tasks with minimal effort while maintaining a seamless experience throughout the platform.</p></TextSection><div className="flare-principles">{approach.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

        <TextSection title="Login Experience"><p>The login experience was designed to create a smooth and welcoming entry into the ShipFlex platform. Keeping the interface clean and distraction-free allows users to sign in quickly and get straight to managing their shipping operations without unnecessary friction.</p><p>The visual illustration reinforces the platform's logistics identity, while a clear form layout, familiar authentication options, and consistent branding build trust from the very first interaction. Every element was designed to make onboarding feel effortless and establish a consistent user experience across the product.</p></TextSection>
        <ImageFrame className="shipflex-visual--login" label="ShipFlex login experience"><SourceImage src={images.login} srcSet={`${optimizedShipFlexAsset("shipflex-19031-720.webp")} 720w, ${optimizedShipFlexAsset("shipflex-19031-960.webp")} 960w, ${optimizedShipFlexAsset("shipflex-19031-1440.webp")} 1440w`} sizes="(min-width: 801px) 669px, 91vw" alt="ShipFlex login screen" /></ImageFrame>

        <TextSection title="Main Dashboard Showcase"><p>The Analytics Dashboard serves as the operational hub of ShipFlex, giving merchants a real-time overview of their shipping performance from a single screen. Instead of switching between multiple carrier portals and reports, users can instantly monitor shipments, compare shipping costs, track carrier utilization, and identify key business trends.</p><p>The dashboard was designed with a clear visual hierarchy, allowing the most important metrics to stand out while supporting deeper insights through charts and data visualizations. This approach helps users make faster decisions, monitor fulfillment performance, and stay in control of daily shipping operations with confidence.</p></TextSection>
        <ImageFrame className="shipflex-visual--dashboard" label="ShipFlex analytics dashboard"><SourceImage src={images.dashboard} srcSet={`${optimizedShipFlexAsset("shipflex-19036-720.webp")} 720w, ${optimizedShipFlexAsset("shipflex-19036-960.webp")} 960w, ${optimizedShipFlexAsset("shipflex-19036-1440.webp")} 1440w, ${optimizedShipFlexAsset("shipflex-19036-1920.webp")} 1920w`} sizes="(min-width: 801px) 663px, 90vw" alt="ShipFlex analytics dashboard" /></ImageFrame>

        <section className="flare-benefits-block"><TextSection title="Key Benefits"><p>ShipFlex was designed to simplify shipping operations by bringing every essential workflow into one intuitive platform. The product helps merchants save time, improve visibility, and manage fulfillment with greater confidence through a streamlined and user-centered experience.</p></TextSection><BenefitCard title="Business Benefits" intro="The platform helps businesses optimize their shipping operations while reducing manual work and improving overall efficiency." items={businessBenefits} /></section>

        <BenefitCard title="User Benefits" intro="The experience was designed to make daily shipping tasks simpler, faster, and easier to manage for merchants and operations teams." items={userBenefits} />

        <TextSection title="Shipment Management"><p>The Shipment Management module provides a centralized workspace where merchants can monitor and manage every shipment throughout its lifecycle. Instead of switching between multiple carrier portals, users can view shipment details, track delivery progress, and manage orders from a single, organized interface.</p><p>Designed for efficiency, the table presents key information such as order details, receiver information, selected carrier, tracking numbers, delivery status, and available actions in a clear, easy-to-scan layout. Built-in filters, pagination, and status indicators help users quickly locate shipments, monitor fulfillment progress, and respond to exceptions with minimal effort.</p></TextSection>
        <ImageFrame className="shipflex-visual--shipments" label="ShipFlex shipment management"><SourceImage src={images.shipments} srcSet={`${optimizedShipFlexAsset("shipflex-19096-720.webp")} 720w, ${optimizedShipFlexAsset("shipflex-19096-960.webp")} 960w, ${optimizedShipFlexAsset("shipflex-19096-1440.webp")} 1440w, ${optimizedShipFlexAsset("shipflex-19096-1920.webp")} 1920w`} sizes="(min-width: 801px) 661px, 90vw" alt="ShipFlex shipment management table" /></ImageFrame>

        <TextSection title="Consistent Product Experience"><p>Creating a seamless user experience goes beyond individual screens. Every element across ShipFlex was designed to follow a consistent visual language, helping users recognize patterns and interact with the platform naturally. From typography and color usage to forms, buttons, navigation, and interactive controls, each element was carefully refined to deliver a familiar and intuitive experience.</p><p>This consistent approach not only improves usability but also makes the platform easier to learn, reduces cognitive load, and ensures new features can be introduced without disrupting the overall user experience.</p></TextSection>

        <ImageFrame className="shipflex-visual--navigation" label="ShipFlex navigation design system"><SourceImage className="shipflex-navigation-main" src={images.navigation} alt="ShipFlex navigation component" /><SourceImage className="shipflex-navigation-detail" src={images.navigationDetail} alt="ShipFlex navigation detail" /></ImageFrame>
        <ImageFrame className="shipflex-visual--fields" label="ShipFlex form controls"><SourceImage src={images.fields} alt="ShipFlex form field components" /></ImageFrame>
        <ImageFrame className="shipflex-visual--buttons" label="ShipFlex button components"><SourceImage src={images.buttons} alt="ShipFlex button components" /></ImageFrame>
        <ImageFrame className="shipflex-visual--toggle" label="ShipFlex toggle component"><SourceImage src={images.toggle} alt="ShipFlex toggle component" /></ImageFrame>
        <ImageFrame className="shipflex-visual--controls" label="ShipFlex selection controls"><SourceImage src={images.controls} alt="ShipFlex selection controls" /></ImageFrame>
        <ImageFrame className="shipflex-visual--full-product" label="ShipFlex full product experience"><SourceImage src={images.fullProduct} alt="ShipFlex complete product interface" /></ImageFrame>

        <p className="flare-note"><strong>Note:</strong> Maintaining consistent interaction patterns and visual hierarchy throughout the platform helped create a more intuitive experience while supporting future product scalability.</p>

        <TextSection title="Final Outcome"><p>ShipFlex evolved into a centralized shipping management platform that simplifies complex fulfillment workflows into a clean and intuitive user experience. By combining shipment creation, carrier rate comparison, order management, analytics, store integrations, and branded tracking within a single platform, the product enables merchants to manage their daily shipping operations with greater efficiency and confidence.</p><p>Throughout the project, the focus remained on creating an interface that reduces complexity without sacrificing functionality. Consistent interaction patterns, clear information hierarchy, and scalable UI foundations ensure the platform can continue growing as new business requirements and features are introduced.</p></TextSection>

        <TextSection title="Key Design Takeaways" large><p>This project reinforced the importance of designing for both usability and scalability. Every screen was approached with the goal of helping users complete tasks faster while maintaining consistency across the entire product experience.</p><p>The process emphasized:</p><ul><li>Designing intuitive workflows for complex shipping operations.</li><li>Maintaining consistency through reusable interface patterns.</li><li>Prioritizing clear navigation and information hierarchy.</li><li>Building experiences that balance business goals with user needs.</li></ul></TextSection>

        <TextSection title="Looking Ahead"><p>As ShipFlex continues to evolve, the design foundation is flexible enough to support additional carrier integrations, advanced analytics, automation features, and future platform enhancements while preserving a familiar and consistent user experience.</p></TextSection>
        <TextSection title="Final Note"><p>ShipFlex demonstrates my approach to designing scalable SaaS products—combining user-centered thinking, structured workflows, and consistent interface design to transform complex logistics operations into a simple, efficient, and intuitive experience.</p></TextSection>
      </div></section>

      <nav className="flare-end-nav" aria-label="Case study navigation"><a href="/"><img className="flare-back-home-icon" src={flareAsset("back-home-arrow.svg")} alt="" aria-hidden="true" /><span><em>Back to</em> Home</span></a><button type="button" onClick={returnToTop}><img src={flareAsset("return-top-arrow.svg")} alt="" aria-hidden="true" /><span><em>Return to</em> Top</span></button></nav>
      <CaseStudyHomeTail />
    </main>
    <span className="flare-container-lines" aria-hidden="true" />
  </div>;
}
