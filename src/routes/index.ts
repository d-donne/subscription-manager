import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import subscriptionRoutes from "./subscription.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/subscriptions", subscriptionRoutes);

export default router;
