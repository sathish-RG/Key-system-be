const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Connect Mongo
mongoose.connect(process.env.MONGO_URI);

// Routes
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

module.exports = app;