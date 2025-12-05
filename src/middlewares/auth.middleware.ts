import { NextFunction, Request, Response } from "express";
import { AppError } from "./error.middleware";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import User from "../database/models/user.model";

export const authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw AppError("Authentication token missing", 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && typeof decoded === "object") {
      const user = await User.findById(decoded.id);

      if (!user) {
        throw AppError("Unauthorized", 401);
      }
      req.user = user;
      next();
    } else {
      throw AppError("Invalid authentication token", 401);
    }
  } catch (error) {
    next(error);
  }
};
