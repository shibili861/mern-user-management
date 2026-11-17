// routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Configure Multer to hold the uploaded file in memory temporarily
// Configure Multer to hold the uploaded file in memory temporarily
const storage = multer.memoryStorage();

// Add a 5MB file size limit to prevent 413 and ECONNRESET errors
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 Megabytes
  }
});


// @route   POST /api/upload
// @desc    Upload image to Cloudinary and return the URL
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Stream the file from memory directly to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'user_management_profiles' }, // Creates this folder in your Cloudinary dashboard
      (error, result) => {
        if (error) {
          console.error('Cloudinary Error:', error);
          return res.status(500).json({ message: 'Image upload failed' });
        }
        // Send the secure image URL back to React
        res.json({ imageUrl: result.secure_url });
      }
    );

    // Trigger the stream
    uploadStream.end(req.file.buffer);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;