import { Request } from "express";

// Extend Express Request type to include our authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// This is kept for backward compatibility
export interface AuthenticatedRequest extends Request {
  user: any;
}
