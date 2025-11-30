import express, { type Request, type Response } from "express";
import router from "./routes";
import { PORT } from "./config/env";
import { connectToDB } from "./database/mongodb";
import { errorHandler } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";
import { logger } from "./middlewares/logger.middleware";
import { arcjetMiddleware } from "./middlewares/arcjet.middleware";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);
app.use(logger);

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Subscription Manager!");
});

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  await connectToDB();
});
