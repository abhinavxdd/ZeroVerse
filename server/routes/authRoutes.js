const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getUserProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protect, getUserProfile);
router.put("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
