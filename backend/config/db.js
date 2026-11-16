// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Attempt to connect to the database using the URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // If the database fails to connect, kill the server entirely
    process.exit(1); 
  }
};

export default connectDB;