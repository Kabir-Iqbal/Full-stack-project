"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Register route
router.post('/register', async (req, res) => {
    const { email, password, username, name, age } = req.body;
    if (!email || !password || !username || !name || !age) {
        return res.status(400).send('Please fill all fields');
    }
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        return res.status(400).send('User already exists');
    }
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        const hash = await bcryptjs_1.default.hash(password, salt);
        const user = new User_1.default({
            username,
            name,
            age,
            email,
            password: hash
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ email: email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token);
        // Send success response (no token)
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err) {
        console.error("Error during registration:", err);
        res.status(500).send("Internal Server Error");
    }
});
// Login route
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    console.log("body login", req.body);
    try {
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: 'Invalid credentials' });
        // Compare the password with the hashed password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        // If the password doesn't match, return an error
        if (!isMatch)
            return res.status(400).json({ msg: 'Invalid credentials' });
        // this token will expire in 1 hour
        // If the password matches, create a JWT token and send it to the client
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ "token": token, "LoggedIn": user.username }); //  Yeh frontend ko token dega
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
// import { Router, Request, Response } from 'express';
// import { MongoClient } from 'mongodb';
// import { IUser } from '../models/User';
// const router = Router();
// // Get all users
// router.get('/', async (req: Request, res: Response) => {
//   try {
//     const client = req.app.locals.dbClient as MongoClient;
//     const db = client.db('your_db_name'); // Apna DB name dalo
//     const users = await db.collection('users').find<IUser>({}).toArray();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: 'Users fetch karne mein error' });
//   }
// });
// // Add a new user
// router.post('/', async (req: Request, res: Response) => {
//   try {
//     const client = req.app.locals.dbClient as MongoClient;
//     const db = client.db('your_db_name'); // Apna DB name dalo
//     const user: IUser = {
//       username: req.body.username,
//       email: req.body.email,
//       password: req.body.password,
//       name: req.body.name,
//       age: req.body.age,
//     };
//     const result = await db.collection('users').insertOne(user);
//     res.status(201).json({ id: result.insertedId, ...user });
//   } catch (error) {
//     res.status(500).json({ error: 'User create karne mein error' });
//   }
// });
// export default router;
