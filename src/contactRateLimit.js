/** Per-email contact form rate limit (client-side). */

const STORAGE_KEY = "sami-contact-email-rate";
export const CONTACT_EMAIL_RATE_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function readStore() {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Quota / private mode — fail open for UX; limit simply won't persist.
  }
}

function pruneExpired(store, now = Date.now()) {
  let changed = false;
  for (const key of Object.keys(store)) {
    const at = store[key];
    if (typeof at !== "number" || at + CONTACT_EMAIL_RATE_WINDOW_MS <= now) {
      delete store[key];
      changed = true;
    }
  }
  return changed;
}

/**
 * @returns {{ limited: false } | { limited: true, remainingMs: number }}
 */
export function getEmailRateLimit(email) {
  const key = normalizeEmail(email);
  if (!key) return { limited: false };

  const store = readStore();
  if (pruneExpired(store)) writeStore(store);

  const lastAt = store[key];
  if (typeof lastAt !== "number") return { limited: false };

  const remainingMs = lastAt + CONTACT_EMAIL_RATE_WINDOW_MS - Date.now();
  if (remainingMs <= 0) {
    delete store[key];
    writeStore(store);
    return { limited: false };
  }

  return { limited: true, remainingMs };
}

/** Call only after a successful send. */
export function recordEmailSubmission(email) {
  const key = normalizeEmail(email);
  if (!key) return;

  const store = readStore();
  pruneExpired(store);
  store[key] = Date.now();
  writeStore(store);
}

export function formatRateLimitMessage(remainingMs) {
  const totalMin = Math.max(1, Math.ceil(remainingMs / 60000));

  if (totalMin >= 120) {
    return "You've already sent a message with this email. Please wait about 2 hours before submitting again.";
  }

  if (totalMin >= 60) {
    const hours = Math.floor(totalMin / 60);
    const minutes = totalMin % 60;
    const hourLabel = hours === 1 ? "1 hour" : `${hours} hours`;
    if (minutes === 0) {
      return `You've already sent a message with this email. Please wait about ${hourLabel} before submitting again.`;
    }
    const minuteLabel = minutes === 1 ? "1 minute" : `${minutes} minutes`;
    return `You've already sent a message with this email. Please wait about ${hourLabel} and ${minuteLabel} before submitting again.`;
  }

  const minuteLabel = totalMin === 1 ? "1 minute" : `${totalMin} minutes`;
  return `You've already sent a message with this email. Please wait about ${minuteLabel} before submitting again.`;
}

/** Compact countdown for the duplicate-submission modal — e.g. "1h 23m 51s". */
export function formatCountdown(remainingMs) {
  const totalSec = Math.max(0, Math.ceil(remainingMs / 1000));
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
