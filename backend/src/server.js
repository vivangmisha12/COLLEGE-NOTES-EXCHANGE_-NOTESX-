// backend/src/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Import routes
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ==================== MIDDLEWARE ====================
app.use(
  cors({
    origin: "*", // later replace with your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== UPLOADS FOLDER FIX (Render compatible) ====================
const uploadDir = path.join(__dirname, "../uploads/notes");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created uploads folder at:", uploadDir);
}

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/uploads/notes", express.static(uploadDir));


// ==================== ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/admin", adminRoutes);

// Health check (Render requires this)
app.get("/", (req, res) => {
  res.send("College Notes Exchange API is running 🚀");
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
