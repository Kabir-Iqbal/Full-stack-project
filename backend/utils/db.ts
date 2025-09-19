import mongoose from "mongoose";
import dotenv from 'dotenv';


// Connect to MongoDB using Mongoose and handle success or error


// .catch((err) => console.error("MongoDB connection error:", err));

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log("MongoDB connected"))
   
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
  }
};

export default connectDB;
