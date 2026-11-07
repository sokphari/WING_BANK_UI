const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomInt } = require("node:crypto");

const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function makeAccountNumber() {
  return Array.from({ length: 12 }, () => randomInt(0, 10)).join("");
}

async function makeUniqueAccountNumber(connection) {
  let accountNumber;
  let rows;

  do {
    accountNumber = makeAccountNumber();
    [rows] = await connection.execute(
      "SELECT id FROM accounts WHERE account_number = ? LIMIT 1",
      [accountNumber],
    );
  } while (rows.length > 0);

  return accountNumber;
}

async function register(req, res) {
  const pool = req.app.locals.pool;
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password." });
  }
  if (!emailOk(email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    if (existing.length > 0) {
      await connection.rollback();
      return res
        .status(409)
        .json({ message: "This email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [userResult] = await connection.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, passwordHash],
    );

    const accountNumber = await makeUniqueAccountNumber(connection);
    await connection.execute(
      `INSERT INTO accounts (user_id, account_number, account_type, balance, currency)
       VALUES (?, ?, 'Savings', 0.00, 'USD')`,
      [userResult.insertId, accountNumber],
    );

    await connection.commit();
    return res.status(201).json({
      message: "Registration successful! Please login.",
      user: { id: userResult.insertId, name, email },
    });
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "This email is already registered." });
    }
    console.error("REGISTER ERROR:", error.message);
    return res.status(500).json({ message: "Registration failed." });
  } finally {
    connection.release();
  }
}

async function login(req, res) {
  const pool = req.app.locals.pool;
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }
  if (!process.env.JWT_SECRET) {
    console.error("LOGIN ERROR: JWT_SECRET is not configured.");
    return res
      .status(500)
      .json({ message: "Login is not configured on the server." });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    return res.status(500).json({ message: "Login failed." });
  }
}

async function getProfile(req, res) {
  try {
    let rows;
    try {
      [rows] = await req.app.locals.pool.execute(
        "SELECT id, name, email, avatar, created_at FROM users WHERE id = ? LIMIT 1",
        [req.userId],
      );
    } catch (error) {
      if (error.code !== "ER_BAD_FIELD_ERROR") throw error;
      [rows] = await req.app.locals.pool.execute(
        "SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1",
        [req.userId],
      );
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Profile not found." });
    }
    return res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error.message);
    return res.status(500).json({ message: "Failed to load profile." });
  }
}

async function updateProfile(req, res) {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }
  if (!emailOk(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  const hasAvatar = Object.prototype.hasOwnProperty.call(req.body || {}, "avatar");
  const avatar = req.body?.avatar;
  if (
    hasAvatar && avatar !== null &&
    (typeof avatar !== "string" || avatar.length > 850000 ||
      !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(avatar))
  ) {
    return res.status(400).json({ message: "Profile image is invalid or too large." });
  }

  try {
    const updateSql = hasAvatar
      ? "UPDATE users SET name = ?, email = ?, avatar = ? WHERE id = ?"
      : "UPDATE users SET name = ?, email = ? WHERE id = ?";
    const updateParams = hasAvatar
      ? [name, email, avatar, req.userId]
      : [name, email, req.userId];
    let hasAvatarColumn = true;
    try {
      await req.app.locals.pool.execute(updateSql, updateParams);
    } catch (error) {
      if (error.code !== "ER_BAD_FIELD_ERROR" || !hasAvatar || avatar !== null) throw error;
      hasAvatarColumn = false;
      await req.app.locals.pool.execute(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, req.userId],
      );
    }

    let rows;
    try {
      [rows] = await req.app.locals.pool.execute(
        "SELECT id, name, email, avatar, created_at FROM users WHERE id = ? LIMIT 1",
        [req.userId],
      );
    } catch (error) {
      if (error.code !== "ER_BAD_FIELD_ERROR") throw error;
      hasAvatarColumn = false;
      [rows] = await req.app.locals.pool.execute(
        "SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1",
        [req.userId],
      );
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Profile not found." });
    }
    return res.status(200).json({
      message: hasAvatarColumn ? "Profile updated." : "Profile updated. Apply the profile image database migration to save photos.",
      user: { avatar: null, ...rows[0] },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "That email is already in use." });
    }
    console.error("UPDATE PROFILE ERROR:", error.message);
    return res.status(500).json({ message: "Failed to update profile." });
  }
}

async function deleteProfile(req, res) {
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!password) {
    return res.status(400).json({ message: "Enter your password to delete your profile." });
  }

  try {
    const [rows] = await req.app.locals.pool.execute(
      "SELECT password FROM users WHERE id = ? LIMIT 1",
      [req.userId],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Profile not found." });
    }
    if (!(await bcrypt.compare(password, rows[0].password))) {
      return res.status(401).json({ message: "Password is incorrect." });
    }

    await req.app.locals.pool.execute("DELETE FROM users WHERE id = ?", [req.userId]);
    return res.status(200).json({ message: "Profile deleted." });
  } catch (error) {
    console.error("DELETE PROFILE ERROR:", error.message);
    return res.status(500).json({ message: "Failed to delete profile." });
  }
}

module.exports = { register, login, getProfile, updateProfile, deleteProfile };
