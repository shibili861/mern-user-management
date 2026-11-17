// controllers/userController.js
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if the user already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create the new user (Password hashing happens automatically in User.js!)
    const user = await User.create({
      name,
      email,
      password,
    });

    // 3. If created successfully, send back the user data AND the token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
        token: generateToken(user._id), // Send the digital keycard!
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists AND if the password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getUserProfile = async (req, res) => {
  // req.user was securely attached by our 'protect' middleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update the fields
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      if (req.body.profileImage) {
        user.profileImage = req.body.profileImage;
      }

      // We wrap the save() in its own try/catch to specifically catch the MongoDB email duplicate error
      try {
        const updatedUser = await user.save();
      generateToken(updatedUser._id, res);
        // Send back ALL data, crucially including isAdmin and profileImage
        res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin, 
          profileImage: updatedUser.profileImage,
        });
      } catch (saveError) {
        
        if (saveError.code === 11000) {
          return res.status(400).json({ message: 'Email is already in use by another account' });
        }
        throw saveError; // Pass any other error down to the main catch block
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Profile Update Crash:", error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};