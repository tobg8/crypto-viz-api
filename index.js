import eventsource from "eventsource";
import express from "express";
import router from "./routing.js";
import dotenv from "dotenv";
import cors from "cors";

global.EventSource = eventsource;
dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(router);

app.listen(PORT, () => {
  // console.log(?Sprocess.env.POCKETBASE_URL);
  console.log(`Listening on ${PORT} ...`);
});
