const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getPosts,
  createPost,
  likePost,
  dislikePost,
} = require("../controllers/postController");

router.get("/", getPosts);
router.post("/", protect, createPost);
router.put("/:id/like", protect, likePost);
router.put("/:id/dislike", protect, dislikePost);

module.exports = router;
