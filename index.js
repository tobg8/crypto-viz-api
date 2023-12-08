import eventsource from "eventsource";
import express from 'express'
import router from './routing.js'
import dotenv from 'dotenv'

global.EventSource = eventsource;
dotenv.config()
const app = express()
const PORT = 3000;

app.use(router)

app.listen(PORT, () => {
  console.log(`Listening on ${PORT} ...`);
});