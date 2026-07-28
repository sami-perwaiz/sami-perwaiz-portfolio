import emailjs from "@emailjs/browser";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { formatBudgetLabel } from "../shared/contactQuote.js";

/**
 * Exact EmailJS credentials.
 * @see https://www.emailjs.com/docs/sdk/send/
 */
const SERVICE_ID = "service_xg3c5ch";
const CONTACT_TEMPLATE_ID = "template_vnubcob";
const AUTO_REPLY_TEMPLATE_ID = "template_ig56u4u";
const PUBLIC_KEY = "hCeKq4xgc1XwXP_6l";

/** ~1s gap — EmailJS rate limit is 1 request per second. */
const SEND_GAP_MS = 1000;

/** Contact template variables — exact keys and order. */
const TEMPLATE_KEYS = [
  "name",
  "email",
  "phone",
  "service",
  "budget",
  "start",
  "message",
];

let initialized = false;

function ensureInit() {
  if (initialized) return;
  emailjs.init({ publicKey: PUBLIC_KEY });
  initialized = true;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Always returns a string — never undefined or null. */
function str(value, fallback = "—") {
  if (value === undefined || value === null) return fallback;
  const text = String(value).trim();
  return text.length ? text : fallback;
}

function formatPhoneDisplay(value) {
  if (value === undefined || value === null || value === "") {
    return "—";
  }
  const phone = parsePhoneNumberFromString(String(value));
  if (phone) {
    try {
      return phone.formatInternational();
    } catch {
      // fall through
    }
  }
  return str(value);
}

/**
 * Build templateParams with EXACTLY:
 * { name, email, phone, service, budget, start, message }
 *
 * Form mapping:
 *   fullName → name
 *   email    → email
 *   phone    → phone
 *   help[]   → service
 *   budget   → budget
 *   start    → start
 *   project  → message
 */
export function buildQuoteTemplateParams(form) {
  const serviceList = Array.isArray(form?.help)
    ? form.help.filter(Boolean)
    : [];

  const mapped = {
    name: str(form?.fullName),
    email: str(form?.email, ""),
    phone: formatPhoneDisplay(form?.phone),
    service: serviceList.length ? serviceList.join(", ") : "—",
    budget: str(formatBudgetLabel(form?.budget)),
    start: str(form?.start),
    message: str(form?.project),
  };

  // Exact key set only — no extras
  const templateParams = {};
  for (const key of TEMPLATE_KEYS) {
    templateParams[key] = str(mapped[key]);
  }
  return templateParams;
}

function logDevError(error) {
  if (!import.meta.env.DEV) return;

  console.error("FULL EMAILJS ERROR", error);
  if (error?.status) console.error("STATUS:", error.status);
  if (error?.text) console.error("TEXT:", error.text);
  if (error?.message) console.error("MESSAGE:", error.message);
  try {
    console.error(
      "ERROR JSON:",
      JSON.stringify(error, Object.getOwnPropertyNames(Object(error)), 2)
    );
  } catch {
    console.error("ERROR STRING:", String(error));
  }
}

async function sendOne(templateId, templateParams) {
  if (import.meta.env.DEV) {
    console.log("SERVICE:", SERVICE_ID);
    console.log("TEMPLATE:", templateId);
    console.log("PUBLIC KEY:", PUBLIC_KEY);
    console.log("PARAMS:", JSON.stringify(templateParams, null, 2));
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      templateId,
      templateParams
    );

    if (response?.status !== 200) {
      const err = new Error(
        `EmailJS returned unexpected status ${response?.status}: ${response?.text}`
      );
      err.status = response?.status;
      err.text = response?.text;
      throw err;
    }

    return response;
  } catch (error) {
    logDevError(error);
    throw error;
  }
}

/**
 * 1) Contact template
 * 2) Wait ~1s
 * 3) Auto Reply template
 * Both must return HTTP 200.
 */
export async function sendQuoteEmails(formData) {
  ensureInit();

  const templateParams = buildQuoteTemplateParams(formData);

  await sendOne(CONTACT_TEMPLATE_ID, templateParams);
  await wait(SEND_GAP_MS);
  await sendOne(AUTO_REPLY_TEMPLATE_ID, templateParams);

  return { ok: true };
}
