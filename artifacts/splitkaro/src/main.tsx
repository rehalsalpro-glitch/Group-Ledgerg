import { createRoot } from "react-dom/client";
import App from "./App";
import { SettingsProvider } from "./useSettings";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <SettingsProvider>
    <App />
  </SettingsProvider>
);
