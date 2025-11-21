import { Router } from "express";

const router = Router()

router.get("/", (req, res) => {
  res.send({
    title: "Get all subscriptions",
    message: "List of subscriptions fetched successfully",
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.send({
    title: "Get subscription by ID",
    message: `Subscription with ID ${id} fetched successfully`,
  });
});

router.post("/", (req, res) => {
  res.send({
    title: "Create new subscription",
    message: "Subscription created successfully",
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.send({
    title: "Update subscription by ID",
    message: `Subscription with ID ${id} updated successfully`,
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.send({
    title: "Delete subscription by ID",
    message: `Subscription with ID ${id} deleted successfully`,
  });
});

router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;
  res.send({
    title: "Get subscriptions by User ID",
    message: `Subscriptions for User ID ${userId} fetched successfully`,
  });
});

router.put("/:id/cancel", (req, res) => {
  const { id } = req.params;
  res.send({
    title: "Cancel subscription by ID",
    message: `Subscription with ID ${id} cancelled successfully`,
  });
});

router.get("/upcoming-renewals", (req, res) => {
  res.send({
    title: "Get upcoming renewals",
    message: "List of subscriptions with upcoming renewals fetched successfully",
  });
});

export default router;
