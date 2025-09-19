"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../utils/db"));
const articales_1 = __importDefault(require("../routes/articales"));
const users_1 = __importDefault(require("../routes/users"));
// Load environment variables from .env file
dotenv_1.default.config();
// Create an instance of an Express application
const app = (0, express_1.default)();
// Use PORT from environment or default to 5000
const PORT = process.env.PORT || 5000;
//Enable CORS for all routes
app.use((0, cors_1.default)());
// Parse incoming JSON requests
app.use(express_1.default.json());
// Mount article routes at /api/articles
app.use('/api/articles', articales_1.default);
// Mount user routes at /api/users
app.use('/api/users', users_1.default);
// Your routes here
app.get('/', (req, res) => {
    res.send('API is running');
});
// // Start the Express server on the defined PORT
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
(0, db_1.default)();
// in vercel 
exports.default = app;
