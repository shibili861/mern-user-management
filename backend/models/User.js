// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Library to encrypt passwords

// 1. Define the Schema (Blueprint)
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // No two users can have the same email
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "", // Default is empty until they upload an image
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // Everyone is a normal user by default
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// 2. Hash password BEFORE saving to the database
userSchema.pre('save', async function () {
  // If the password hasn't been modified, just return to move on safely
  if (!this.isModified('password')) {
    return; 
  }

  // Generate a 'salt' (random data added to the password to make it harder to crack)
  const salt = await bcrypt.genSalt(10);
  // Hash the password combined with the salt
  this.password = await bcrypt.hash(this.password, salt);
});

// 3. Create a custom method to check if an entered password matches the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Create and export the model
const User = mongoose.model('User', userSchema);

export default User;