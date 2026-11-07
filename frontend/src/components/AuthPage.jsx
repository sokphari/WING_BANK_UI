import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import wingBankLogo from "../assets/wb-logo.svg";
import loginBackground from "../assets/bgformlogin.png";

export default function AuthPage({isLogin, switchMode, form, handleChange, handleSubmit, showPassword, setShowPassword, loading, message, success}) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100 p-4 flex items-center justify-center">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-blue-900/10 border border-blue-100">
          <div className="grid md:grid-cols-2">
            {/* Left: branding */}
            <section
              className="relative overflow-hidden bg-cover bg-center p-8 md:p-10"
              style={{
                backgroundImage: `url(${loginBackground})`,
                backgroundPosition: "35% center",
              }}
            >
              <div className="relative z-10">
                <img
                  src={wingBankLogo}
                  alt="Wing Bank"
                  className="w-56 sm:w-64 h-auto object-contain object-left"
                />
              </div>

            </section>

            {/* Right: login / register */}
            <section className="p-6 sm:p-10 md:p-12">
              <div className="mb-9 flex justify-center">
                <img
                  src={wingBankLogo}
                  alt="Wing Bank"
                  className="h-12 w-auto object-contain"
                />
              </div>

              <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
                {isLogin ? "Login Account" : "Create Account"}
              </h2>
              <p className="mt-2 text-center text-sm leading-6 text-slate-500">
                {isLogin
                  ? "Welcome back! Please login to your account."
                  : "Register to start Wing bank."}
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-4 text-sm outline-none transition focus:border-[#85cc16] focus:ring-4 focus:ring-[#85cc16]/20"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-[#85cc16] focus-within:ring-4 focus-within:ring-[#85cc16]/20">
                    <FiMail className="shrink-0 text-slate-400" size={19} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent px-3 py-4 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-[#85cc16] focus-within:ring-4 focus-within:ring-[#85cc16]/20">
                    <FiLock className="shrink-0 text-slate-400" size={19} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      minLength={6}
                      required
                      className="w-full bg-transparent px-3 py-4 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="text-slate-400 hover:text-blue-700"
                    >
                      {showPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <p className="text-slate-500">At least 6 characters</p>
                    {isLogin && (
                      <button
                        type="button"
                        className="font-semibold text-blue-700 hover:text-blue-800"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl bg-[#85cc16] px-4 py-4 font-bold text-white shadow-lg shadow-[#85cc16]/20 transition hover:bg-[#78b914] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
                </button>
              </form>

              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`mt-5 rounded-xl border p-4 text-sm ${
                    success
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => switchMode(!isLogin)}
                  className="font-bold text-blue-700 hover:text-green-700"
                >
                  {isLogin ? "Register here" : "Login here"}
                </button>
              </p>

            </section>
          </div>
        </div>
      </div>
  );
}
