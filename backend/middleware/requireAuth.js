const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : null;

  if (!token) {
    return res.status(401).json({ message: "Please login to continue." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id ?? decoded.userId ?? decoded.user_id;
    if (userId === undefined || userId === null || userId === "") {
      return res.status(401).json({ message: "Login token has no user ID." });
    }
    req.userId = userId;
    return next();
  } catch {
    return res.status(401).json({ message: "Your session expired. Please login again." });
  }
}

module.exports = requireAuth;
