const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getPosts,
  createPost,
  likePost,
  dislikePost,
  getPostById,
  addComment,
  deletePost,
  deleteComment,
} = require("../controllers/postController");

router.get("/", getPosts);
router.post("/", protect, createPost);
router.get("/:id", getPostById);
router.put("/:id/like", protect, likePost);
router.put("/:id/dislike", protect, dislikePost);
router.post("/:id/comments", protect, addComment);
router.delete("/:id", protect, deletePost);
router.delete("/:id/comments/:commentId", protect, deleteComment);

module.exports = router;
