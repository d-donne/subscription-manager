import express, { type Request, type Response } from "express";
import router from "./routes";
import { PORT } from "./config/env";
import { connectToDB } from "./database/mongodb";

const app = express();

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Subscription Manager!");
});

app.listen(PORT, async   () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  await connectToDB();
});
