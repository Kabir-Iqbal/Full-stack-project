import express, { Request, Response } from 'express';
import Article from '../models/Artical';
import auth, { AuthRequest } from '../middleware/auth'; // ✅ import AuthRequest

// This is a route object in which we define all the routes related to articles
const router = express.Router();

// Get all published articles
router.get('/',  async (req: AuthRequest, res: Response) => {
  try {
    // Check if database have any published articles
    const articles = await Article.find({ status: 'published' }).populate('author', 'username');
    
    
    // then we send articals to the client in json format
    res.json(articles);
    
  } catch (err) {
    // if there is any error then we send the error message to the client
    res.status(500).json({ error: (err as Error).message });
  }
});


// Get a single article by id
router.get('/:id', async (req: AuthRequest, res: Response) : Promise<any> => {
  try {
    // Check if article is present in the database
    const article = await Article.findById(req.params.id).populate('author', 'username');
    // if article is not present then we send 404 error
    if (!article || article.status !== 'published') return res.status(404).json({ msg: 'Article not found' });
    // if article is present then we send the article to the client
    res.json(article);
    // if there is any error then we send the error message to the client
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});


// Create a new article and auth is required
router.post('/', auth,  async (req: AuthRequest, res: Response):Promise<any> => {
  // get the data from the request body
  const { title, category, body, status } = req.body;
  
  // check if the data is present in the request body
  if (!title || !category || !body) {
    return res.status(400).json({ msg: 'Please fill all the fields' });
  }

  try {
    // create a new article and save it to the database
    const article = new Article({
      title,
      category,
      body, 
      author: req.user!.id, status 
    });
    // save the article to the database
    await article.save();

    // send the article to the client
    res.status(201).json(article);
  } catch (err) {
    // if there is any error then we send the error message to the client
    res.status(400).json({ error: (err as Error).message });
  }
});


// Update an article and auth is required
router.put('/:id', auth, async (req: AuthRequest, res: Response):Promise<any> => {
  // get the data from the request body
  const { title, category, body, status } = req.body;

  
  // check if the data is present in the request body
  if (!title || !category || !body) {
    return res.status(400).json({ msg: 'Please fill all the fields' });
  }

  try {
    // Check if article is present in the database
    let article = await Article.findById(req.params.id);
    // if article is not present in database then we send 404 error
    if (!article) return res.status(404).json({ msg: 'Article not found' });

    // if article is present in the database then we check if the user is the author of the article
    if (article.author.toString() !== req.user!.id) return res.status(403).json({ msg: 'Not authorized' });
    // if user is the author of the article then we update the article
    article = await Article.findByIdAndUpdate(req.params.id, {
      title,
      category,
      body,
      status,
      updatedAt: Date.now() }, { new: true });
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});


// Delete an article and auth is required
router.delete('/:id', auth, async (req: AuthRequest, res: Response):Promise<any> => {
  try {
    // Check if article is present in the database
    const article = await Article.findById(req.params.id);
    // if article is not present in database then we send 404 error
    if (!article) return res.status(404).json({ msg: 'Article not found' });

    // if article is present in the database then we check if the user is the author of the article
    if (article.author.toString() !== req.user!.id) return res.status(403).json({ msg: 'Not authorized' });
    // if user is the author of the article then we delete the article
    await Article.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Article deleted' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;