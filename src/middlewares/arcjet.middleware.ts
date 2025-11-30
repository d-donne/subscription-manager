import { Request, Response, NextFunction } from "express";
import { aj } from "../config/arcjet";
import { logMessage } from "./logger.middleware";

export const arcjetMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    logMessage(`Arcjet ${decision.isDenied() ? "Decision Denied" : "Decision Allowed"}: ${JSON.stringify(decision.reason)}`);
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return res.status(429).json({ message: "Too Many Requests. Rate limit exceeded." });
      if (decision.reason.isBot()) return res.status(403).json({ message: "Access denied. Bot detected" });
      return res.status(403).json({ message: "Access denied." });
    }

    next();
  } catch (error) {
    logMessage(`Arcjet Middleware Error: ${error}`);
    next(error);
  }
};
