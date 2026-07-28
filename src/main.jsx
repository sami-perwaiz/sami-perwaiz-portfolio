import { createElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.js";
import "../styles.css";

if (typeof history !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

if (typeof window !== "undefined") {
  const path = window.location.pathname;
  const hash = (window.location.hash || "").replace(/^#/, "");
  if ((path === "/" || path === "") && (!hash || hash === "hero")) {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}

createRoot(document.getElementById("root")).render(
  createElement(
    StrictMode,
    null,
    createElement(BrowserRouter, null, createElement(App))
  )
);
