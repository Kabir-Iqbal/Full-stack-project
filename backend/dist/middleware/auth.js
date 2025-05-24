"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// authorization middleware function 
const auth = (req, res, next) => {
    // Get the token from Authorization header and remove 'Bearer '
    const token = req.get('Authorization')?.replace('Bearer ', '');
    // if token is not pressent return unautorized
    if (!token)
        return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        // Verify the token using the secret key and extract payload
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    }
    catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
exports.default = auth;
