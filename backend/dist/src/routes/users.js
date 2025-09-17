"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username, name, age } = req.body;
    if (!email || !password || !username || !name || !age) {
        return res.status(400).send('Please fill all fields');
    }
    const existingUser = yield User_1.default.findOne({ email });
    if (existingUser) {
        return res.status(400).send('User already exists');
    }
    try {
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hash = yield bcryptjs_1.default.hash(password, salt);
        const user = new User_1.default({
            username,
            name,
            age,
            email,
            password: hash
        });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ email: email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token);
        // Send success response (no token)
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err) {
        console.error("Error during registration:", err);
        res.status(500).send("Internal Server Error");
    }
}));
// Login route
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log("body login", req.body);
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: 'Invalid credentials' });
        // Compare the password with the hashed password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
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
}));
exports.default = router;
