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
const Artical_1 = __importDefault(require("../models/Artical"));
const auth_1 = __importDefault(require("../middleware/auth")); // ✅ import AuthRequest
// This is a route object in which we define all the routes related to articles
const router = express_1.default.Router();
// Get all published articles
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if database have any published articles
        const articles = yield Artical_1.default.find({ status: 'published' }).populate('author', 'username');
        // then we send articals to the client in json format
        res.json(articles);
    }
    catch (err) {
        // if there is any error then we send the error message to the client
        res.status(500).json({ error: err.message });
    }
}));
// Get a single article by id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if article is present in the database
        const article = yield Artical_1.default.findById(req.params.id).populate('author', 'username');
        // if article is not present then we send 404 error
        if (!article || article.status !== 'published')
            return res.status(404).json({ msg: 'Article not found' });
        // if article is present then we send the article to the client
        res.json(article);
        // if there is any error then we send the error message to the client
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// Create a new article and auth is required
router.post('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the data from the request body
    const { title, category, body, status } = req.body;
    // check if the data is present in the request body
    if (!title || !category || !body) {
        return res.status(400).json({ msg: 'Please fill all the fields' });
    }
    try {
        // create a new article and save it to the database
        const article = new Artical_1.default({
            title,
            category,
            body,
            author: req.user.id, status
        });
        // save the article to the database
        yield article.save();
        // send the article to the client
        res.status(201).json(article);
    }
    catch (err) {
        // if there is any error then we send the error message to the client
        res.status(400).json({ error: err.message });
    }
}));
// Update an article and auth is required
router.put('/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the data from the request body
    const { title, category, body, status } = req.body;
    // check if the data is present in the request body
    if (!title || !category || !body) {
        return res.status(400).json({ msg: 'Please fill all the fields' });
    }
    try {
        // Check if article is present in the database
        let article = yield Artical_1.default.findById(req.params.id);
        // if article is not present in database then we send 404 error
        if (!article)
            return res.status(404).json({ msg: 'Article not found' });
        // if article is present in the database then we check if the user is the author of the article
        if (article.author.toString() !== req.user.id)
            return res.status(403).json({ msg: 'Not authorized' });
        // if user is the author of the article then we update the article
        article = yield Artical_1.default.findByIdAndUpdate(req.params.id, {
            title,
            category,
            body,
            status,
            updatedAt: Date.now()
        }, { new: true });
        res.json(article);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
// Delete an article and auth is required
router.delete('/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if article is present in the database
        const article = yield Artical_1.default.findById(req.params.id);
        // if article is not present in database then we send 404 error
        if (!article)
            return res.status(404).json({ msg: 'Article not found' });
        // if article is present in the database then we check if the user is the author of the article
        if (article.author.toString() !== req.user.id)
            return res.status(403).json({ msg: 'Not authorized' });
        // if user is the author of the article then we delete the article
        yield Artical_1.default.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Article deleted' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
exports.default = router;
