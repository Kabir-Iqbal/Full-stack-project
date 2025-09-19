import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();



// Register route
router.post('/register', async (req: Request, res: Response): Promise<any> => {
  const { email, password, username, name, age } = req.body;
  if (!email || !password || !username || !name || !age) {
    return res.status(400).send('Please fill all fields');
  }
 

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      name,
      age,
      email,
      password: hash
    });

    await user.save();
 

    const token = jwt.sign({ email: email, userId: user._id }, process.env.JWT_SECRET!,{ expiresIn: '1d' });
    res.cookie("token", token);

    // Send success response (no token)
    res.status(201).json({ message: 'User registered successfully' });

    
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send("Internal Server Error");
  }
});



// Login route
router.post('/login', async (req: Request, res: Response, next:NextFunction): Promise<any> => {
  const { email, password } = req.body;
  console.log("body login", req.body);
  
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    
    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If the password doesn't match, return an error
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
                                                                               // this token will expire in 1 hour
    // If the password matches, create a JWT token and send it to the client
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    res.json({ "token" : token, "LoggedIn" : user.username});  //  Yeh frontend ko token dega

    
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;