import User from '../models/User.js';

// @desc    Get all users (Admin dashboard)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    // Fetch all users, excluding their passwords
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Prevent the admin from deleting themselves
      if (req.user._id.toString() === user._id.toString()) {
        return res.status(400).json({ message: 'You cannot delete yourself' });
      }

      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
};




export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user details' });
  }
};


export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // We only update isAdmin if it was explicitly sent in the request
      if (req.body.isAdmin !== undefined) {
        user.isAdmin = req.body.isAdmin;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email is already in use by another account' });
    }
    res.status(500).json({ message: 'Server error updating user' });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Your User model's pre-save hook will automatically hash this password
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: isAdmin || false,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error creating user' });
  }
};