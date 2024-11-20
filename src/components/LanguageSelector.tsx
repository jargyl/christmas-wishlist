import React from "react";
import { useTranslation } from "react-i18next";
import { GlobeIcon } from "lucide-react";

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "nl" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-1 text-gray-600 bg-white hover:text-gray-900 border border-gray-300 rounded-md px-2 py-1"
      title={i18n.language === "en" ? "Switch to Dutch" : "Schakel naar Engels"}
    >
      <GlobeIcon className="h-5 w-5" />
      <span>{i18n.language.toUpperCase()}</span>
    </button>
  );
}
