import mongoose from "mongoose";
import dotenv from 'dotenv';


// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is not defined");
  }
  try {
    await mongoose.connect(mongoUri)
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
  }
};

export default connectDB;