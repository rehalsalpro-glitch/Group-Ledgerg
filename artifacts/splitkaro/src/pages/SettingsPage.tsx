import { useState } from "react";
import {
  ArrowLeft, DollarSign, Globe, Moon, Palette,
  Share2, Star, Info, ChevronDown, ChevronRight, Check, Shield
} from "lucide-react";
import {
  useSettings,
  CURRENCY_LABELS, LANGUAGE_LABELS,
  type Currency, type Language, type Theme
} from "../useSettings";

interface Props { onBack: () => void; }

const CURRENCIES: Currency[] = ["SAR", "INR", "PKR", "USD", "AED"];
const LANGUAGES: Language[] = ["en", "hi", "ur", "ar"];
const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: "green", label: "Green", color: "bg-emerald-500" },
  { id: "blue",  label: "Blue",  color: "bg-blue-500"    },
  { id: "dark",  label: "Dark",  color: "bg-slate-700"   },
];

export default function SettingsPage({ onBack }: Props) {
  const { settings, update, t } = useSettings();
  const [openPicker, setOpenPicker] = useState<"currency" | "language" | null>(null);

  function togglePicker(p: "currency" | "language") {
    setOpenPicker(prev => prev === p ? null : p);
  }

  function handleShareApp() {
    const text = `🧾 *SplitKaro – Hisab App*\nTrack shared expenses & split bills easily!\nTry it now: https://splitkaro.replit.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-card border-b border-border shadow-sm flex-shrink-0">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary active:scale-90 transition-transform">
          <ArrowLeft size={17} className="text-foreground" />
        </button>
        <h2 className="text-base font-bold text-foreground">{t("settings")}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* ── General ───────────────────────────────────────── */}
        <SectionLabel>{t("general")}</SectionLabel>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

          {/* Currency */}
          <button onClick={() => togglePicker("currency")} className="w-full flex items-center px-4 py-3.5 gap-3 active:bg-secondary transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <DollarSign size={15} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">{t("currency")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{CURRENCY_LABELS[settings.currency]}</p>
            </div>
            {openPicker === "currency" ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronRight size={16} className="text-muted-foreground" />}
          </button>
          {openPicker === "currency" && (
            <div className="border-t border-border bg-background">
              {CURRENCIES.map(c => (
                <button key={c} onClick={() => { update("currency", c); setOpenPicker(null); }} className="w-full flex items-center justify-between px-5 py-3 active:bg-secondary transition-colors">
                  <span className="text-sm text-foreground">{CURRENCY_LABELS[c]}</span>
                  {settings.currency === c && <Check size={15} className="text-primary" />}
                </button>
              ))}
            </div>
          )}

          <div className="mx-4 border-t border-border" />

          {/* Language */}
          <button onClick={() => togglePicker("language")} className="w-full flex items-center px-4 py-3.5 gap-3 active:bg-secondary transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Globe size={15} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">{t("language")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{LANGUAGE_LABELS[settings.language]}</p>
            </div>
            {openPicker === "language" ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronRight size={16} className="text-muted-foreground" />}
          </button>
          {openPicker === "language" && (
            <div className="border-t border-border bg-background">
              {LANGUAGES.map(l => (
                <button key={l} onClick={() => { update("language", l); setOpenPicker(null); }} className="w-full flex items-center justify-between px-5 py-3 active:bg-secondary transition-colors">
                  <span className="text-sm text-foreground">{LANGUAGE_LABELS[l]}</span>
                  {settings.language === l && <Check size={15} className="text-primary" />}
                </button>
              ))}
            </div>
          )}

          <div className="mx-4 border-t border-border" />

          {/* Dark Mode */}
          <div className="flex items-center px-4 py-3.5 gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Moon size={15} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">{t("darkMode")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{settings.darkMode ? t("on") : t("off")}</p>
            </div>
            <button
              onClick={() => update("darkMode", !settings.darkMode)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${settings.darkMode ? "bg-primary" : "bg-secondary"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${settings.darkMode ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        {/* ── Appearance ────────────────────────────────────── */}
        <SectionLabel>{t("appearance")}</SectionLabel>
        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center px-4 py-3.5 gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Palette size={15} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{t("themeColor")}</p>
              <div className="flex gap-4 mt-2.5">
                {THEMES.map(th => (
                  <button key={th.id} onClick={() => update("theme", th.id)} className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform">
                    <div className={`w-9 h-9 rounded-full ${th.color} flex items-center justify-center shadow-sm ${settings.theme === th.id ? "ring-2 ring-offset-2 ring-primary" : ""}`}>
                      {settings.theme === th.id && <Check size={16} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground">{th.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Share & Support ───────────────────────────────── */}
        <SectionLabel>{t("shareSupport")}</SectionLabel>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <button onClick={handleShareApp} className="w-full flex items-center px-4 py-3.5 gap-3 active:bg-secondary transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
              <Share2 size={15} className="text-[#25D366]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">{t("shareApp")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("shareAppHint")}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>

          <div className="mx-4 border-t border-border" />

          <button onClick={() => window.open("https://play.google.com/store", "_blank")} className="w-full flex items-center px-4 py-3.5 gap-3 active:bg-secondary transition-colors">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Star size={15} className="text-yellow-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">{t("rateApp")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("rateAppHint")}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* ── About ─────────────────────────────────────────── */}
        <SectionLabel>{t("about")}</SectionLabel>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center px-4 py-3.5 gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-black">S</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">SplitKaro – Hisab App</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("version")} 1.0.0</p>
            </div>
            <Info size={16} className="text-muted-foreground" />
          </div>

          <div className="mx-4 border-t border-border" />

          <div className="px-4 py-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield size={15} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">{t("privacyPolicy")}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{t("privacyText")}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-2">{t("madeWith")}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">{children}</p>;
}
