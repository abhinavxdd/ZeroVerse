const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getUserProfile,
  changePassword,
  deleteAccount,
  verifyOTP,
  resendOTP,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.get("/profile", protect, getUserProfile);
router.put("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
