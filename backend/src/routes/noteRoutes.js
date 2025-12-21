// backend/src/routes/noteRoutes.js
import express from 'express';

import {
  uploadNote,
  getNotes,
  getMyNotes,
  rateNote,
  getSubjects,
  approveNote,
  deleteNote,
  updateNote
} from '../controllers/notesController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../utils/fileUpload.js'; // ✅ multer instance

const router = express.Router();

/* -------------------- AUTH REQUIRED -------------------- */
router.use(protect);

/* ✅ SUBJECTS */
router.get('/subjects', getSubjects);

/* ✅ UPLOAD NOTE (PDF) */
router.post(
  '/upload',
  upload.single('file'), // ✅ Multer handles PDF
  uploadNote
);

/* ✅ GET NOTES (dashboard) */
router.get('/', getNotes);

/* ✅ GET MY NOTES */
router.get('/mine', getMyNotes);

/* ✅ RATE NOTE */
router.post('/rate', rateNote);

/* ✅ UPDATE NOTE (title / description only) */
router.put('/:id', updateNote);

/* ✅ DELETE NOTE */
router.delete('/:id', deleteNote);

/* -------------------- ADMIN ONLY -------------------- */
router.put('/:id/approve', admin, approveNote);

export default router;
