const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getPosts,
  createPost,
  likePost,
} = require("../controllers/postController");

router.get("/", getPosts);
router.post("/", protect, createPost);
router.put("/:id/like", protect, likePost);

module.exports = router;
