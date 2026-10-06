import { a } from "./assets";
import { externalSocialLinks } from "./externalLinks";

const footerLinks = [
  { label: "About Me", sectionId: "about" },
  { label: "Projects", sectionId: "projects" },
  { label: "Skills", sectionId: "toolkit" },
  { label: "Contact Us", sectionId: "contact" },
] as const;

export default function Footer({
  homeAnchors = false,
  sectionNavigation = false,
  footerText = "© 2026 Sami Perwaiz. All Rights Reserved.",
}: {
  homeAnchors?: boolean;
  sectionNavigation?: boolean;
  footerText?: string;
}) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand-row">
          <p className="footer-brand">Sami Perwaiz</p>
          <nav className="footer-links" aria-label="Footer">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={homeAnchors ? `/#${link.sectionId}` : sectionNavigation ? "/" : `#${link.sectionId}`}
                data-home-section={sectionNavigation ? link.sectionId : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="footer-container footer-container--bottom">
        <div className="footer-rule" aria-hidden="true" />
        <div className="footer-meta">
          <p className="footer-copy">{footerText}</p>
          <div className="footer-socials" aria-label="Social links">
            <a href={externalSocialLinks.linkedin.href} target="_blank" rel="noopener noreferrer" aria-label={externalSocialLinks.linkedin.label}>
              <img src={a.footerLinkedin} alt="" width={24} height={24} loading="lazy" decoding="async" />
            </a>
            <a href={externalSocialLinks.x.href} target="_blank" rel="noopener noreferrer" aria-label={externalSocialLinks.x.label}>
              <img className="footer-social-x" src={a.footerX} alt="" width={23} height={24} loading="lazy" decoding="async" />
            </a>
            <a href={externalSocialLinks.dribbble.href} target="_blank" rel="noopener noreferrer" aria-label={externalSocialLinks.dribbble.label}>
              <img src={a.footerDribbble} alt="" width={24} height={24} loading="lazy" decoding="async" />
            </a>
            <a href={externalSocialLinks.instagram.href} target="_blank" rel="noopener noreferrer" aria-label={externalSocialLinks.instagram.label}>
              <img src={a.footerInstagram} alt="" width={24} height={24} loading="lazy" decoding="async" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
