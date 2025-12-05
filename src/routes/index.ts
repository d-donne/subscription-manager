import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import subscriptionRoutes from "./subscription.routes";
import { authorizeUser } from "../middlewares/auth.middleware";
import workflowRoutes from "./workflow.routes";

const router = Router();

router.use("/users", authorizeUser, userRoutes);
router.use("/auth", authRoutes);
router.use("/subscriptions", authorizeUser, subscriptionRoutes);
router.use("/workflows", workflowRoutes);

export default router;
