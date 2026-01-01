const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateAlias = require("../utils/aliasGenerator");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let alias = generateAlias();

    while (await User.findOne({ alias })) {
      alias = generateAlias();
    }

    const user = await User.create({
      email,
      password,
      alias,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        alias: user.alias,
        isAdmin: user.isAdmin || false,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password (normally hidden)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        alias: user.alias,
        isAdmin: user.isAdmin || false,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's posts
    const Post = require("../models/Post");
    const posts = await Post.find({ userId }).sort({ createdAt: -1 }).lean();

    // Calculate stats
    const totalLikes = posts.reduce(
      (sum, post) => sum + (post.likes?.length || 0),
      0
    );
    const totalDislikes = posts.reduce(
      (sum, post) => sum + (post.dislikes?.length || 0),
      0
    );

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        alias: user.alias,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin || false,
      },
      stats: {
        totalPosts: posts.length,
        totalLikes,
        totalDislikes,
      },
      posts,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 12) {
      return res
        .status(400)
        .json({ message: "Password must be at least 12 characters" });
    }

    // Find user and include password
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all user's posts
    const Post = require("../models/Post");
    await Post.deleteMany({ userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
