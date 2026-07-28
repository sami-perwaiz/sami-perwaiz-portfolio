import { createElement as h } from "react";
import { NotFoundPage } from "../NotFoundPage.js";

export function NotFound({ onNavigate }) {
  return h(NotFoundPage, { key: "not-found", onNavigate });
}
