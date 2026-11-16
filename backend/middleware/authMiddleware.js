// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (e.g., "Bearer eyJhbGci..." -> "eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database (excluding their password) and attach it to the request (req.user)
      req.user = await User.findById(decoded.id).select('-password');
      
      // Move to the actual route logic
      next(); 
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was found at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. Admin middleware (Make sure logged-in user is an admin)
export const admin = (req, res, next) => {
  // We can check req.user because the `protect` middleware runs right before this!
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};