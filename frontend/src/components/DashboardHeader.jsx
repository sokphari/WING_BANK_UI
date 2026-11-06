import wing from "../assets/wing.png";
import search from "../assets/search.png";
import flag from "../assets/flag.png";

export default function DashboardHeader({handleLogout, mobileMenuOpen, setMobileMenuOpen}) {
  return (
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto h-20 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-12">
            <img src={wing} alt="Wing Bank" className="w-[100px] sm:w-[130px] h-auto" />

            <nav className="hidden lg:flex items-center gap-10">
              <a href="#personal" className="text-lg text-gray-500 hover:text-gray-900">Personal</a>
              <a href="#business" className="text-lg text-gray-500 hover:text-gray-900">Business</a>
              <a href="#company" className="text-lg text-gray-500 hover:text-gray-900">Company</a>
              <a href="#app" className="text-lg text-gray-500 hover:text-gray-900">Wing Bank App</a>
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-[22px]">
            <img src={search} alt="Search" className="w-5 h-5" />

            <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-[14px] py-2 rounded-full">
              <img src={flag} alt="Khmer" className="w-[18px] h-[18px]" />
              <span className="text-[13px] text-gray-600">ភាសាខ្មែរ</span>
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-red-600"
            >
              Logout
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <span className="text-2xl leading-none">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
            {[
              ["#personal", "Personal"],
              ["#business", "Business"],
              ["#company", "Company"],
              ["#app", "Wing Bank App"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-base text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <div className="flex items-center gap-2 bg-gray-100 px-[14px] py-2 rounded-full w-fit">
              <img src={flag} alt="Khmer" className="w-[18px] h-[18px]" />
              <span className="text-[13px] text-gray-600">ភាសាខ្មែរ</span>
            </div>
            <button onClick={handleLogout} className="text-left text-base font-semibold text-red-600">
              Logout
            </button>
          </nav>
        )}
      </header>
  );
}
