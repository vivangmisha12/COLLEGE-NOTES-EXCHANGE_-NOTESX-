// backend/src/routes/noteRoutes.js
const express = require('express');

const {
  uploadNote,
  getNotes,
  getMyNotes,
  rateNote,
  getSubjects,
  approveNote,
  deleteNote,
  updateNote
} = require('../controllers/notesController');

const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../utils/fileUpload'); // ✅ multer instance

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

module.exports = router;
