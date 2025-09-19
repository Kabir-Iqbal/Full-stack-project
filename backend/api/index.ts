import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import articleRoutes from "../routes/articales";
import userRoutes from '../routes/users';


// Load environment variables from .env file
dotenv.config();
 // Create an instance of an Express application
const app = express();
// Use PORT from environment or default to 5000
const PORT = process.env.PORT || 5000;

//Enable CORS for all routes
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

 // Mount article routes at /api/articles
app.use('/api/articles', articleRoutes);



// Mount user routes at /api/users
app.use('/api/users', userRoutes);




// Connect to MongoDB using Mongoose and handle success or error
mongoose.connect(process.env.MONGO_URI!)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Your routes here
app.get('/', (req, res) => {
    res.send('API is running');
  });


// // Start the Express server on the defined PORT
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// in vercel 
export default app;