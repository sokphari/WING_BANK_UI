
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const exchangeRateRoutes = require("./routes/exchangeRateRoutes");
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/account");

const app = express();
const PORT = process.env.PORT || 5000;

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "wing_user",
  password: process.env.DB_PASSWORD || "wingbankdemo@2026",
  database: process.env.DB_NAME || "wing_bank_demo",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware
app.use(cors());
app.use(express.json());

// Make database pool available to routes
app.locals.pool = pool;

// API routes
app.use("/api", exchangeRateRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/accounts", require("./routes/account"));

// Test endpoint
app.get("/", (req, res) => {
  res.send("Wing Bank demo API is running.");
});

// Start server
async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL database connected successfully.");
    connection.release();

    app.listen(PORT, () => {
      console.log(`API server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
