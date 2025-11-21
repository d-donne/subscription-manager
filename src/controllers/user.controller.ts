import { NextFunction, Request, Response } from "express";
import User from "../database/models/user.model";
import { AppError } from "../middlewares/error.middleware";

export const handleGetUsers = async (req:Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export const handleGetUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw AppError("User not found", 404);
    }

    res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
    
  } catch (error) {
    next(error);
  }
}
