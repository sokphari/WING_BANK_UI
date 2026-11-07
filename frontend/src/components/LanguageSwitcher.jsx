import { useTranslation } from "react-i18next";
import flag from "../assets/flag.png";
import englishFlag from "../assets/en-flag.svg";

export default function LanguageSwitcher({ className = "" }) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith("km") ? "km" : "en";

  const toggleLanguage = () => {
    const nextLanguage = language === "en" ? "km" : "en";
    localStorage.setItem("app_language", nextLanguage);
    document.documentElement.lang = nextLanguage;
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === "en" ? t("Switch to Khmer") : t("Switch to English")}
      title={language === "en" ? t("Switch to Khmer") : t("Switch to English")}
      className={`inline-flex h-12 items-center gap-3 rounded-full bg-gray-100 px-4 text-base text-gray-700 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 ${className}`}
    >
      <img
        src={language === "en" ? englishFlag : flag}
        alt=""
        className="h-5 w-5 object-contain"
      />
      <span>{language === "en" ? t("English") : t("Khmer")}</span>
    </button>
  );
}
