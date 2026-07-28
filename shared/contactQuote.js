import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";

export const HELP_OPTIONS = [
  "Product Design",
  "Branding",
  "Framer & Webflow Development",
];

export const START_OPTIONS = [
  "As soon as possible",
  "Within the next month",
  "In a few months",
];

export const BUDGET_MAX = 1_000_000;

const BUDGET_MAX_MESSAGE = "Maximum project budget is $1,000,000.";
const PHONE_MOBILE_ERROR =
  "Please enter a valid mobile number for the selected country.";

const NAME_PATTERN = /^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/;
const MOBILE_NUMBER_TYPES = new Set(["MOBILE", "FIXED_LINE_OR_MOBILE"]);

export function isPhoneEmpty(value) {
  if (!value) return true;
  return /^\+\d{1,4}$/.test(value);
}

function isValidMobileForCountry(value) {
  if (isPhoneEmpty(value)) return false;
  const phone = parsePhoneNumberFromString(value);
  if (!phone || !phone.isValid()) return false;
  return MOBILE_NUMBER_TYPES.has(phone.getType());
}

function phoneValidationMessage(value) {
  if (!isValidMobileForCountry(value)) {
    return PHONE_MOBILE_ERROR;
  }
  return null;
}

export const quoteSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your full name.")
    .regex(NAME_PATTERN, "Use letters, spaces, hyphens, or apostrophes only"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter a valid email address.")
    .email("Please enter a valid email address."),
  phone: z.string().superRefine((value, ctx) => {
    const message = phoneValidationMessage(value);
    if (message) {
      ctx.addIssue({ code: "custom", message });
    }
  }),
  budget: z
    .string()
    .min(1, "Please enter your estimated budget.")
    .regex(/^\d+$/, "Please enter your estimated budget.")
    .refine((value) => Number(value) > 0, {
      message: "Please enter your estimated budget.",
    })
    .refine((value) => Number(value) <= BUDGET_MAX, {
      message: BUDGET_MAX_MESSAGE,
    }),
  project: z.string().trim().min(1, "Please tell us about your project."),
  help: z.array(z.string()).default([]),
  start: z.string().default(""),
});

export function formatBudgetLabel(digits) {
  const amount = Number(digits);
  if (!Number.isFinite(amount)) return "—";
  return `$${amount.toLocaleString("en-US")}`;
}
