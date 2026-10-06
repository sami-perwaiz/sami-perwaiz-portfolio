import Footer from "./Footer";
import HomeCta from "./HomeCta";
import ContactSection from "./ContactSection";
import { scrollToPageSection } from "./homeSectionNavigation";

export default function CaseStudyHomeTail() {
  return (
    <div className="case-study-home-tail">
      <p className="flare-case-footer">🎉 You've reached the end of this case study.</p>
      <ContactSection id="case-study-contact" />
      <HomeCta onAction={() => scrollToPageSection("case-study-contact")} />
      <Footer homeAnchors />
    </div>
  );
}
