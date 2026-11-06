const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Verify JWT
router.use((req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({ message: "Please login to access your accounts." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id ?? decoded.userId ?? decoded.user_id;
    if (userId === undefined || userId === null || userId === "") {
      return res.status(401).json({ message: "Your login token does not contain a user ID." });
    }
    req.userId = userId;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ message: "Your session expired. Please login again." });
  }
});

const COLS = "id, user_id, account_number, account_type, balance, currency, created_at";

// GET /api/accounts
router.get("/", async (req, res) => {
  try {
    const [accounts] = await req.app.locals.pool.execute(
      `SELECT ${COLS} FROM accounts WHERE user_id = ? ORDER BY id DESC`,
      [req.userId]
    );
    return res.status(200).json(accounts);
  } catch (error) {
    console.error("GET ACCOUNTS ERROR:", error.message);
    return res.status(500).json({ message: "Failed to load accounts." });
  }
});

// POST /api/accounts
router.post("/", async (req, res) => {
  const pool = req.app.locals.pool;
  const accountType = req.body?.account_type;
  const allowedTypes = ["Savings", "Current", "Fixed Deposit"];

  if (!allowedTypes.includes(accountType)) {
    return res.status(400).json({ message: "Choose Savings, Current, or Fixed Deposit." });
  }

  try {
    let accountNumber;
    let existing;
    do {
      accountNumber = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
      [existing] = await pool.execute(
        "SELECT id FROM accounts WHERE account_number = ? LIMIT 1",
        [accountNumber]
      );
    } while (existing.length > 0);

    const [result] = await pool.execute(
      `INSERT INTO accounts (user_id, account_number, account_type, balance, currency)
       VALUES (?, ?, ?, 0.00, 'USD')`,
      [req.userId, accountNumber, accountType]
    );

    const [rows] = await pool.execute(
      `SELECT ${COLS} FROM accounts WHERE id = ? AND user_id = ?`,
      [result.insertId, req.userId]
    );

    return res.status(201).json({ message: "Account created successfully.", account: rows[0] });
  } catch (error) {
    console.error("CREATE ACCOUNT ERROR:", error.message);
    return res.status(500).json({ message: "Failed to create account." });
  }
});

module.exports = router;
