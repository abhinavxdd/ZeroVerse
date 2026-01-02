const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const confessionRoutes = require("./routes/confessionRoutes");

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error!", err));

// CORS - Allow frontend to access backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/confessions", confessionRoutes);

app.get("/", (req, res) => {
  res.send("ZeroVerse API is running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
