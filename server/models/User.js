const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide college email ID"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        // Only allow emails ending with @nith.ac.in
        return /^[a-zA-Z0-9._-]+@nith\.ac\.in$/.test(email);
      },
      message: "Please use your college email ID (@nith.ac.in)",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [12, "Password must be at least 12 characters"],
    select: false, // Don't send password in responses by default
  },
  alias: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    select: false,
  },
  otpExpires: {
    type: Date,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  // Set admin status for specific email
  if (this.email === "22dec002@nith.ac.in") {
    this.isAdmin = true;
  }

  // Only hash if password is new or modified
  if (!this.isModified("password")) return next();

  // Hash password with bcrypt (10 rounds)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
