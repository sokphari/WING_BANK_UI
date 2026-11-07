
import { useTranslation } from "react-i18next";

export default function AccountsPanel({accounts, accountType, setAccountType, openAccount, accountMsg, accountMsgOk}) {
  const { t } = useTranslation();

  return (
        <section className="mt-6">
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t("My Accounts")}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {t("View your accounts and available balance")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-lime-500"
                >
                  <option value="Savings">{t("Savings")}</option>
                  <option value="Current">{t("Current")}</option>
                  <option value="Fixed Deposit">{t("Fixed Deposit")}</option>
                </select>

                <button
                  onClick={openAccount}
                  className="rounded-full bg-lime-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-lime-600"
                >
                  + {t("Open Account")}
                </button>
              </div>
            </div>

            {accountMsg && (
              <p
                className={`mb-4 text-sm ${
                  accountMsgOk ? "text-green-600" : "text-red-500"
                }`}
              >
                {t(accountMsg)}
              </p>
            )}

            {accounts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center">
                <p className="font-medium text-gray-700">{t("No accounts found")}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {t("Open an account to see your balance here.")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {accounts.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl border border-gray-100 bg-[#f3f5f8] p-5 transition hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-500">{t(a.account_type)}</p>
                      <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-lime-700">
                        {t("Active")}
                      </span>
                    </div>

                    <p className="mt-3 break-all text-base font-semibold tracking-wide text-gray-800">
                      {a.account_number}
                    </p>

                    <p className="mt-5 text-sm text-gray-500">{t("Available Balance")}</p>

                    <p className="mt-1 text-3xl font-bold text-[#91c800]">
                      $
                      {Number(a.balance || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
  );
}
