import { useState, useEffect, useCallback } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AuthPage from "./components/AuthPage.jsx";
import DashboardHeader from "./components/DashboardHeader.jsx";
import HeroSlider from "./components/HeroSlider.jsx";
import AccountsPanel from "./components/AccountsPanel.jsx";
import LoanCalculator from "./components/LoanCalculator.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import wing1 from "./assets/wing1.png";
import card1 from "./assets/card1.png";
import card2 from "./assets/card2.png";
import card3 from "./assets/card3.png";
import jip from "./assets/jip.png";
import jip1 from "./assets/jip1.png";
import jip2 from "./assets/jip2.png";
import jip3 from "./assets/jip3.png";
import jip4 from "./assets/jip4.png";
import jip5 from "./assets/jip5.png";
import jib_app_en from "./assets/jib_app_en.png";
import wingbank4 from "./assets/wingbank4.jpg";
import wingbank50 from "./assets/wingbank50.jpg";
import wingbank50off from "./assets/wingbank50off.png";
import securebanking from "./assets/secure-banking.png";
import bankwing from "./assets/bankwing.png";
import wing2 from "./assets/wing2.png";
import wing3 from "./assets/wing3.png";
import wing4 from "./assets/wing4.png";
import { ShoppingCart, Car, Bike } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/auth`;
const PROFILE_URL = `${API_URL}/profile`;
const EXCHANGE_URL = `${BASE_URL}/exchange-rate`;
const ACCOUNTS_URL = `${BASE_URL}/accounts`;

const slides = [
  {
    image: wing1,
    title: "Meet Jib Jib",
    description: "Your New Mobile Banking App Buddy",
    button: "Explore Solutions",
  },
  {
    image: wing2,
    title: "Wing Bank Wins Brand Innovation Award 2026",
    description: "Simple, fast and secure banking",
    button: "Explore Solutions",
  },
  {
    image: wing3,
    title: "Everything You Need, One Tap Away",
    description: "Book, order, shop, and discover everyday services with WingFlex.",
    button: "Explore Solutions",
  },
  {
    image: wing4,
    title: "Trade Finance Made Simple",
    description:
      "Reduce payment risk, receive goods safely, and improve cash flow—supported by Wing Bank’s Trade Finance solutions.",
    button: "Explore Solutions",
  },
];

const loanTypes = [
  { key: "consumer", label: "Consumer Loan", icon: ShoppingCart, rate: 12 },
  { key: "car", label: "Car Loan", icon: Car, rate: 12 },
  { key: "moto", label: "Moto Loan", icon: Bike, rate: 12 },
];

const termOptions = [12, 24, 36, 48, 60, 72, 84, 96];
const MAX_CREDIT = 100000;

function getStoredProfile() {
  try {
    return JSON.parse(localStorage.getItem("profile") || "null");
  } catch {
    return null;
  }
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // ---------- Auth ----------
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const isLogin = location.pathname !== "/register";
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState(getStoredProfile);
  const [profileLoading, setProfileLoading] = useState(
    () => !!localStorage.getItem("token") && !getStoredProfile(),
  );
  const [profileError, setProfileError] = useState("");

  // ---------- Homepage ----------
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(null);

  // ---------- Accounts ----------
  const [accounts, setAccounts] = useState([]);
  const [accountType, setAccountType] = useState("Savings");
  const [accountMsg, setAccountMsg] = useState("");
  const [accountMsgOk, setAccountMsgOk] = useState(false);

  // ---------- Loan calculator ----------
  const [loanType, setLoanType] = useState("car");
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState(12);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const switchMode = (login) => {
    setMessage("");
    setSuccess(false);
    navigate(login ? "/login" : "/register");
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    setIsLoggedIn(false);
    setProfile(null);
    setAccounts([]);
    setAccountMsg("");
    setForm({ name: "", email: "", password: "" });
    setMessage("");
    setSuccess(false);
    navigate("/login");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/${isLogin ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin ? { email: form.email, password: form.password } : form
        ),
      });

      const data = await response.json();
      setMessage(
        data.message || (response.ok ? "Request completed." : "Request failed.")
      );
      setSuccess(response.ok);

      if (response.ok && isLogin) {
        if (!data.token) {
          setSuccess(false);
          setMessage("Login succeeded but the server did not return a token.");
          return;
        }
        localStorage.setItem("token", data.token);
        setProfile(data.user || null);
        localStorage.setItem("profile", JSON.stringify(data.user || null));
        // Keep the auth page visible briefly so the success status can be read.
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoggedIn(true);
        navigate("/dashboard");
      } else if (response.ok && !isLogin) {
        navigate("/login");
        setForm((f) => ({ ...f, name: "", password: "" }));
      }
    } catch {
      setMessage("Cannot connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Accounts API ----------
  const fetchAccounts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAccounts([]);
      return;
    }

    try {
      const response = await fetch(ACCOUNTS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.status === 401) {
        handleLogout(); // token invalid or expired
        return;
      }
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch accounts");
      }

      setAccounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch accounts error:", error);
      setAccountMsgOk(false);
      setAccountMsg(error.message || "Failed to load accounts.");
    }
  }, [handleLogout]);

  const openAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAccountMsgOk(false);
      setAccountMsg("Please log in first.");
      return;
    }

    try {
      setAccountMsgOk(true);
      setAccountMsg("Opening account...");

      const response = await fetch(ACCOUNTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ account_type: accountType }),
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (!response.ok) {
        throw new Error(data.message || "Failed to open account");
      }

      setAccountMsgOk(true);
      setAccountMsg("Account opened successfully!");
      await fetchAccounts();
    } catch (error) {
      console.error("Open account error:", error);
      setAccountMsgOk(false);
      setAccountMsg(error.message || "Could not open account.");
    }
  };

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setProfileLoading(false);
      return;
    }

    setProfileError("");
    setProfileLoading(true);
    try {
      const response = await fetch(PROFILE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (!response.ok) throw new Error(data.message || "Failed to load profile.");
      setProfile(data.user);
      localStorage.setItem("profile", JSON.stringify(data.user));
    } catch (error) {
      console.error("Fetch profile error:", error);
      setProfileError(error.message || "Failed to load profile.");
    } finally {
      setProfileLoading(false);
    }
  }, [handleLogout]);

  const saveProfile = async (details) => {
    const token = localStorage.getItem("token");
    const response = await fetch(PROFILE_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(details),
    });
    const data = await response.json();
    if (response.status === 401) {
      handleLogout();
      throw new Error(data.message || "Please log in again.");
    }
    if (!response.ok) throw new Error(data.message || "Failed to update profile.");
    setProfile(data.user);
    localStorage.setItem("profile", JSON.stringify(data.user));
    return data.user;
  };

  const deleteProfile = async (password) => {
    const token = localStorage.getItem("token");
    const response = await fetch(PROFILE_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (response.status === 401) {
      if (!token || data.message?.includes("session")) handleLogout();
      throw new Error(data.message || "Please log in again.");
    }
    if (!response.ok) throw new Error(data.message || "Failed to delete profile.");
    handleLogout();
  };

  // Auto-slide
  useEffect(() => {
    if (!isLoggedIn) return;
    const id = setInterval(
      () => setCurrentSlide((p) => (p + 1) % slides.length),
      9000
    );
    return () => clearInterval(id);
  }, [isLoggedIn]);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  // Exchange rate
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(EXCHANGE_URL)
      .then((r) => r.json())
      .then((data) => setExchangeRate(data))
      .catch(() => setExchangeRate(null));
  }, [isLoggedIn]);

  // Load accounts only after login
  useEffect(() => {
    if (!isLoggedIn) return;
    fetchAccounts();
  }, [isLoggedIn, fetchAccounts]);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchProfile();
  }, [isLoggedIn, fetchProfile]);

  // Loan math
  const activeLoan = loanTypes.find((l) => l.key === loanType);
  const principal = Math.min(Number(amount) || 0, MAX_CREDIT);
  const monthlyRate = activeLoan.rate / 100 / 12;
  const monthlyPayment =
    principal === 0
      ? 0
      : monthlyRate === 0
      ? principal / term
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  const totalPayment = monthlyPayment * term;
  const money = (n) =>
    "$" +
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const sliderPercent = ((term - 12) / (96 - 12)) * 100;

  const accountsPanelProps = {
    accounts,
    accountType,
    setAccountType,
    openAccount,
    accountMsg,
    accountMsgOk,
  };
  const loanCalculatorProps = {
    loanTypes,
    loanType,
    setLoanType,
    amount,
    setAmount,
    term,
    setTerm,
    termOptions,
    activeLoan,
    monthlyPayment,
    totalPayment,
    money,
    sliderPercent,
    maxCredit: MAX_CREDIT,
  };

  const authPage = (
    <AuthPage
      isLogin={isLogin}
      switchMode={switchMode}
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      loading={loading}
      message={message}
      success={success}
    />
  );

  const dashboardPage = isLoggedIn ? (
    <div className="min-h-screen bg-[#f3f5f8]">
      <DashboardHeader
        handleLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        profile={profile}
      />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Hero slider */}
        <HeroSlider slides={slides} currentSlide={currentSlide} prevSlide={prevSlide} nextSlide={nextSlide} setCurrentSlide={setCurrentSlide} />

        {/* My Accounts */}
        <AccountsPanel {...accountsPanelProps} />

        {/* Quick links */}
        <section className="mt-6">
          <div className="bg-white rounded-2xl px-4 sm:px-10 py-4 sm:py-0 h-auto sm:h-[70px] flex flex-wrap items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-3">
              <img src={card1} alt="" className="w-8 h-8" />
              <span className="text-[15px] text-gray-700">Accounts</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={card2} alt="" className="w-[30px] h-[30px]" />
              <span className="text-[15px] text-gray-700">Cards</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={card3} alt="" className="w-[50px] h-[50px]" />
              <span className="text-[15px] text-gray-700">Support</span>
            </div>
          </div>
        </section>

        {/* What do you need today */}
        <section className="mt-10 sm:mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            What do you need today?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-7 h-[260px] relative overflow-hidden">
              <h3 className="text-[19px] font-bold max-w-[190px]">Start with Your Goal</h3>
              <p className="text-sm text-gray-500 mt-3 max-w-[190px]">
                Choose what you need and we will help you find the right banking solution.
              </p>
              <span className="absolute top-[26px] right-[26px] text-[22px] text-gray-400">›</span>
              <img src={jip} alt="" className="absolute bottom-[10px] right-[15px] w-[140px] h-[120px] object-contain" />
            </div>

            <div className="bg-white rounded-2xl p-7 h-[260px] relative overflow-hidden">
              <h3 className="text-[19px] font-bold leading-[26px]">
                I Need Money for Something Important
              </h3>
              <p className="text-sm text-gray-500 mt-3 max-w-[190px]">
                Get financial support and choose a solution that works for you.
              </p>
              <span className="absolute top-[26px] right-[26px] text-[22px] text-gray-400">›</span>
              <img src={jip1} alt="" className="absolute bottom-[10px] right-[15px] w-[140px] h-[120px] object-contain" />
            </div>

            <div className="bg-white rounded-2xl p-7 h-[260px] relative overflow-hidden">
              <h3 className="text-[19px] font-bold">Exchange Rate</h3>
              <p className="text-sm text-gray-500 mt-3">Check today's exchange rate.</p>
              <span className="absolute top-[26px] right-[26px] text-[22px] text-gray-400">›</span>

              <div className="absolute bottom-6 left-7 right-7">
                <div className="grid grid-cols-3 gap-2 text-[13px] border-b pb-[10px] text-center">
                  <span className="bg-lime-500 px-[10px] py-2 rounded-[10px] text-white">Currency</span>
                  <span className="bg-red-500 px-[10px] py-2 rounded-[10px] text-white">Buy</span>
                  <span className="bg-green-500 px-[10px] py-2 rounded-[10px] text-white">Sell</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[13px] py-[10px] border-b text-center">
                  <span>USD/KHR</span>
                  <span>
                    {exchangeRate ? Math.round(exchangeRate.buy).toLocaleString() : "Loading..."}
                  </span>
                  <span>
                    {exchangeRate ? Math.round(exchangeRate.sell).toLocaleString() : "Loading..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "I Want to Send Money Easily", text: "Move money locally or internationally with speed and peace of mind.", img: jip2 },
              { title: "I Want to Pay or Scan Quickly", text: "Handle bills, QR payments, and everyday transfers in seconds.", img: jip3 },
              { title: "I Want My Money to Be Safe", text: "Your funds and valuables protected with trusted banking security.", img: jip4 },
              { title: "I Want to Grow My Money", text: "Build financial confidence with secure and flexible saving options.", img: jip5 },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-3xl p-8 h-[300px] relative overflow-hidden">
                <h3 className="text-[23px] font-bold text-lime-500 max-w-[330px]">{c.title}</h3>
                <p className="text-[15px] text-gray-500 mt-[15px] max-w-[300px]">{c.text}</p>
                <span className="absolute top-8 right-8 text-2xl text-lime-500">›</span>
                <img src={c.img} alt="" className="absolute bottom-2 right-5 w-[250px] h-[190px] object-contain" />
              </div>
            ))}
          </div>
        </section>

        {/* App */}
        <section id="app" className="mt-12 sm:mt-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Wing Bank App</h2>

          <div className="bg-[#edf5e7] rounded-[20px] min-h-[400px] p-8 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-[520px]">
              <h2 className="text-[28px] sm:text-[42px] font-bold leading-[34px] sm:leading-[50px]">
                Bank Smarter. Live Easier.
              </h2>
              <p className="text-base text-gray-600 mt-5 leading-[26px]">
                Everything you need — saving, loans, transfers, and payments — is in one powerful app.
              </p>
              <button className="mt-7 bg-white px-8 py-4 rounded-[10px] text-[15px] font-semibold">
                Download Now
              </button>
            </div>
            <img src={jib_app_en} alt="Wing Bank App" className="w-[280px] sm:w-[400px] h-[220px] sm:h-[300px] object-contain" />
          </div>
        </section>

        {/* Promotions */}
        <section className="mt-12 sm:mt-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Explore What's New</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { img: wingbank50off, title: "Get 50% OFF KFC with Wing Bank Surprise Box" },
              { img: wingbank4, title: "Get Double Benefit at KFC Pay with Wing Bank APP" },
              { img: wingbank50, title: "Enjoy 50% OFF High Tea" },
            ].map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-4">
                <img src={p.img} alt="" className="w-full h-[260px] sm:h-[420px] object-cover rounded-xl" />
                <h3 className="text-xl font-semibold mt-4">{p.title}</h3>
                <p className="text-[13px] text-gray-400 mt-2">
                  Promo Period: <b>Dec 31, 2026</b>
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-7">
            <button className="bg-lime-500 text-white text-sm font-semibold px-7 py-3 rounded-full">
              View Promotions
            </button>
          </div>
        </section>

        {/* Security */}
        <section className="mt-12 sm:mt-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Security</h2>

          <div className="bg-[#edf4fc] rounded-[20px] min-h-[380px] p-8 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-[28px] sm:text-[38px] font-bold max-w-[420px] leading-[34px] sm:leading-[46px]">
                Your Security. Our Commitment.
              </h2>
              <p className="text-base text-gray-600 mt-[18px] max-w-[440px]">
                Advanced encryption and monitoring keep your banking safe at every step.
              </p>
              <button className="mt-7 bg-lime-500 text-white text-[15px] font-semibold px-8 py-[14px] rounded-[10px]">
                Explore More
              </button>
            </div>
            <img src={securebanking} alt="Security" className="w-[280px] sm:w-[400px] h-[220px] sm:h-[290px] object-contain" />
          </div>
        </section>

        {/* Awards */}
        <section className="mt-12 sm:mt-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Awards and Trust</h2>

          <div className="relative bg-[#241006] rounded-[20px] min-h-[400px] p-8 sm:p-14 flex flex-col lg:flex-row items-start lg:items-center overflow-hidden gap-8">
            <div className="relative z-10 max-w-[440px]">
              <h2 className="text-white text-[28px] sm:text-[38px] font-bold max-w-[420px]">
                Recognized for Excellence
              </h2>
              <p className="text-white/70 text-base mt-[18px] max-w-[440px]">
                Award-winning services built on trust, performance, and customer commitment.
              </p>
              <button className="mt-7 bg-lime-500 text-white text-[15px] font-semibold px-8 py-[14px] rounded-[10px]">
                Explore More
              </button>
            </div>
            <img
              src={bankwing}
              alt="Award"
              className="relative lg:absolute lg:right-10 w-full sm:w-[460px] h-[220px] sm:h-[330px] object-contain lg:mx-0 mx-auto"
            />
          </div>
        </section>

        {/* Loan calculator */}
        <LoanCalculator {...loanCalculatorProps} />
      </main>

      <SiteFooter />
    </div>
  ) : <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
      />
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : authPage}
      />
      <Route
        path="/register"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : authPage}
      />
      <Route path="/dashboard" element={dashboardPage} />
      <Route
        path="/profile"
        element={
          isLoggedIn ? (
            <ProfilePage
              profile={profile}
              profileLoading={profileLoading}
              profileError={profileError}
              onReload={fetchProfile}
              onSave={saveProfile}
              onDelete={deleteProfile}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
