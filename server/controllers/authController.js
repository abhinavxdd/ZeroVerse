const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateAlias = require("../utils/aliasGenerator");
const { generateOTP, sendOTPEmail } = require("../utils/emailService");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists but not verified, allow re-sending OTP
      if (!existingUser.isEmailVerified) {
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        existingUser.password = password; // Update password in case they changed it
        await existingUser.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp);
        if (!emailResult.success) {
          return res.status(500).json({ message: "Failed to send OTP email" });
        }

        return res.status(200).json({
          message: "OTP resent to your email",
          userId: existingUser._id,
          requiresVerification: true,
        });
      }
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate unique alias
    let alias = generateAlias();
    while (await User.findOne({ alias })) {
      alias = generateAlias();
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create user (not verified yet)
    const user = await User.create({
      email,
      password,
      alias,
      otp,
      otpExpires,
      isEmailVerified: false,
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      // Delete user if email fails to send
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(201).json({
      message:
        "OTP sent to your email. Please verify to complete registration.",
      userId: user._id,
      requiresVerification: true,
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

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message:
          "Account not verified. Please complete your signup by verifying your email.",
      });
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

// Verify OTP and complete registration
exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID and OTP are required" });
    }

    // Find user and include OTP fields
    const user = await User.findById(userId).select("+otp +otpExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (!user.otp || !user.otpExpires) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new one." });
    }

    // Check if OTP has expired
    if (new Date() > user.otpExpires) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark email as verified and clear OTP
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token for automatic login
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Email verified successfully",
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

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select("+otp +otpExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(user.email, otp);
    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({
      message: "OTP resent to your email",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
