require("dotenv").config();

const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const { randomInt } = require("node:crypto");

const demoUser = {
  name: "Demo User",
  email: "demo@wingbank.local",
  password: "DemoPass123!",
};

function makeAccountNumber() {
  return Array.from({ length: 12 }, () => randomInt(0, 10)).join("");
}

async function main() {
  if (!process.env.DB_PASSWORD) {
    throw new Error("DB_PASSWORD is required. Set it in backend/.env.");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required. Set it in backend/.env.");
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "wing_user",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "wing_bank_demo",
    port: Number(process.env.DB_PORT) || 3306,
  });

  try {
    await connection.beginTransaction();
    await seedDemoData(connection);
    await connection.commit();
    printDemoLogin();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

async function seedDemoData(connection) {
  const passwordHash = await bcrypt.hash(demoUser.password, 10);
  const [users] = await connection.execute(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [demoUser.email]
  );

  let userId;
  if (users.length > 0) {
    userId = users[0].id;
    await connection.execute(
      "UPDATE users SET name = ?, password = ? WHERE id = ?",
      [demoUser.name, passwordHash, userId]
    );
  } else {
    const [result] = await connection.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [demoUser.name, demoUser.email, passwordHash]
    );
    userId = result.insertId;
  }

  const [accounts] = await connection.execute(
    "SELECT id FROM accounts WHERE user_id = ? LIMIT 1",
    [userId]
  );

  if (accounts.length === 0) {
    let accountNumber = "900000000001";
    let [matches] = await connection.execute(
      "SELECT id FROM accounts WHERE account_number = ? LIMIT 1",
      [accountNumber]
    );

    while (matches.length > 0) {
      accountNumber = makeAccountNumber();
      [matches] = await connection.execute(
        "SELECT id FROM accounts WHERE account_number = ? LIMIT 1",
        [accountNumber]
      );
    }

    await connection.execute(
      `INSERT INTO accounts (user_id, account_number, account_type, balance, currency)
       VALUES (?, ?, 'Savings', 2500.00, 'USD')`,
      [userId, accountNumber]
    );
  }
}

function printDemoLogin() {
  console.log("Demo data is ready.");
  console.log(`Email: ${demoUser.email}`);
  console.log(`Password: ${demoUser.password}`);
}

module.exports = { seedDemoData, printDemoLogin };

if (require.main === module) {
  main().catch((error) => {
    console.error("Failed to seed demo data:", error.message);
    process.exitCode = 1;
  });
}
