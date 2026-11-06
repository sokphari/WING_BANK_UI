// backend/routes/exchangeRateRoutes.js

const express = require("express");
const { getExchangeRate } = require("../controllers/exchangeRateController");

const router = express.Router();

router.get("/exchange-rate", getExchangeRate);

module.exports = router;