import { Router } from "express";
import { handleSignIn, handleSignOut, handleSignUp } from "../controllers/auth.controller";

const router = Router();

router.post("/sign-up",  handleSignUp);

router.post("/sign-in", handleSignIn);

router.post("/sign-out", handleSignOut);

export default router;
