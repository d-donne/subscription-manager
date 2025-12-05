import { Router } from "express";
import { handleSendReminders } from "../controllers/workflow.controller";

const router = Router();

router.post("/subscription/reminder", handleSendReminders);

export default router;
