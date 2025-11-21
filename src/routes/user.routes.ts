import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send({
    title: "Get all users",
    message: "List of users fetched successfully",
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.send({
    title: "Get user by ID",
    message: `User with ID ${id} fetched successfully`,
  });
});

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
