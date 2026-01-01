const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createConfession,
  getPendingConfessions,
  approveConfession,
  rejectConfession,
  updateConfession,
  deleteConfession,
} = require("../controllers/confessionController");

// POST /api/confessions - Create new AI-moderated confession
router.post("/", protect, createConfession);

// GET /api/confessions/pending - Get pending confessions (for admin)
router.get("/pending", protect, getPendingConfessions);

// PATCH /api/confessions/:id/approve - Approve pending confession
router.patch("/:id/approve", protect, approveConfession);

// DELETE /api/confessions/:id/reject - Reject and delete confession
router.delete("/:id/reject", protect, rejectConfession);

// PATCH /api/confessions/:id - Edit user's own confession (re-moderated by AI)
router.patch("/:id", protect, updateConfession);

// DELETE /api/confessions/:id - Delete user's own confession
router.delete("/:id", protect, deleteConfession);

module.exports = router;
