import { config } from "dotenv";

config({ debug: true, path: `.env.${process.env.NODE_ENV || "local"}`, encoding: "UTF-8" });

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN } = process.env;
