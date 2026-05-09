import express from "express";
import {
  createTabs,
  getTabs,
  getTabById,
  updateTabById,
  deleteTabById,
} from "./controller";

const router = express.Router();

// Route to create a new set of tabs
router.post("/tabs", createTabs);

// Route to get all sets of tabs
router.get("/tabs", getTabs);

// Route to get a single set of tabs by ID
router.get("/tabs/:id", getTabById);

// Route to update a set of tabs by ID
router.put("/tabs", updateTabById);

// Route to soft delete a set of tabs by ID
router.delete("/tabs/:id", deleteTabById);

export default router;
