import { useState, useEffect } from "react";

export type Currency = "SAR" | "INR" | "PKR" | "USD" | "AED";
export type Language = "en" | "hi" | "ur" | "ar";
export type Theme = "green" | "blue" | "dark";

export interface Settings {
  currency: Currency;
  language: Language;
  darkMode: boolean;
  theme: Theme;
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  SAR: "ر.س",
  INR: "₹",
  PKR: "₨",
  USD: "$",
  AED: "د.إ",
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  SAR: "SAR – Saudi Riyal",
  INR: "INR – Indian Rupee",
  PKR: "PKR – Pakistani Rupee",
  USD: "USD – US Dollar",
  AED: "AED – UAE Dirham",
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  hi: "हिंदी (Hindi)",
  ur: "اردو (Urdu)",
  ar: "العربية (Arabic)",
};

const DEFAULTS: Settings = {
  currency: "INR",
  language: "en",
  darkMode: false,
  theme: "green",
};

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem("sk_settings");
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function applySettings(s: Settings) {
  const root = document.documentElement;
  root.classList.toggle("dark", s.darkMode);
  root.setAttribute("data-theme", s.theme);
  root.dir = s.language === "ar" || s.language === "ur" ? "rtl" : "ltr";
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const s = loadSettings();
    applySettings(s);
    return s;
  });

  useEffect(() => {
    localStorage.setItem("sk_settings", JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  return {
    settings,
    update,
    currencySymbol: CURRENCY_SYMBOLS[settings.currency],
  };
}
