import {
  createElement as h,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getCountryCallingCode } from "react-phone-number-input";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { isDesktopHoverEnabled } from "./hoverEffects.js";

function dialCodeFor(country) {
  if (!country) return "";
  try {
    return `+${getCountryCallingCode(country)}`;
  } catch {
    return "";
  }
}

function flagFor(country) {
  if (!country) return "🌐";
  try {
    return getUnicodeFlagIcon(country);
  } catch {
    return "🏳️";
  }
}

function normalizeQuery(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function matchesCountry(option, query) {
  if (!query) return true;
  const dial = dialCodeFor(option.value).toLowerCase();
  const dialDigits = dial.replace(/\D/g, "");
  const q = query.toLowerCase();
  const qDigits = q.replace(/\D/g, "");

  if (option.label.toLowerCase().includes(q)) return true;
  if (option.value && option.value.toLowerCase().includes(q)) return true;
  if (dial.includes(q)) return true;
  if (qDigits && dialDigits.includes(qDigits)) return true;
  return false;
}

function ChevronDownIcon() {
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
      className: "icon icon-tabler icon-tabler-chevron-down",
      "aria-hidden": true,
      focusable: "false",
    },
    h("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
    h("path", { d: "M6 9l6 6l6 -6" })
  );
}

/**
 * Premium searchable country popover for react-phone-number-input.
 * Drop-in `countrySelectComponent`.
 */
export function PhoneCountrySelect({
  value,
  onChange,
  onFocus,
  onBlur,
  options = [],
  disabled,
  readOnly,
  tabIndex,
  className,
  "aria-label": ariaLabel,
}) {
  const rootRef = useRef(null);
  const popoverRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const optionRefs = useRef(new Map());
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const countries = useMemo(
    () =>
      options.filter(
        (option) => option && !option.divider && option.value
      ),
    [options]
  );

  const filtered = useMemo(() => {
    const q = normalizeQuery(query);
    return countries.filter((option) => matchesCountry(option, q));
  }, [countries, query]);

  const selected = useMemo(
    () => countries.find((option) => option.value === value) || null,
    [countries, value]
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const openMenu = useCallback(() => {
    if (disabled || readOnly) return;
    const index = Math.max(
      0,
      countries.findIndex((option) => option.value === value)
    );
    setActiveIndex(index === -1 ? 0 : index);
    setQuery("");
    setOpen(true);
  }, [countries, disabled, readOnly, value]);

  const selectCountry = useCallback(
    (code) => {
      if (!code) return;
      onChange(code);
      close();
    },
    [close, onChange]
  );

  // Scroll only the country list — never the page (Lenis fights scrollIntoView).
  const scrollOptionIntoList = useCallback((code) => {
    const list = listRef.current;
    const node = code ? optionRefs.current.get(code) : null;
    if (!list || !node) return;

    const listRect = list.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const padding = 4;

    if (nodeRect.top < listRect.top + padding) {
      list.scrollTop += nodeRect.top - listRect.top - padding;
    } else if (nodeRect.bottom > listRect.bottom - padding) {
      list.scrollTop += nodeRect.bottom - listRect.bottom + padding;
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        close();
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
    };

    // Defer so the opening click cannot immediately dismiss the menu.
    const timer = window.setTimeout(() => {
      document.addEventListener("mousedown", onPointerDown);
      document.addEventListener("touchstart", onPointerDown, { passive: true });
    }, 0);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [close, open]);

  // Non-passive wheel: scroll the country list and never the page (Lenis).
  useLayoutEffect(() => {
    if (!open) return;
    const popover = popoverRef.current;
    if (!popover) return;

    const onWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const list = listRef.current;
      if (!list || !event.deltaY) return;

      const atTop = list.scrollTop <= 0;
      const atBottom =
        list.scrollTop + list.clientHeight >= list.scrollHeight - 1;
      if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
        return;
      }
      list.scrollTop += event.deltaY;
    };

    popover.addEventListener("wheel", onWheel, { passive: false });
    return () => popover.removeEventListener("wheel", onWheel);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    searchRef.current?.focus({ preventScroll: true });
    // After paint so list overflow metrics are correct.
    const frame = window.requestAnimationFrame(() => {
      scrollOptionIntoList(value);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, scrollOptionIntoList, value]);

  useEffect(() => {
    if (!open) return;
    const code = filtered[activeIndex]?.value;
    if (code) scrollOptionIntoList(code);
  }, [activeIndex, filtered, open, scrollOptionIntoList]);

  useEffect(() => {
    setActiveIndex((prev) => {
      if (!filtered.length) return 0;
      return Math.min(prev, filtered.length - 1);
    });
  }, [filtered]);

  const onTriggerKeyDown = (event) => {
    if (disabled || readOnly) return;
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openMenu();
    }
  };

  const onSearchKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!filtered.length) return;
      setActiveIndex((prev) => (prev < 0 ? 0 : (prev + 1) % filtered.length));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!filtered.length) return;
      setActiveIndex((prev) =>
        prev < 0
          ? filtered.length - 1
          : (prev - 1 + filtered.length) % filtered.length
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex < 0) return;
      const option = filtered[activeIndex];
      if (option) selectCountry(option.value);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      if (filtered.length) setActiveIndex(filtered.length - 1);
    }
  };

  const rootClass = ["PhoneInputCountry", "phone-country", className]
    .filter(Boolean)
    .join(" ");

  return h(
    "div",
    {
      ref: rootRef,
      className: rootClass,
    },
    h(
      "button",
      {
        type: "button",
        className: "phone-country__trigger",
        tabIndex: tabIndex,
        disabled: Boolean(disabled || readOnly),
        "aria-label": ariaLabel || "Country calling code",
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        "aria-controls": open ? "phone-country-listbox" : undefined,
        onClick: (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (open) close();
          else openMenu();
        },
        onKeyDown: onTriggerKeyDown,
        onFocus,
        onBlur,
      },
      h(
        "span",
        { className: "phone-country__leading", "aria-hidden": true },
        h("span", { className: "phone-country__flag" }, flagFor(value)),
        h("span", { className: "phone-country__dial" }, dialCodeFor(value))
      )
    ),
    h(
      "button",
      {
        type: "button",
        className: [
          "phone-country__chevron-btn",
          open ? "is-open" : "",
        ]
          .filter(Boolean)
          .join(" "),
        tabIndex: -1,
        disabled: Boolean(disabled || readOnly),
        "aria-hidden": true,
        onMouseDown: (event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        onClick: (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (open) close();
          else openMenu();
        },
      },
      h(
        "span",
        { className: "phone-country__chevron" },
        h(ChevronDownIcon)
      )
    ),
    open
      ? h(
          "div",
          {
            ref: popoverRef,
            className: "phone-country__popover",
            role: "presentation",
            // Keep Lenis from scrolling the page while cursor is over the menu
            "data-lenis-prevent": "",
            onTouchMove: (event) => {
              event.stopPropagation();
            },
          },
          h(
            "div",
            { className: "phone-country__panel" },
            h(
              "div",
              { className: "phone-country__search" },
              h("input", {
                ref: searchRef,
                type: "search",
                className: "phone-country__search-input",
                placeholder: "Search",
                value: query,
                autoComplete: "off",
                autoCorrect: "off",
                spellCheck: false,
                "aria-autocomplete": "list",
                "aria-controls": "phone-country-listbox",
                "aria-activedescendant": filtered[activeIndex]
                  ? `phone-country-option-${filtered[activeIndex].value}`
                  : undefined,
                onChange: (event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                },
                onKeyDown: onSearchKeyDown,
              })
            ),
            h(
              "ul",
              {
                ref: listRef,
                id: "phone-country-listbox",
                className: "phone-country__list",
                role: "listbox",
                "aria-label": "Countries",
                "data-lenis-prevent": "",
              },
              filtered.length
                ? filtered.map((option, index) => {
                    const isSelected = option.value === value;
                    const isActive = index === activeIndex;
                    const dial = dialCodeFor(option.value);
                    return h(
                      "li",
                      {
                        key: option.value,
                        id: `phone-country-option-${option.value}`,
                        role: "option",
                        "aria-selected": isSelected,
                        className: [
                          "phone-country__option",
                          isSelected ? "is-selected" : "",
                          isActive ? "is-active" : "",
                        ]
                          .filter(Boolean)
                          .join(" "),
                        ref: (node) => {
                          if (node) optionRefs.current.set(option.value, node);
                          else optionRefs.current.delete(option.value);
                        },
                        onMouseEnter: () => {
                          if (!isDesktopHoverEnabled()) return;
                          setActiveIndex(index);
                        },
                        // Clear sticky hover as soon as the pointer leaves this row.
                        onMouseLeave: () => {
                          if (!isDesktopHoverEnabled()) return;
                          setActiveIndex((prev) => (prev === index ? -1 : prev));
                        },
                        onMouseDown: (event) => {
                          event.preventDefault();
                        },
                        onClick: () => selectCountry(option.value),
                      },
                      h(
                        "span",
                        { className: "phone-country__option-name" },
                        option.label
                      ),
                      h(
                        "span",
                        { className: "phone-country__option-dial" },
                        dial
                      )
                    );
                  })
                : h(
                    "li",
                    {
                      className: "phone-country__empty",
                      role: "presentation",
                    },
                    "No countries found"
                  )
            )
          )
        )
      : null,
    // Keep selected label for screen readers without cluttering the trigger.
    selected
      ? h(
          "span",
          { className: "visually-hidden" },
          `${selected.label} ${dialCodeFor(selected.value)}`
        )
      : null
  );
}
