import { Request, Response, NextFunction } from "express";
import { NODE_ENV } from "../config/env";

interface AppError extends Error {
  code?: number;
  statusCode?: number;
  status?: string;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  // Set  default status code and status message if not provided
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Error types
  switch (err.name ) {
    case "CastError": // Mongoose bad ObjectId
      err.statusCode = 404;
      err.message = `Resource not found`;
      break;
    case "MongooseError":
      if (err.code === 11000) { // Mongoose duplicate key
        err.statusCode = 400;
        err.message = `Duplicate field value entered`;
      }
      break;
    case "ValidationError": // Mongoose validation errors
      const messages = Object.values((err as any).errors).map((val: any) => val.message);
      err.message = `Invalid input data: ${messages.join(". ")}`;
      err.statusCode = 400;
      break;
    default:
      break;
  }


  if (NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // send generic message in production
    if (err.statusCode === 500) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    } else {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
  }
};


