import express from 'express'
import article from './controllers/article.js';
import currencies from './controllers/currencies.js';

const router = express.Router();

router.get('/articles', article.getArticles);
router.get('/currencies', currencies.getCurrencies);
router.get('/listings', currencies.getListings);

router.use((req, res) => {
  res.status(404).send('Service does not exists\nSee : https://doc.localhost.api');
});

export default router