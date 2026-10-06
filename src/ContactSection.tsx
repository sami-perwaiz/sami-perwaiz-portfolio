import { useEffect, useRef, useState } from "react";
import { a } from "./assets";
import { externalSocialLinks } from "./externalLinks";

const EMAIL = "samiperwaiz@gmail.com";

function ExternalArrow() {
  return (
    <div className="ext-wrap" aria-hidden="true">
      <div className="ext-track">
        <img className="ext-arrow" src={a.external} alt="" />
        <img className="ext-arrow ext-arrow--enter" src={a.external} alt="" />
      </div>
    </div>
  );
}

function CopyButton() {
  const [copied, setCopied] = useState(false);
  const resetTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeout.current) window.clearTimeout(resetTimeout.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      if (resetTimeout.current) window.clearTimeout(resetTimeout.current);
      resetTimeout.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <button type="button" className="copy-wrap" onClick={handleCopy} aria-label="Copy email">
      <img className={`copy-icon${copied ? "" : " is-visible"}`} src={a.copy} alt="" loading="lazy" decoding="async" />
      <img className={`copy-icon copy-icon--check${copied ? " is-visible" : ""}`} src={a.check} alt="" loading="lazy" decoding="async" />
    </button>
  );
}

export default function ContactSection({ id = "contact" }: { id?: string }) {
  return (
    <section className="social" id={id}>
      <div className="social-inner">
        <p className="social-title sf sf-reg">Your Next Step Starts Here</p>
        <div className="social-grid">
          <div className="social-pair">
            <a
              className="social-item"
              href={externalSocialLinks.linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={externalSocialLinks.linkedin.label}
            >
              <div className="social-item-inner">
                <img className="logo" src={a.linkedin} alt="" loading="lazy" decoding="async" />
                <span className="sf sf-med">LinkedIn.com</span>
                <ExternalArrow />
              </div>
            </a>
            <a
              className="social-item"
              href={externalSocialLinks.x.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={externalSocialLinks.x.label}
            >
              <div className="social-item-inner">
                <img className="logo round" src={a.iconX} alt="" loading="lazy" decoding="async" />
                <span className="sf sf-med">X.com</span>
                <ExternalArrow />
              </div>
            </a>
          </div>
          <div className="social-pair">
            <a
              className="social-item"
              href={externalSocialLinks.dribbble.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={externalSocialLinks.dribbble.label}
            >
              <div className="social-item-inner">
                <img className="logo round" src={a.iconDribbble} alt="" loading="lazy" decoding="async" />
                <span className="sf sf-med">Dribbble.com</span>
                <ExternalArrow />
              </div>
            </a>
            <a
              className="social-item"
              href={externalSocialLinks.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={externalSocialLinks.instagram.label}
            >
              <div className="social-item-inner">
                <img className="logo" src={a.instagram} alt="" loading="lazy" decoding="async" />
                <span className="sf sf-med">Instagram.com</span>
                <ExternalArrow />
              </div>
            </a>
          </div>
          <a
            className="social-item full"
            href={externalSocialLinks.upwork.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={externalSocialLinks.upwork.label}
          >
            <div className="social-item-inner">
              <img className="logo round" src={a.iconUpwork} alt="" loading="lazy" decoding="async" />
              <span className="sf sf-med">Upwork.com</span>
              <ExternalArrow />
            </div>
          </a>
          <div className="social-item full">
            <div className="social-item-inner">
              <img className="logo round" src={a.iconEmail} alt="" loading="lazy" decoding="async" />
              <span className="sf sf-reg">{EMAIL}</span>
              <CopyButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
