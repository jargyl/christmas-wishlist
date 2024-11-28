import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import nl from "./locales/nl.json";

const lang = import.meta.env.VITE_LANG || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    nl: { translation: nl },
  },
  fallbackLng: "en",
  lng: lang,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
