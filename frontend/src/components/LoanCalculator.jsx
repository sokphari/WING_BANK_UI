import us from "../assets/us.png";

export default function LoanCalculator({loanTypes, loanType, setLoanType, amount, setAmount, term, setTerm, termOptions, activeLoan, monthlyPayment, totalPayment, money, sliderPercent, maxCredit}) {
  return (
        <section className="mt-12 sm:mt-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Loan Calculator</h2>

          <div className="bg-white rounded-[20px] p-5 sm:p-9 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold">Find the Right Loan in Seconds</h2>
            <p className="text-base mt-2">
              Play around with the loan calculator to get a peek at your monthly payments. If the
              numbers look good, what are you waiting for?
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
              {loanTypes.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setLoanType(key)}
                  className={`flex items-center gap-3 h-[50px] px-5 sm:px-6 rounded-full text-base sm:text-xl transition ${
                    loanType === key
                      ? "bg-[#96C900] text-white"
                      : "border border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
              <div>
                <h2 className="mb-3 text-xl font-semibold">Amount USD (or KHR equivalent)</h2>

                <div className="flex h-[50px] items-center rounded-[15px] bg-[#f1f3f8] px-4">
                  <input
                    type="number"
                    min="0"
                    max={maxCredit}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter Amount"
                    className="flex-1 bg-transparent text-xl text-slate-700 outline-none placeholder:text-[#64748b]"
                  />
                  <div className="flex items-center gap-2 text-xl">
                    <span>USD</span>
                    <img src={us} alt="US" className="w-[18px] h-[18px]" />
                  </div>
                </div>

                <p className="mt-5 text-[17px] text-[#50627d]">
                  Max. Credit Limit : ${maxCredit.toLocaleString()}.00
                </p>
                {Number(amount) > maxCredit && (
                  <p className="mt-1 text-sm text-red-600">
                    Amount exceeds the limit. Calculating with the maximum.
                  </p>
                )}

                <div className="mt-9">
                  <h2 className="mb-4 text-xl font-semibold">Duration</h2>

                  <div className="rounded-[15px] bg-[#f1f3f8] p-5">
                    <p className="mb-12 text-[17px] text-gray-500">Term</p>

                    <div className="relative">
                      <div
                        className="absolute -top-[50px] -translate-x-1/2 whitespace-nowrap rounded-md bg-[#91c800] px-5 py-2 text-base text-white"
                        style={{ left: `${sliderPercent}%` }}
                      >
                        {term} Months
                      </div>

                      <input
                        type="range"
                        min="12"
                        max="96"
                        step="1"
                        value={term}
                        onChange={(e) => setTerm(Number(e.target.value))}
                        className="w-full accent-[#91c800]"
                      />

                      <div className="mt-5 flex justify-between text-[17px]">
                        <span>12 Months</span>
                        <span>96 Months</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {termOptions.map((m) => (
                      <button
                        key={m}
                        onClick={() => setTerm(m)}
                        className={`rounded-md px-3 py-2 transition ${
                          term === m ? "bg-[#91c800] text-white" : "bg-[#f5f8e9] text-[#91c800]"
                        }`}
                      >
                        {m} Months
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-[#e8ebf0] bg-white">
                <div className="w-full text-center">
                  <h2 className="text-xl font-semibold text-[#5d6f8a]">Estimated Monthly Payment</h2>

                  <div className="mt-[120px] text-3xl font-bold text-[#91c800]">
                    {money(monthlyPayment)}
                  </div>

                  <div className="mt-9 grid grid-cols-3">
                    <div>
                      <p className="text-[17px] font-semibold text-[#5d6f8a]">Interest Rate</p>
                      <p className="mt-3 text-3xl font-semibold">{activeLoan.rate}%</p>
                    </div>
                    <div>
                      <p className="text-[17px] font-semibold text-[#5d6f8a]">Total Payment</p>
                      <p className="mt-3 text-3xl font-semibold">{money(totalPayment)}</p>
                    </div>
                    <div>
                      <p className="text-[17px] font-semibold text-[#5d6f8a]">Months</p>
                      <p className="mt-3 text-3xl font-semibold">{term}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  );
}
