import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import "./external-link-confirmation.css";

type PendingLink = {
  href: string;
  name: string;
  target: string;
};

const EXIT_DURATION = 220;

function getExternalDestination(anchor: HTMLAnchorElement) {
  const rawHref = anchor.getAttribute("href")?.trim();
  if (!rawHref || anchor.hasAttribute("download")) return null;

  let url: URL;
  try {
    url = new URL(rawHref, window.location.href);
  } catch {
    return null;
  }

  if (url.protocol === "http:" || url.protocol === "https:") {
    return url.origin === window.location.origin ? null : url;
  }

  return url.protocol === "mailto:" || url.protocol === "tel:" ? url : null;
}

function getDestinationName(anchor: HTMLAnchorElement, url: URL) {
  const metadataLabel = anchor.dataset.externalLabel?.trim();
  if (metadataLabel) return metadataLabel;

  const accessibleLabel = anchor.getAttribute("aria-label")?.trim();
  if (accessibleLabel) return accessibleLabel;

  const visibleLabel = anchor.textContent?.replace(/\s+/g, " ").trim();
  if (visibleLabel) return visibleLabel;

  if (url.protocol === "mailto:") return "Email";
  if (url.protocol === "tel:") return "Phone";

  const hostname = url.hostname.replace(/^www\./, "");
  const label = hostname.split(".")[0]?.replace(/[-_]+/g, " ") || "this website";
  return label.replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function ExternalLinkConfirmation({ children }: { children: ReactNode }) {
  const [pendingLink, setPendingLink] = useState<PendingLink | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const openFrame = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLAnchorElement | null>(null);
  const hasPendingLink = pendingLink !== null;

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const closeDialog = useCallback(() => {
    clearCloseTimer();
    setIsOpen(false);
    const exitDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : EXIT_DURATION;
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      setPendingLink(null);
    }, exitDuration);
  }, [clearCloseTimer]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const element = event.target instanceof Element ? event.target : null;
      const anchor = element?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const destination = getExternalDestination(anchor);
      if (!destination) return;

      event.preventDefault();
      clearCloseTimer();
      restoreFocusRef.current = anchor;
      setPendingLink({
        href: destination.href,
        name: getDestinationName(anchor, destination),
        target: anchor.target || (event.metaKey || event.ctrlKey || event.shiftKey ? "_blank" : "_self"),
      });
      setIsOpen(false);

      if (openFrame.current !== null) window.cancelAnimationFrame(openFrame.current);
      openFrame.current = window.requestAnimationFrame(() => {
        openFrame.current = window.requestAnimationFrame(() => {
          openFrame.current = null;
          setIsOpen(true);
        });
      });
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [clearCloseTimer]);

  useEffect(() => {
    if (!hasPendingLink) return;

    const root = document.getElementById("root");
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const bodyPaddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;

    if (root) root.inert = true;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      if (root) root.inert = false;

      const trigger = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (trigger?.isConnected) window.requestAnimationFrame(() => trigger.focus());
    };
  }, [hasPendingLink]);

  useEffect(() => {
    if (!pendingLink || !isOpen) return;
    const focusFrame = window.requestAnimationFrame(() => openButtonRef.current?.focus());
    return () => window.cancelAnimationFrame(focusFrame);
  }, [isOpen, pendingLink]);

  useEffect(() => {
    if (!pendingLink) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"),
      );
      if (controls.length === 0) return;

      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeDialog, pendingLink]);

  useEffect(
    () => () => {
      clearCloseTimer();
      if (openFrame.current !== null) window.cancelAnimationFrame(openFrame.current);
    },
    [clearCloseTimer],
  );

  const handleOpenLink = () => {
    if (!pendingLink) return;
    const { href, target } = pendingLink;
    closeDialog();

    if (target && target !== "_self") {
      window.open(href, target, target === "_blank" ? "noopener,noreferrer" : undefined);
      return;
    }

    window.location.assign(href);
  };

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) closeDialog();
  };

  return (
    <>
      {children}
      {pendingLink
        ? createPortal(
            <div
              className={`external-link-overlay${isOpen ? " external-link-overlay--open" : ""}`}
              onClick={handleBackdropClick}
            >
              <div
                ref={dialogRef}
                className="external-link-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="external-link-dialog-title"
                aria-describedby="external-link-dialog-description"
              >
                <div className="external-link-dialog-copy">
                  <h2 id="external-link-dialog-title">Open this link?</h2>
                  <p id="external-link-dialog-description">
                    You're about to open <strong>{pendingLink.name}</strong>. You’ll be redirected to the selected page.
                  </p>
                </div>
                <div className="external-link-dialog-actions">
                  <button
                    ref={openButtonRef}
                    className="external-link-dialog-open"
                    type="button"
                    onClick={handleOpenLink}
                  >
                    Open Link
                  </button>
                  <button
                    className="external-link-dialog-cancel"
                    type="button"
                    onClick={closeDialog}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
