import { config } from "dotenv";

config({ debug: true, path: `.env.${process.env.NODE_ENV || "local"}` });

export const { PORT, NODE_ENV, DB_URI } = process.env;
