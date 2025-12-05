import { config } from "dotenv";
import { SignOptions } from "jsonwebtoken";
import z from "zod";

config({ debug: true, path: `.env.${process.env.NODE_ENV || "local"}`, encoding: "UTF-8" });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test", "local"]),
  PORT: z.coerce.number(),
  SERVER_URL: z.url(),
  DB_URI: z.url(),

  JWT_SECRET: z.string().min(12),
  JWT_EXPIRES_IN: z.string().transform((val) => val as SignOptions["expiresIn"]),

  ARCJET_ENV: z.enum(["development", "production", "test", "local"]).optional(),
  ARCJET_KEY: z.string(),

  QSTASH_URL: z.url(),
  QSTASH_TOKEN: z.string(),
  QSTASH_CURRENT_SIGNING_KEY: z.string().optional(),
  QSTASH_NEXT_SIGNING_KEY: z.string().optional(),
});

const env = envSchema.parse(process.env); // throws if invalid/missing
export const {
  PORT,
  NODE_ENV,
  SERVER_URL,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_ENV,
  ARCJET_KEY,
  QSTASH_URL,
  QSTASH_TOKEN,
  QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY,
} = env;
