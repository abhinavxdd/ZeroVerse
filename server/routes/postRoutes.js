const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

const {
  getPosts,
  createPost,
  likePost,
  dislikePost,
  getPostById,
  addComment,
  deletePost,
  deleteComment,
  updatePost,
  updateComment,
  getLeaderboard,
} = require("../controllers/postController");

router.get("/", getPosts);
router.get("/leaderboard", getLeaderboard);
router.post("/", protect, upload.array("media", 5), createPost);
router.get("/:id", getPostById);
router.put("/:id", protect, updatePost);
router.put("/:id/like", protect, likePost);
router.put("/:id/dislike", protect, dislikePost);
router.post("/:id/comments", protect, addComment);
router.delete("/:id", protect, deletePost);
router.put("/:id/comments/:commentId", protect, updateComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

module.exports = router;
