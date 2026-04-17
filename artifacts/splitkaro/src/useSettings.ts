import { createContext, useContext, useState, useEffect, createElement, type ReactNode } from "react";

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
  SAR: "ر.س", INR: "₹", PKR: "₨", USD: "$", AED: "د.إ",
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  SAR: "SAR – Saudi Riyal", INR: "INR – Indian Rupee",
  PKR: "PKR – Pakistani Rupee", USD: "USD – US Dollar", AED: "AED – UAE Dirham",
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English", hi: "हिंदी (Hindi)", ur: "اردو (Urdu)", ar: "العربية (Arabic)",
};

// ── Translations ─────────────────────────────────────────────────────────────
const translations = {
  en: {
    addExpense: "Add Expense", groups: "Groups", result: "Result",
    yourGroups: "Your Groups", new: "New", noGroupsYet: "No groups yet",
    tapNewHint: "Tap \"New\" to create your first group",
    createNewGroup: "Create a new group", groupName: "Group name (e.g. Goa Trip)",
    enterMemberName: "Enter member name", addMemberHint2: "Add at least 2 members to create a group.",
    addMemberHint1: "Add 1 more member to continue.", cancel: "Cancel",
    createGroup: "Create Group", editGroup: "Edit Group", addMemberName: "Add member name",
    saveChanges: "Save Changes", shareSummary: "Share Summary",
    copy: "Copy", copied: "Copied!", whatsapp: "WhatsApp",
    noGroupSelected: "No group selected", goToGroups: "Go to Groups and select or create a group first",
    members: "members", each: "each", whatFor: "What's this for? (e.g. Dinner)",
    amount: "Amount", paidBy: "Paid by", expenses: "Expenses",
    noExpensesYet: "No expenses yet. Add one above.",
    totalExpenses: "Total Expenses", perPerson: "Per person",
    whatEachPaid: "What each person paid", whoOwes: "Who pays whom",
    needsToPay: "needs to pay", settled: "settled", ahead: "ahead", behind: "behind",
    allSettledUp: "All settled up!", noExpensesAdded: "No expenses added yet",
    everyoneOwes: "Everyone owes the same amount", selectGroupFirst: "Select a group from the Groups tab to see results",
    settings: "Settings", general: "General", currency: "Currency",
    language: "Language", darkMode: "Dark Mode", on: "On", off: "Off",
    appearance: "Appearance", themeColor: "Theme Color",
    shareSupport: "Share & Support", shareApp: "Share App", shareAppHint: "Tell your friends via WhatsApp",
    rateApp: "Rate App", rateAppHint: "Enjoying SplitKaro? Leave a review",
    about: "About", version: "Version", privacyPolicy: "Privacy Policy",
    privacyText: "SplitKaro stores all your data locally on your device only. No account, no sign-up, no data ever leaves your phone. We do not collect or share any personal information.",
    madeWith: "Made with ♥ · SplitKaro v1.0.0",
  },
  hi: {
    addExpense: "खर्च जोड़ें", groups: "ग्रुप", result: "परिणाम",
    yourGroups: "आपके ग्रुप", new: "नया", noGroupsYet: "कोई ग्रुप नहीं",
    tapNewHint: "पहला ग्रुप बनाने के लिए \"नया\" दबाएं",
    createNewGroup: "नया ग्रुप बनाएं", groupName: "ग्रुप का नाम (जैसे गोवा ट्रिप)",
    enterMemberName: "सदस्य का नाम दर्ज करें", addMemberHint2: "ग्रुप बनाने के लिए कम से कम 2 सदस्य जोड़ें।",
    addMemberHint1: "जारी रखने के लिए 1 और सदस्य जोड़ें।", cancel: "रद्द करें",
    createGroup: "ग्रुप बनाएं", editGroup: "ग्रुप संपादित करें", addMemberName: "सदस्य का नाम जोड़ें",
    saveChanges: "बदलाव सहेजें", shareSummary: "सारांश साझा करें",
    copy: "कॉपी", copied: "कॉपी हो गया!", whatsapp: "WhatsApp",
    noGroupSelected: "कोई ग्रुप नहीं चुना", goToGroups: "पहले ग्रुप टैब में जाएं और ग्रुप चुनें",
    members: "सदस्य", each: "प्रत्येक", whatFor: "यह किसके लिए है? (जैसे डिनर)",
    amount: "राशि", paidBy: "किसने दिया", expenses: "खर्चे",
    noExpensesYet: "अभी कोई खर्च नहीं। ऊपर जोड़ें।",
    totalExpenses: "कुल खर्च", perPerson: "प्रति व्यक्ति",
    whatEachPaid: "किसने कितना दिया", whoOwes: "कौन किसे देगा",
    needsToPay: "को देना है", settled: "बराबर", ahead: "आगे", behind: "पीछे",
    allSettledUp: "सब बराबर!", noExpensesAdded: "अभी कोई खर्च नहीं जोड़ा",
    everyoneOwes: "सब ने बराबर राशि दी है", selectGroupFirst: "परिणाम देखने के लिए ग्रुप टैब से ग्रुप चुनें",
    settings: "सेटिंग्स", general: "सामान्य", currency: "मुद्रा",
    language: "भाषा", darkMode: "डार्क मोड", on: "चालू", off: "बंद",
    appearance: "रूप-रंग", themeColor: "थीम रंग",
    shareSupport: "साझा करें और सहायता", shareApp: "ऐप साझा करें", shareAppHint: "दोस्तों को WhatsApp पर बताएं",
    rateApp: "ऐप रेट करें", rateAppHint: "SplitKaro पसंद है? समीक्षा दें",
    about: "के बारे में", version: "संस्करण", privacyPolicy: "गोपनीयता नीति",
    privacyText: "SplitKaro आपका सारा डेटा केवल आपके डिवाइस पर सेव करता है। कोई अकाउंट नहीं, कोई डेटा बाहर नहीं जाता।",
    madeWith: "♥ के साथ बनाया · SplitKaro v1.0.0",
  },
  ur: {
    addExpense: "خرچ شامل کریں", groups: "گروپ", result: "نتیجہ",
    yourGroups: "آپ کے گروپ", new: "نیا", noGroupsYet: "کوئی گروپ نہیں",
    tapNewHint: "پہلا گروپ بنانے کے لیے \"نیا\" دبائیں",
    createNewGroup: "نیا گروپ بنائیں", groupName: "گروپ کا نام (مثلاً دبئی ٹرپ)",
    enterMemberName: "رکن کا نام درج کریں", addMemberHint2: "گروپ بنانے کے لیے کم از کم 2 ارکان شامل کریں۔",
    addMemberHint1: "جاری رکھنے کے لیے 1 اور رکن شامل کریں۔", cancel: "منسوخ",
    createGroup: "گروپ بنائیں", editGroup: "گروپ ترمیم کریں", addMemberName: "رکن کا نام شامل کریں",
    saveChanges: "تبدیلیاں محفوظ کریں", shareSummary: "خلاصہ شیئر کریں",
    copy: "کاپی", copied: "کاپی ہو گئی!", whatsapp: "WhatsApp",
    noGroupSelected: "کوئی گروپ منتخب نہیں", goToGroups: "پہلے گروپ ٹیب میں جائیں",
    members: "ارکان", each: "فی کس", whatFor: "یہ کس کے لیے ہے؟ (مثلاً کھانا)",
    amount: "رقم", paidBy: "کس نے دیا", expenses: "اخراجات",
    noExpensesYet: "ابھی کوئی خرچ نہیں۔ اوپر شامل کریں۔",
    totalExpenses: "کل اخراجات", perPerson: "فی شخص",
    whatEachPaid: "کس نے کتنا دیا", whoOwes: "کون کسے دے گا",
    needsToPay: "کو دینا ہے", settled: "برابر", ahead: "آگے", behind: "پیچھے",
    allSettledUp: "سب برابر!", noExpensesAdded: "ابھی کوئی خرچ نہیں",
    everyoneOwes: "سب نے برابر رقم دی ہے", selectGroupFirst: "نتیجہ دیکھنے کے لیے گروپ منتخب کریں",
    settings: "ترتیبات", general: "عمومی", currency: "کرنسی",
    language: "زبان", darkMode: "ڈارک موڈ", on: "چالو", off: "بند",
    appearance: "ظاہری شکل", themeColor: "تھیم رنگ",
    shareSupport: "شیئر اور مدد", shareApp: "ایپ شیئر کریں", shareAppHint: "دوستوں کو WhatsApp پر بتائیں",
    rateApp: "ایپ ریٹ کریں", rateAppHint: "SplitKaro پسند ہے؟ جائزہ دیں",
    about: "کے بارے میں", version: "ورژن", privacyPolicy: "رازداری کی پالیسی",
    privacyText: "SplitKaro آپ کا تمام ڈیٹا صرف آپ کے آلے پر محفوظ کرتا ہے۔ کوئی اکاؤنٹ نہیں، کوئی ڈیٹا باہر نہیں جاتا۔",
    madeWith: "♥ کے ساتھ بنایا · SplitKaro v1.0.0",
  },
  ar: {
    addExpense: "إضافة مصروف", groups: "المجموعات", result: "النتيجة",
    yourGroups: "مجموعاتك", new: "جديد", noGroupsYet: "لا توجد مجموعات",
    tapNewHint: "اضغط \"جديد\" لإنشاء مجموعتك الأولى",
    createNewGroup: "إنشاء مجموعة جديدة", groupName: "اسم المجموعة (مثلاً رحلة دبي)",
    enterMemberName: "أدخل اسم العضو", addMemberHint2: "أضف على الأقل عضوين لإنشاء مجموعة.",
    addMemberHint1: "أضف عضواً آخر للمتابعة.", cancel: "إلغاء",
    createGroup: "إنشاء مجموعة", editGroup: "تعديل المجموعة", addMemberName: "إضافة اسم عضو",
    saveChanges: "حفظ التغييرات", shareSummary: "مشاركة الملخص",
    copy: "نسخ", copied: "تم النسخ!", whatsapp: "واتساب",
    noGroupSelected: "لم يتم اختيار مجموعة", goToGroups: "اذهب إلى المجموعات واختر أو أنشئ مجموعة",
    members: "أعضاء", each: "للشخص", whatFor: "ما هذا؟ (مثلاً عشاء)",
    amount: "المبلغ", paidBy: "دفع من", expenses: "المصاريف",
    noExpensesYet: "لا مصاريف حتى الآن. أضف واحداً فوق.",
    totalExpenses: "إجمالي المصاريف", perPerson: "للشخص",
    whatEachPaid: "ما دفعه كل شخص", whoOwes: "من يدفع لمن",
    needsToPay: "يحتاج إلى دفع", settled: "مسوّى", ahead: "زائد", behind: "ناقص",
    allSettledUp: "كل شيء مسوّى!", noExpensesAdded: "لم تُضف مصاريف بعد",
    everyoneOwes: "الجميع دفعوا نفس المبلغ", selectGroupFirst: "اختر مجموعة من تبويب المجموعات لرؤية النتائج",
    settings: "الإعدادات", general: "عام", currency: "العملة",
    language: "اللغة", darkMode: "الوضع المظلم", on: "تشغيل", off: "إيقاف",
    appearance: "المظهر", themeColor: "لون الثيم",
    shareSupport: "مشاركة ودعم", shareApp: "مشاركة التطبيق", shareAppHint: "أخبر أصدقاءك عبر واتساب",
    rateApp: "تقييم التطبيق", rateAppHint: "تعجبك SplitKaro؟ اترك تقييماً",
    about: "حول", version: "الإصدار", privacyPolicy: "سياسة الخصوصية",
    privacyText: "يحفظ SplitKaro جميع بياناتك على جهازك فقط. لا حساب، لا اشتراك، لا بيانات تغادر هاتفك.",
    madeWith: "صُنع بـ ♥ · SplitKaro v1.0.0",
  },
} as const;

export type TKey = keyof typeof translations.en;

// ── Defaults & persistence ────────────────────────────────────────────────────
const DEFAULTS: Settings = { currency: "INR", language: "en", darkMode: false, theme: "green" };

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem("sk_settings");
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch { return DEFAULTS; }
}

export function applySettings(s: Settings) {
  const root = document.documentElement;
  root.classList.toggle("dark", s.darkMode);
  root.setAttribute("data-theme", s.theme);
  root.dir = s.language === "ar" || s.language === "ur" ? "rtl" : "ltr";
}

// ── Context ───────────────────────────────────────────────────────────────────
interface SettingsCtx {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  currencySymbol: string;
  t: (key: TKey) => string;
}

const SettingsContext = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
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

  function t(key: TKey): string {
    return (translations[settings.language] as Record<TKey, string>)[key]
      ?? translations.en[key];
  }

  return createElement(
    SettingsContext.Provider,
    { value: { settings, update, currencySymbol: CURRENCY_SYMBOLS[settings.currency], t } },
    children
  );
}

export function useSettings(): SettingsCtx {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
