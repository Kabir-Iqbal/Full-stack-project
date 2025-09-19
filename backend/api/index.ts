import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "../utils/db";
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






// Your routes here
app.get('/', (req, res) => {
    res.send('API is running');
  });


// // Start the Express server on the defined PORT
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB()


// in vercel 
export default app;