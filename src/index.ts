import express, {type Request, type Response } from "express";
import dotenv from "dotenv";

dotenv.config({debug: true});

const app = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
