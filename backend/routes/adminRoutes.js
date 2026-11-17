import express from 'express';
// 1. Add createUser to your import list
import { getUsers, deleteUser, getUserById, updateUser, createUser } from '../controllers/adminController.js'; 
import { protect, admin } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// 2. Add the POST route to the top grouping
router.route('/users')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser); // NEW: Create User route

router.route('/users/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;