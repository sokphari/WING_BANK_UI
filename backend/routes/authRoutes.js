const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

function makeAccountNumber() {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const pool = req.app.locals.pool;
  const name = (req.body?.name || "").trim();
  const email = (req.body?.email || "").trim().toLowerCase();
  const password = req.body?.password || "";

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email, and password." });
  }
  if (!emailOk(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  try {
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "This email is already registered." });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash]
    );

    // Starter savings account
    let accountNumber;
    let dup;
    do {
      accountNumber = makeAccountNumber();
      [dup] = await pool.execute(
        "SELECT id FROM accounts WHERE account_number = ? LIMIT 1",
        [accountNumber]
      );
    } while (dup.length > 0);

    await pool.execute(
      `INSERT INTO accounts (user_id, account_number, account_type, balance, currency)
       VALUES (?, ?, 'Savings', 0.00, 'USD')`,
      [result.insertId, accountNumber]
    );

    return res.status(201).json({
      message: "Registration successful! Please login.",
      user: { id: result.insertId, name, email },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    return res.status(500).json({ message: "Registration failed." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const pool = req.app.locals.pool;
  const email = (req.body?.email || "").trim().toLowerCase();
  const password = req.body?.password || "";

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    return res.status(500).json({ message: "Login failed." });
  }
});

module.exports = router;
