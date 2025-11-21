import { Router } from "express";

const router = Router();

router.post("sign-up", (req, res) => {
  res.send({
    message: "User signed up successfully",
    statusbar: "success",
  });
});

router.post("sign-in", (req, res) => {
  res.send({
    message: "User signed in successfully",
    statusbar: "success",
  });
});

router.post("sign-out", (req, res) => {
  res.send({
    message: "User signed out successfully",
    statusbar: "success",
  });
});

export default router;
