require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const adminRouter = require("./routes/adminRouter");
const memberRouter = require("./routes/memberRouter");
const chapterRouter= require("./routes/chapterRouter");
const courseRouter = require('./routes/courseRouter');
const app = express();
const cors = require("cors");

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies/session
  })
);
// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ===== Routes =====
app.use("/api/auth", authRouter);   // Auth endpoints
app.use("/api/admin", adminRouter); // Admin-only
app.use("/api/member", memberRouter); // Member + Admin
app.use('/api/courses/:courseId/chapters', chapterRouter); // Chapter endpoints under course
app.use('/api/courses', courseRouter); // Handles course-related routes

// ===== Default Route =====
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
