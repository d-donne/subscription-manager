import express, {type Request, type Response } from "express";
import { PORT } from "./config/env.js";

console.log(`Environment Port: ${PORT}`);

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Subscription Manager!");
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
