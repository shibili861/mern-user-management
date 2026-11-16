// routes/userRoutes.js
import express from 'express';
import { registerUser, authUser, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);


// Notice we put `protect` in the middle! It intercepts the request before reaching `getUserProfile`
router.get('/profile', protect, getUserProfile);

export default router;