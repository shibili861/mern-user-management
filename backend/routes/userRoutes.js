// routes/userRoutes.js
import express from 'express';
import { 
  registerUser, 
  authUser, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);

// You can chain GET and PUT requests to the same URL!
router.route('/profile')
  .get(protect, getUserProfile)      // Handles GET /api/users/profile
  .put(protect, updateUserProfile);  // Handles PUT /api/users/profile

export default router;