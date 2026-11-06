// backend/controllers/exchangeRateController.js

/**
 * GET /api/exchange-rate
 * Returns { base, quote, buy, sell, mid, updatedAt }
 */
const getExchangeRate = async (req, res) => {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");

    if (!response.ok) {
      throw new Error(`Upstream rate API returned ${response.status}`);
    }

    const data = await response.json();
    const mid = data?.rates?.KHR;

    if (!mid) {
      throw new Error("KHR rate not found in upstream response");
    }

    const spreadPct = 0.005; // 0.5% bank-style spread, adjust as needed
    const buy = mid * (1 - spreadPct);
    const sell = mid * (1 + spreadPct);

    res.json({
      base: "USD",
      quote: "KHR",
      buy,
      sell,
      mid,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Exchange rate error:", err.message);

    // Fallback so the frontend doesn't get stuck on "Loading..."
    res.status(200).json({
      base: "USD",
      quote: "KHR",
      buy: 4080,
      sell: 4120,
      mid: 4100,
      updatedAt: new Date().toISOString(),
      fallback: true,
    });
  }
};

module.exports = { getExchangeRate };