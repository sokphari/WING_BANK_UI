import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import wing from "../assets/wing.png";
import search from "../assets/search.png";
import ProfileMenu from "./ProfileMenu.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

export default function DashboardHeader({
  handleLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
  profile,
}) {
  const { t } = useTranslation();
  const navItems = [
    ["#personal", t("Personal")],
    ["#business", t("Business")],
    ["#company", t("Company")],
    ["#app", t("Wing Bank App")],
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-[78px] max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-5 xl:gap-12">
          <Link
            to="/dashboard"
            aria-label={t("Go to dashboard home")}
            className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500"
          >
            <img
              src={wing}
              alt="Wing Bank"
              className="h-auto w-[135px] sm:w-[185px]"
            />
          </Link>

          <nav aria-label={t("Main navigation")} className="hidden items-center gap-7 whitespace-nowrap xl:flex xl:gap-14">
            {navItems.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-[19.5px] font-normal text-slate-500 transition-colors hover:text-slate-950 focus-visible:text-slate-950 focus-visible:outline-none"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500" title={t("Search")}>
            <img src={search} alt="" aria-hidden="true" className="h-5 w-5" />
          </span>

          <LanguageSwitcher className="hidden sm:inline-flex" />
          <ProfileMenu profile={profile} />

          <button
            type="button"
            onClick={handleLogout}
            className="hidden rounded-lg px-2 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 sm:block"
          >
            {t("Logout")}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 xl:hidden"
            aria-label={t("Toggle menu")}
            aria-expanded={mobileMenuOpen}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {mobileMenuOpen ? "×" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label={t("Main navigation")}
          className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg xl:hidden sm:px-6"
        >
          <div className="mx-auto flex max-w-[1280px] flex-col gap-1">
            {navItems.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                onClick={closeMobileMenu}
              >
                {label}
              </a>
            ))}
            <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
              >
                {t("Logout")}
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
