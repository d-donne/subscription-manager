import { Request, Response, NextFunction } from "express";
import Subscription from "../database/models/subscription.model";
import { AppError } from "../middlewares/error.middleware";

export const handleCreateSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await Subscription.create({
      ...req.body,
      user: req.user!._id,
    });

    res.status(201).json({
      message: "Subscription created successfully",
      data: sub,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetUserScriptions = async (req: Request, res: Response, next: NextFunction) => {
  console.log("User ID from params:", req.params.userId);

  console.log("Authenticated User ID:", req.user.userId);
  try {
    if (req.user?.userId !== req.params.userId) {
      throw AppError("You are not authorized to access this resource", 403);
    }
    const subs = await Subscription.find({ user: req.params.userId });
    res.status(200).json({
      message: "Subscriptions retrieved successfully",
      data: subs,
    });
  } catch (error) {
    next(error);
  }
};
