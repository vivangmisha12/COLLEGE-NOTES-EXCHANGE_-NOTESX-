import express from "express";
const router = express.Router();

import { protect, admin } from "../middleware/authMiddleware.js";

// Admin Controller
import {
  getAllUsers,
  getAllNotes,
  getAllRatings
} from "../controllers/adminController.js";

// Notes Controller
import {
  approveNote,
  deleteNoteAdmin,
  uploadNoteAdmin,
  getSubjects
} from "../controllers/notesController.js";

// Multer Middleware
import upload from "../utils/fileUpload.js";

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


export default router;
