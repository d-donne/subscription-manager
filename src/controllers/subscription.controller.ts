import { Request, Response, NextFunction } from "express";
import Subscription from "../database/models/subscription.model";
import { AppError } from "../middlewares/error.middleware";
import { upstashWorkflowClient } from "../config/upstash";
import { SERVER_URL } from "../config/env";

export const handleCreateSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await Subscription.create({
      ...req.body,
      user: req.user!._id,
    });

    await upstashWorkflowClient.trigger({
      url: `${SERVER_URL}/api/workflows/subscription/reminder`,
      body: {
        subscriptionId: sub.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
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
