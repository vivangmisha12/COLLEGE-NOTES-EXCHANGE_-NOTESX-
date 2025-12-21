// backend/src/routes/authRoutes.js
import express from 'express';
import { registerStudent, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Debug: log that this module was required and what controller exports look like
try {
	console.log('authRoutes loaded - registerStudent:', typeof registerStudent);
	console.log('authRoutes loaded - loginUser:', typeof loginUser);
} catch (err) {
	console.log('authRoutes debug error:', err.message);
}

router.post('/register', registerStudent);
router.post('/login', loginUser);

export default router;