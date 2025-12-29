const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error!", err));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ZeroVerse API is running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
