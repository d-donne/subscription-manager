import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // Log request body for POST/PUT requests
  if (["POST", "PUT"].includes(req.method) && req.body) {
    console.log("Request body:", JSON.stringify(req.body, null, 2));
  }
  next();
};
