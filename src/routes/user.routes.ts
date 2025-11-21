import { Router } from "express";
import { handleGetUserById, handleGetUsers } from "../controllers/user.controller";

const router = Router();

router.get("/", handleGetUsers);

router.get("/:id", handleGetUserById);

router.post("/", (req, res) => {
  res.send({
    title: "Create new user",
    message: "User created successfully",
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.send({
    title: "Update user by ID",
    message: `User with ID ${id} updated successfully`,
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.send({
    title: "Delete user by ID",
    message: `User with ID ${id} deleted successfully`,
  });
});

export default router;
