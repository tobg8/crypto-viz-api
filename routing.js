import express from 'express'
import article from './controllers/article.js';

const router = express.Router();

router.get('/articles', article.getArticles);

router.use((req, res) => {
  res.status(404).send('Service does not exists\nSee : https://doc.localhost.api');
});

export default router