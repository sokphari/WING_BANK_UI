require("dotenv").config();

const mysql = require("mysql2/promise");
const { seedDemoData, printDemoLogin } = require("./seed");

async function main() {
  if (!process.env.DB_PASSWORD) {
    throw new Error("DB_PASSWORD is required. Set it in backend/.env.");
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
    await connection.execute("DELETE FROM accounts");
    await connection.execute("DELETE FROM users");
    await seedDemoData(connection);
    await connection.commit();
    console.log("All users and accounts were cleared and demo data was reseeded.");
    printDemoLogin();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("Failed to refresh database data:", error.message);
  process.exitCode = 1;
});
