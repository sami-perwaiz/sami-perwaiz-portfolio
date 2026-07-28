import { createElement as h, useEffect, useLayoutEffect, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput, {
  isSupportedCountry,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { PhoneCountrySelect } from "./PhoneCountrySelect.js";
import { QuoteSubmitButton, SUBMIT_SUCCESS_ANIM_MS } from "./QuoteSubmitButton.js";
import { DuplicateSubmissionModal } from "./DuplicateSubmissionModal.js";
import { sendQuoteEmails } from "./sendQuoteEmails.js";
import {
  CONTACT_EMAIL_RATE_WINDOW_MS,
  formatRateLimitMessage,
  getEmailRateLimit,
  recordEmailSubmission,
} from "./contactRateLimit.js";
import {
  BUDGET_MAX,
  HELP_OPTIONS,
  START_OPTIONS,
  isPhoneEmpty,
  quoteSchema,
} from "../shared/contactQuote.js";

const NAME_ALLOWED = /[^A-Za-z\s'\-]/g;
const DEFAULT_PHONE_COUNTRY = "PK";

const HOLD_MS = 2000;
const SUCCESS_HOLD_MS = 2000;

/** Apple Photos / Magic Motion — shared tab pill */
const TAB_LAYOUT_TRANSITION = {
  type: "tween",
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1],
};

const ASSET_V = "2026-07-26d";
const CONTACT_EMAIL = "samiperwaiz@gmail.com";
const CONTACT_TABS = ["social", "quote", "call"];
const SOCIAL_ICON_BASE = "/assets/contact/social";

const SOCIAL_GRID_ROWS = [
  [
    {
      id: "linkedin",
      label: "Linkedin.com",
      href: "https://www.linkedin.com/in/sami-perwaiz/",
      icon: `${SOCIAL_ICON_BASE}/linkedin.png?v=${ASSET_V}`,
    },
    {
      id: "x",
      label: "X.com",
      href: "https://x.com/uxui_sami",
      icon: `${SOCIAL_ICON_BASE}/x.png?v=${ASSET_V}`,
    },
  ],
  [
    {
      id: "dribbble",
      label: "Dribbble.com",
      href: "https://dribbble.com/samiperwaiz",
      icon: `${SOCIAL_ICON_BASE}/dribbble.png?v=${ASSET_V}`,
    },
    {
      id: "instagram",
      label: "Instagram.com",
      href: "https://www.instagram.com/uiux.sami?igsh=Znh3Z2J6Mm1ya2ho&utm_source=qr",
      icon: `${SOCIAL_ICON_BASE}/instagram.png?v=${ASSET_V}`,
    },
  ],
];

const SOCIAL_UPWORK_LINK = {
  id: "upwork",
  label: "Upwork.com",
  href: "https://www.upwork.com/",
  icon: `${SOCIAL_ICON_BASE}/upwork.png?v=${ASSET_V}`,
};

const PROJECT_ARROW_SRC = "/assets/projects/arrow-up-right.svg";

function EmailCopyIcon() {
  return h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 20,
      height: 20,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    },
    h("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
    h("path", {
      d: "M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666",
    }),
    h("path", {
      d: "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1",
    })
  );
}

function EmailCopyCheckIcon() {
  return h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 20,
      height: 20,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    },
    h("path", { d: "M5 12l5 5l10 -10" })
  );
}

function SocialExternalArrow() {
  return h(
    "span",
    {
      className: "projects-card__arrow",
      "aria-hidden": true,
    },
    h("img", {
      className: "projects-card__arrow-icon projects-card__arrow-icon--out",
      src: PROJECT_ARROW_SRC,
      alt: "",
      width: 24,
      height: 24,
      decoding: "async",
    }),
    h("img", {
      className: "projects-card__arrow-icon projects-card__arrow-icon--in",
      src: PROJECT_ARROW_SRC,
      alt: "",
      width: 24,
      height: 24,
      decoding: "async",
    })
  );
}

function focusContactTab(tabId) {
  document.getElementById(`contact-tab-${tabId}`)?.focus();
}

function handleContactTabArrowKey(event, tab, setTab) {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  event.preventDefault();
  const index = CONTACT_TABS.indexOf(tab);
  if (index < 0) return;
  const nextIndex =
    event.key === "ArrowRight"
      ? (index + 1) % CONTACT_TABS.length
      : (index - 1 + CONTACT_TABS.length) % CONTACT_TABS.length;
  const nextTab = CONTACT_TABS[nextIndex];
  setTab(nextTab);
  focusContactTab(nextTab);
}

function SocialLinkCard({ link, tabActive }) {
  return h(
    "a",
    {
      className: "contact-social__card",
      href: link.href,
      target: "_blank",
      rel: "noopener noreferrer",
      tabIndex: tabActive ? 0 : -1,
    },
    h("img", {
      className: "contact-social__icon",
      src: link.icon,
      alt: "",
      width: 30,
      height: 30,
      decoding: "async",
      "aria-hidden": true,
    }),
    h("span", { className: "contact-social__label" }, link.label),
    h(SocialExternalArrow)
  );
}

function SocialEmailCard({ tabActive }) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable.
    }
  }

  return h(
    "div",
    { className: "contact-social__card contact-social__card--email" },
    h("img", {
      className: "contact-social__icon",
      src: `${SOCIAL_ICON_BASE}/gmail.png?v=${ASSET_V}`,
      alt: "",
      width: 30,
      height: 30,
      decoding: "async",
      "aria-hidden": true,
    }),
    h(
      "a",
      {
        className: "contact-social__label contact-social__email",
        href: `mailto:${CONTACT_EMAIL}`,
        tabIndex: tabActive ? 0 : -1,
      },
      CONTACT_EMAIL
    ),
    h(
      "button",
      {
        type: "button",
        className: "privacy-page__copy-btn",
        onClick: copyEmail,
        tabIndex: tabActive ? 0 : -1,
        "aria-label": copied ? "Email copied" : "Copy email address",
      },
      h(
        "span",
        { className: "privacy-page__copy-stage", "aria-hidden": true },
        h(
          "span",
          {
            className: [
              "privacy-page__copy-icon",
              copied ? "is-exit" : "is-enter",
            ].join(" "),
          },
          h(EmailCopyIcon)
        ),
        h(
          "span",
          {
            className: [
              "privacy-page__copy-icon",
              copied ? "is-enter" : "is-exit",
            ].join(" "),
          },
          h(EmailCopyCheckIcon)
        )
      )
    )
  );
}

function SocialLinksPanel({ active }) {
  return h(
    "div",
    {
      id: "contact-panel-social",
      className: "contact-social",
      role: "tabpanel",
      "aria-labelledby": "contact-tab-social",
      "aria-hidden": active ? "false" : "true",
      ...(active ? {} : { inert: true }),
    },
    ...SOCIAL_GRID_ROWS.map((row, rowIndex) =>
      h(
        "div",
        { key: `social-row-${rowIndex}`, className: "contact-social__row" },
        ...row.map((link) =>
          h(SocialLinkCard, {
            key: link.id,
            link,
            tabActive: active,
          })
        )
      )
    ),
    h(
      "div",
      { className: "contact-social__stack" },
      h(SocialLinkCard, {
        link: SOCIAL_UPWORK_LINK,
        tabActive: active,
      }),
      h(SocialEmailCard, { tabActive: active })
    )
  );
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function countryFromLocale() {
  if (typeof navigator === "undefined") return null;
  const locales = [...(navigator.languages || []), navigator.language].filter(
    Boolean
  );
  for (const locale of locales) {
    try {
      const region = new Intl.Locale(locale).maximize().region;
      if (region && isSupportedCountry(region)) return region;
    } catch {
      const parts = String(locale).split(/[-_]/);
      const region = parts[1]?.toUpperCase();
      if (region && isSupportedCountry(region)) return region;
    }
  }
  return null;
}

async function detectVisitorCountry() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const response = await fetch("https://api.country.is/", {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (response.ok) {
      const data = await response.json();
      const code = String(data?.country || "")
        .trim()
        .toUpperCase();
      if (code && isSupportedCountry(code)) return code;
    }
  } catch {
    // Fall through to locale / default.
  }

  return countryFromLocale() || DEFAULT_PHONE_COUNTRY;
}

function toggleValue(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function formatBudgetDisplay(digits) {
  if (!digits) return "";
  const normalized = String(digits).replace(/^0+(?=\d)/, "");
  if (!normalized) return "";
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function normalizeBudgetDigits(raw, previousDigits = "") {
  let digits = String(raw ?? "").replace(/\D/g, "");
  digits = digits.replace(/^0+/, "");
  if (!digits) return { digits: "", capped: false };

  const exceeds =
    digits.length > String(BUDGET_MAX).length || Number(digits) > BUDGET_MAX;

  if (!exceeds) return { digits, capped: false };

  // Typing past the limit: keep the previous valid amount.
  if (previousDigits && Number(previousDigits) <= BUDGET_MAX) {
    return { digits: previousDigits, capped: true };
  }

  // Oversized paste with no prior value: clamp to the maximum.
  return { digits: String(BUDGET_MAX), capped: true };
}

function shouldShowError(errors, isSubmitted, name) {
  return Boolean(isSubmitted && errors[name]);
}

function FieldError({ id, message }) {
  const visible = Boolean(message);
  return h(
    "span",
    {
      id,
      className: [
        "contact-field__error",
        visible ? "is-visible" : "",
      ]
        .filter(Boolean)
        .join(" "),
      role: visible ? "alert" : undefined,
      "aria-hidden": visible ? undefined : "true",
    },
    h(
      "span",
      { className: "contact-field__error-inner" },
      h(
        "span",
        { className: "contact-field__error-text" },
        message || "\u00a0"
      )
    )
  );
}

function CheckIcon() {
  return h(
    "svg",
    {
      className: "contact-check__icon",
      width: 12,
      height: 12,
      viewBox: "0 0 12 12",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": true,
    },
    h("path", {
      d: "M10 3L4.5 8.5L2 6",
      stroke: "white",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  );
}

function CheckOption({
  name,
  value,
  checked,
  onChange,
  label,
  type = "checkbox",
  className = "",
  disabled = false,
}) {
  return h(
    "label",
    {
      className: [
        "contact-check",
        disabled ? "is-disabled" : "",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    },
    h("input", {
      className: "contact-check__input",
      type,
      name,
      value,
      checked,
      disabled,
      onChange,
    }),
    h(
      "span",
      { className: "contact-check__box", "aria-hidden": true },
      h(CheckIcon)
    ),
    h("span", { className: "contact-check__label" }, label)
  );
}

function QuoteForm({ onNavigate, active }) {
  const [defaultCountry, setDefaultCountry] = useState(DEFAULT_PHONE_COUNTRY);
  const countryLockedRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      budget: "",
      project: "",
      help: [],
      start: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const [submitState, setSubmitState] = useState("idle");
  const [rateLimitModal, setRateLimitModal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    detectVisitorCountry().then((code) => {
      if (cancelled || countryLockedRef.current) return;
      setDefaultCountry(code);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const help = watch("help") || [];
  const start = watch("start") || "";

  const fullNameReg = register("fullName");
  const emailReg = register("email");
  const projectReg = register("project");

  function clearFieldError(name) {
    if (!errors[name]) return;
    clearErrors(name);
  }

  function openPrivacy(event) {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate("/privacy-policy");
  }

  function toggleHelp(event) {
    const { value } = event.target;
    setValue("help", toggleValue(help, value), { shouldDirty: true });
  }

  function toggleStart(event) {
    const { value } = event.target;
    const next = start === value ? "" : start ? start : value;
    setValue("start", next, { shouldDirty: true });
  }

  function applyBudgetInput(raw, previousDigits, onChange) {
    const { digits } = normalizeBudgetDigits(raw, previousDigits);
    onChange(digits);
    clearFieldError("budget");
  }

  async function onValid(data) {
    setRateLimitModal(null);

    const rate = getEmailRateLimit(data.email);
    if (rate.limited) {
      const message = formatRateLimitMessage(rate.remainingMs);
      setError("email", { type: "rateLimit", message });
      setRateLimitModal({
        expiresAt: Date.now() + rate.remainingMs,
      });
      return;
    }

    setSubmitState("loading");

    try {
      await sendQuoteEmails(data);
      recordEmailSubmission(data.email);

      setSubmitState("success");
      await wait(SUBMIT_SUCCESS_ANIM_MS + SUCCESS_HOLD_MS);
      reset({
        fullName: "",
        email: "",
        phone: "",
        budget: "",
        project: "",
        help: [],
        start: "",
      });
      setRateLimitModal(null);
      setSubmitState("idle");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("[Contact form] EmailJS submit failed", {
          status: error?.status ?? null,
          text: error?.text ?? null,
          message: error?.message ?? null,
          error,
        });
      }
      setSubmitState("error");
      await wait(HOLD_MS);
      setSubmitState("idle");
    }
  }

  const show = (name) => shouldShowError(errors, isSubmitted, name);

  return h(
    "form",
    {
      id: "contact-panel-quote",
      className: "contact-form",
      role: "tabpanel",
      "aria-labelledby": "contact-tab-quote",
      "aria-hidden": active ? "false" : "true",
      ...(active ? {} : { inert: true }),
      noValidate: true,
      onSubmit: handleSubmit(onValid),
    },
    h(
      "div",
      { className: "contact-form__main" },
      h(
        "div",
        { className: "contact-form__fields" },
        h(
          "div",
          { className: "contact-form__inputs" },
          h(
            "div",
            { className: "contact-form__row" },
            h(
              "div",
              {
                className: [
                  "contact-field",
                  show("fullName") ? "has-error" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              },
              h(
                "label",
                { className: "contact-field__label", htmlFor: "fullName" },
                "Full Name"
              ),
              h("input", {
                id: "fullName",
                className: "contact-field__input",
                type: "text",
                name: fullNameReg.name,
                ref: fullNameReg.ref,
                autoComplete: "name",
                autoCapitalize: "words",
                spellCheck: false,
                "aria-invalid": show("fullName") ? "true" : "false",
                "aria-describedby": show("fullName")
                  ? "fullName-error"
                  : undefined,
                onChange: (event) => {
                  const filtered = event.target.value.replace(NAME_ALLOWED, "");
                  event.target.value = filtered;
                  fullNameReg.onChange(event);
                  clearFieldError("fullName");
                },
                onBlur: (event) => {
                  const trimmed = event.target.value
                    .trim()
                    .replace(/\s+/g, " ");
                  if (trimmed !== event.target.value) {
                    setValue("fullName", trimmed, {
                      shouldValidate: false,
                      shouldTouch: false,
                    });
                  }
                  fullNameReg.onBlur(event);
                },
              }),
              h(FieldError, {
                id: "fullName-error",
                message: show("fullName") ? errors.fullName?.message : null,
              })
            ),
            h(
              "div",
              {
                className: [
                  "contact-field",
                  show("email") ? "has-error" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              },
              h(
                "label",
                { className: "contact-field__label", htmlFor: "email" },
                "Email"
              ),
              h("input", {
                id: "email",
                className: "contact-field__input",
                type: "email",
                name: emailReg.name,
                ref: emailReg.ref,
                autoComplete: "email",
                inputMode: "email",
                autoCapitalize: "none",
                autoCorrect: "off",
                spellCheck: false,
                "aria-invalid": show("email") ? "true" : "false",
                "aria-describedby": show("email")
                  ? "email-error"
                  : undefined,
                onChange: (event) => {
                  const lower = event.target.value.toLowerCase();
                  event.target.value = lower;
                  emailReg.onChange(event);
                  clearFieldError("email");
                },
                onBlur: (event) => {
                  const normalized = event.target.value.trim().toLowerCase();
                  if (normalized !== event.target.value) {
                    setValue("email", normalized, {
                      shouldValidate: false,
                      shouldTouch: false,
                    });
                  }
                  emailReg.onBlur(event);
                },
              }),
              h(FieldError, {
                id: "email-error",
                message: show("email") ? errors.email?.message : null,
              })
            )
          ),
          h(
            "div",
            { className: "contact-form__row" },
            h(
              "div",
              {
                className: [
                  "contact-field",
                  show("phone") ? "has-error" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              },
              h(
                "label",
                { className: "contact-field__label", htmlFor: "phone" },
                "Phone"
              ),
              h(Controller, {
                name: "phone",
                control,
                render: ({ field }) =>
                  h(PhoneInput, {
                    id: "phone",
                    className: "contact-field__phone",
                    defaultCountry,
                    // National digits in the input; dial code lives next to the flag only.
                    international: false,
                    countryCallingCodeEditable: false,
                    limitMaxLength: true,
                    smartCaret: true,
                    countrySelectComponent: PhoneCountrySelect,
                    countrySelectProps: {
                      "aria-label": "Country calling code",
                    },
                    value: field.value || undefined,
                    onChange: (value) => {
                      const next = value || "";
                      if (next && !isPhoneEmpty(next)) {
                        countryLockedRef.current = true;
                      }
                      field.onChange(next);
                      clearFieldError("phone");
                    },
                    onCountryChange: () => {
                      countryLockedRef.current = true;
                      clearFieldError("phone");
                    },
                    onBlur: field.onBlur,
                    numberInputProps: {
                      className: "contact-field__phone-input",
                      autoComplete: "tel",
                      inputMode: "tel",
                      "aria-invalid": show("phone") ? "true" : "false",
                      "aria-describedby": show("phone")
                        ? "phone-error"
                        : undefined,
                    },
                  }),
              }),
              h(FieldError, {
                id: "phone-error",
                message: show("phone") ? errors.phone?.message : null,
              })
            ),
            h(
              "div",
              {
                className: [
                  "contact-field",
                  show("budget") ? "has-error" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              },
              h(
                "label",
                { className: "contact-field__label", htmlFor: "budget" },
                "Estimated Budget"
              ),
              h(Controller, {
                name: "budget",
                control,
                render: ({ field }) =>
                  h(
                    "div",
                    { className: "contact-field__currency" },
                    h(
                      "span",
                      {
                        className: "contact-field__currency-symbol",
                        "aria-hidden": true,
                      },
                      "$"
                    ),
                    h("input", {
                      id: "budget",
                      className:
                        "contact-field__input contact-field__input--currency",
                      type: "text",
                      inputMode: "numeric",
                      autoComplete: "off",
                      spellCheck: false,
                      value: formatBudgetDisplay(field.value),
                      "aria-invalid": show("budget") ? "true" : "false",
                      "aria-describedby": show("budget")
                        ? "budget-error"
                        : undefined,
                      onChange: (event) => {
                        applyBudgetInput(
                          event.target.value,
                          field.value,
                          field.onChange
                        );
                      },
                      onPaste: (event) => {
                        event.preventDefault();
                        const pasted =
                          event.clipboardData?.getData("text") ?? "";
                        applyBudgetInput(pasted, "", field.onChange);
                      },
                      onBlur: field.onBlur,
                      onKeyDown: (event) => {
                        if (
                          event.key.length === 1 &&
                          !/[0-9]/.test(event.key) &&
                          !event.metaKey &&
                          !event.ctrlKey &&
                          !event.altKey
                        ) {
                          event.preventDefault();
                        }
                      },
                    })
                  ),
              }),
              h(FieldError, {
                id: "budget-error",
                message: show("budget") ? errors.budget?.message : null,
              })
            )
          ),
          h(
            "div",
            {
              className: [
                "contact-field",
                "contact-field--area",
                show("project") ? "has-error" : "",
              ]
                .filter(Boolean)
                .join(" ")
            },
            h(
              "label",
              { className: "contact-field__label", htmlFor: "project" },
              "Tell Us About Your Project"
            ),
            h("textarea", {
              id: "project",
              className: "contact-field__input contact-field__input--area",
              name: projectReg.name,
              ref: projectReg.ref,
              rows: 4,
              "aria-invalid": show("project") ? "true" : "false",
              "aria-describedby": show("project")
                ? "project-error"
                : undefined,
              onChange: (event) => {
                projectReg.onChange(event);
                clearFieldError("project");
              },
              onBlur: (event) => {
                const trimmed = event.target.value.trim();
                if (trimmed !== event.target.value) {
                  setValue("project", trimmed, {
                    shouldValidate: false,
                    shouldTouch: false,
                  });
                }
                projectReg.onBlur(event);
              },
            }),
            h(FieldError, {
              id: "project-error",
              message: show("project") ? errors.project?.message : null,
            })
          )
        ),
        h(
          "div",
          { className: "contact-form__option-groups" },
          h(
            "fieldset",
            { className: "contact-form__group" },
            h(
              "legend",
              { className: "contact-form__group-label" },
              "What are you looking to create?"
            ),
            h(
              "div",
              { className: "contact-form__options" },
              ...HELP_OPTIONS.map((option) =>
                h(CheckOption, {
                  key: option,
                  name: "help",
                  value: option,
                  label: option,
                  checked: help.includes(option),
                  onChange: toggleHelp,
                })
              )
            )
          ),
          h(
            "fieldset",
            {
              className: "contact-form__group contact-form__group--start"
            },
            h(
              "legend",
              { className: "contact-form__group-label" },
              "When would you like to get started? (Optional)"
            ),
            h(
              "div",
              {
                className:
                  "contact-form__options contact-form__options--start",
              },
              ...START_OPTIONS.map((option) =>
                h(CheckOption, {
                  key: option,
                  type: "checkbox",
                  name: "start",
                  value: option,
                  label: option,
                  checked: start === option,
                  disabled: Boolean(start) && start !== option,
                  onChange: toggleStart,
                })
              )
            )
          )
        )
      ),
      h(QuoteSubmitButton, { state: submitState }),
      h(DuplicateSubmissionModal, {
        open: Boolean(rateLimitModal),
        expiresAt: rateLimitModal?.expiresAt ?? 0,
        windowHours: CONTACT_EMAIL_RATE_WINDOW_MS / (60 * 60 * 1000),
        onClose: () => setRateLimitModal(null),
      })
    ),
    h(
      "p",
      { className: "contact-form__legal" },
      "By submitting this form, you confirm that you've read and agreed to the ",
      h(
        "a",
        {
          className: "contact-form__legal-link",
          href: "/privacy-policy",
          onClick: openPrivacy,
        },
        "Privacy Policy"
      ),
      ". Your information will only be used to respond to your enquiry and will always be handled securely and confidentially."
    )
  );
}

export function ContactSection({ onNavigate, restoreInstant = false }) {
  const [tab, setTab] = useState("social");
  const [holdInstant, setHoldInstant] = useState(restoreInstant);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!restoreInstant) return undefined;
    setHoldInstant(true);
    let outer = 0;
    let inner = 0;
    outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setHoldInstant(false));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [restoreInstant]);

  const instant = Boolean(restoreInstant || holdInstant || reduceMotion);
  const pillTransition = instant ? { duration: 0 } : TAB_LAYOUT_TRANSITION;

  function openPrivacy(event) {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate("/privacy-policy");
  }

  const tabPill = h(motion.span, {
    ...(instant ? {} : { layoutId: "contact-tab-pill" }),
    className: "contact-tabs__indicator",
    "aria-hidden": true,
    transition: pillTransition,
  });

  return h(
    "section",
    {
      className: [
        "contact-section",
        instant ? "contact-section--instant" : "",
      ]
        .filter(Boolean)
        .join(" "),
      id: "contact",
      "aria-label": "Contact",
      "data-scroll-section": "contact",
    },
    h(
      "div",
      { className: "contact-section__inner" },
      h(
        "h2",
        { className: "contact-section__title" },
        "Your Next Step Starts Here"
      ),
      h(
        "div",
        { className: "contact-section__panel" },
        h(
          LayoutGroup,
          null,
          h(
            "div",
            {
              className: "contact-tabs",
              role: "tablist",
              "aria-label": "Contact options",
              "data-active": tab,
            },
            h(
              "button",
              {
                type: "button",
                role: "tab",
                id: "contact-tab-social",
                className: [
                  "contact-tabs__btn",
                  tab === "social" ? "is-active" : "",
                ]
                  .filter(Boolean)
                  .join(" "),
                "aria-selected": tab === "social",
                "aria-controls": "contact-panel-social",
                tabIndex: tab === "social" ? 0 : -1,
                onClick: () => setTab("social"),
                onKeyDown: (e) => handleContactTabArrowKey(e, tab, setTab),
              },
              tab === "social" ? tabPill : null,
              h("span", { className: "contact-tabs__label" }, "Social Links")
            ),
            h(
              "button",
              {
                type: "button",
                role: "tab",
                id: "contact-tab-quote",
                className: [
                  "contact-tabs__btn",
                  tab === "quote" ? "is-active" : "",
                ]
                  .filter(Boolean)
                  .join(" "),
                "aria-selected": tab === "quote",
                "aria-controls": "contact-panel-quote",
                tabIndex: tab === "quote" ? 0 : -1,
                onClick: () => setTab("quote"),
                onKeyDown: (e) => handleContactTabArrowKey(e, tab, setTab),
              },
              tab === "quote" ? tabPill : null,
              h("span", { className: "contact-tabs__label" }, "Send a Quote")
            ),
            h(
              "button",
              {
                type: "button",
                role: "tab",
                id: "contact-tab-call",
                className: [
                  "contact-tabs__btn",
                  tab === "call" ? "is-active" : "",
                ]
                  .filter(Boolean)
                  .join(" "),
                "aria-selected": tab === "call",
                "aria-controls": "contact-panel-call",
                tabIndex: tab === "call" ? 0 : -1,
                onClick: () => setTab("call"),
                onKeyDown: (e) => handleContactTabArrowKey(e, tab, setTab),
              },
              tab === "call" ? tabPill : null,
              h("span", { className: "contact-tabs__label" }, "Book a Call")
            )
          )
        ),
        h(
          "div",
          { className: "contact-section__panels" },
          h(
            "div",
            {
              className: [
                "contact-panel-slot",
                tab === "social" ? "is-open" : "",
              ]
                .filter(Boolean)
                .join(" "),
            },
            h(
              "div",
              { className: "contact-panel-slot__inner" },
              h(SocialLinksPanel, {
                active: tab === "social",
              })
            )
          ),
          h(
            "div",
            {
              className: [
                "contact-panel-slot",
                tab === "quote" ? "is-open" : "",
              ]
                .filter(Boolean)
                .join(" "),
            },
            h(
              "div",
              { className: "contact-panel-slot__inner" },
              h(QuoteForm, { onNavigate, active: tab === "quote" })
            )
          ),
          h(
            "div",
            {
              className: [
                "contact-panel-slot",
                tab === "call" ? "is-open" : "",
              ]
                .filter(Boolean)
                .join(" "),
            },
            h(
              "div",
              { className: "contact-panel-slot__inner" },
              h(
                "div",
                {
                  id: "contact-panel-call",
                  className: "contact-call",
                  role: "tabpanel",
                  "aria-labelledby": "contact-tab-call",
                  "aria-hidden": tab === "call" ? "false" : "true",
                  ...(tab === "call" ? {} : { inert: true }),
                },
              h(
                "div",
                { className: "contact-call__card" },
                h("img", {
                  className: "contact-call__card-icon",
                  src: "/assets/contact/google-meet.svg",
                  alt: "",
                  width: 50,
                  height: 50,
                  decoding: "async",
                  "aria-hidden": true,
                }),
                h(
                  "div",
                  { className: "contact-call__card-copy" },
                  h(
                    "h3",
                    { className: "contact-call__card-title" },
                    "Let’s Talk About Your Project"
                  ),
                  h(
                    "p",
                    { className: "contact-call__card-desc" },
                    "Every great project starts with a conversation. Share your plans with us, and we’ll take it from there."
                  )
                )
              ),
              h(
                "a",
                {
                  className: "contact-form__submit contact-call__btn",
                  href: "https://calendar.app.google/9YiA2LUHMbkevFS39",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  tabIndex: tab === "call" ? 0 : -1,
                },
                h(
                  "span",
                  { className: "contact-form__submit-label-swap" },
                  h(
                    "span",
                    { className: "contact-form__submit-label-track" },
                    h(
                      "span",
                      { className: "contact-form__submit-label-line" },
                      "Book a Call"
                    ),
                    h(
                      "span",
                      {
                        className: "contact-form__submit-label-line",
                        "aria-hidden": true,
                      },
                      "Book a Call"
                    )
                  )
                )
              ),
              h(
                "p",
                { className: "contact-form__legal" },
                "By booking a call, you confirm that you’ve read and agreed to our ",
                h(
                  "a",
                  {
                    className: "contact-form__legal-link",
                    href: "/privacy-policy",
                    onClick: openPrivacy,
                    tabIndex: tab === "call" ? 0 : -1,
                  },
                  "Privacy Policy"
                ),
                "."
              )
            )
          )
        )
        )
      )
    )
  );
}

