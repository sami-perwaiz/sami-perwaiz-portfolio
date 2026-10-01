import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ExternalLinkConfirmation from "./ExternalLinkConfirmation";
import "./styles.css";
import "./page-transitions.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ExternalLinkConfirmation>
      <App />
    </ExternalLinkConfirmation>
  </StrictMode>,
);
