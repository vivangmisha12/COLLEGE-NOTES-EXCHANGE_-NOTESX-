// backend/src/server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// ==================== MIDDLEWARE ====================
app.use(
  cors({
    origin: "*", // later replace with your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));

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
