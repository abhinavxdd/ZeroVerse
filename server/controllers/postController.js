const Post = require("../models/Post");
const generateAlias = require("../utils/aliasGenerator");

exports.getPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    // Find posts from database, sort by newest first (-1 means descending)
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    // Get the data sent from frontend (title, content, category)
    const { title, content, category } = req.body;

    const postData = {
      title,
      content,
      category,
      userId: req.user._id,
      alias: req.user.alias,
    };

    const newPost = await Post.create(postData); // Saved to MongoDB
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } }, // Increase likes by 1
      { new: true } // Return the updated post
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
