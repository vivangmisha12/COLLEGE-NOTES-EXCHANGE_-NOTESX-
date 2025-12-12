const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

// Admin Controller
const {
  getAllUsers,
  getAllNotes,
  getAllRatings
} = require("../controllers/adminController");

// Notes Controller
const {
  approveNote,
  deleteNoteAdmin,
  uploadNoteAdmin,
  getSubjects
} = require("../controllers/notesController");

// Multer Middleware
const upload = require("../utils/fileUpload");

// ---------------- MIDDLEWARE ----------------
router.use(protect);
router.use(admin);

// ---------------- ADMIN ROUTES ----------------

// Users list
router.get("/users", getAllUsers);

// Notes list
router.get("/notes", getAllNotes);

// Ratings list
router.get("/ratings", getAllRatings);

// Subjects list (ADMIN upload needs this)
router.get("/subjects", getSubjects);

// Approve / Reject
router.put("/notes/:id/approve", approveNote);

// Delete note
router.delete("/notes/:id", deleteNoteAdmin);

// Admin Upload PDF
router.post("/upload", upload.single("file"), uploadNoteAdmin);

module.exports = router;
