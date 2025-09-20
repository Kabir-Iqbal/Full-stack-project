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


// import { Router, Request, Response } from 'express';
// import { MongoClient } from 'mongodb';
// import { IArticle } from '../models/Artical'; // Spelling confirm karo: Article ya Artical?

// const router = Router();

// // Get all articles
// router.get('/', async (req: Request, res: Response) => {
//   try {
//     const client = req.app.locals.dbClient as MongoClient;
//     const db = client.db('your_db_name'); // Apna DB name dalo
//     const articles = await db.collection('articles').find<IArticle>({}).toArray();
//     res.json(articles);
//   } catch (error) {
//     res.status(500).json({ error: 'Articles fetch karne mein error' });
//   }
// });

// // Add a new article
// router.post('/', async (req: Request, res: Response) => {
//   try {
//     const client = req.app.locals.dbClient as MongoClient;
//     const db = client.db('your_db_name'); // Apna DB name dalo
//     const article: IArticle = {
//       title: req.body.title,
//       category: req.body.category,
//       body: req.body.body,
//       author: req.body.author, // User ID as string
//       status: req.body.status || 'draft',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };
//     const result = await db.collection('articles').insertOne(article);
//     res.status(201).json({ id: result.insertedId, ...article });
//   } catch (error) {
//     res.status(500).json({ error: 'Article create karne mein error' });
//   }
// });

// export default router;