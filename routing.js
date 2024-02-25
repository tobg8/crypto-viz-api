import express from "express";
import article from "./controllers/article.js";
import currencies from "./controllers/currencies.js";
import prices from "./controllers/prices.js";
import trends from "./controllers/trends.js"

const router = express.Router();

router.get("/articles", article.getArticles);
router.get("/currencies", currencies.getCurrencies);
router.get("/listings", currencies.getListings);
router.get("/prices/:symbol/:chartType/:range", prices.getPrices);
router.get("/ohlc/:symbol/:chartType/:range", prices.getOhlc);
router.get("/search/trending", trends.getCurrencies)

router.use((req, res) => {
  console.log(req.url)
  res
    .status(404)
    .send("Service does not exists\nSee : https://doc.localhost.api");
});

export default router;
