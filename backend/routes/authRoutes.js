const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.use(requireAuth);
router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.delete("/profile", deleteProfile);

module.exports = router;
