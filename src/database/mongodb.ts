import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env";

if (!DB_URI) {
  throw new Error("DB_URI is not defined in environment variables");
}

export const connectToDB = async () => {
  try {
    await mongoose.connect(DB_URI!);
    console.log(`Connected to MongoDB database in ${NODE_ENV} mode`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
