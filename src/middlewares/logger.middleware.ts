import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // Log request body for POST/PUT requests
  if (["POST", "PUT"].includes(req.method) && req.body) {
    // skip logging workflow body
    if (!req.url.includes("/workflows/")) {
      console.log("Request body:", JSON.stringify(req.body, null, 2));
    }
  }
  next();
};

// logging
export const logMessage = (message: string) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};
