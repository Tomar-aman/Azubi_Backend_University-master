import express from "express";
import {
  createManageCitiesContent,
  getManageCitiesContent,
  getManageCitiesContentById,
  updateManageCitiesContentById,
  deleteManageCitiesContentById,
} from "./controller";

const router = express.Router();

// Route to create a new ManageCitiesContent
router.post("/manage-cities-content", createManageCitiesContent);

// Route to get all ManageCitiesContent
router.get("/manage-cities-content", getManageCitiesContent);

// Route to get a single ManageCitiesContent by ID
router.get("/manage-cities-content/:id", getManageCitiesContentById);

// Route to update a ManageCitiesContent by ID
router.put("/manage-cities-content", updateManageCitiesContentById);

// Route to soft delete a ManageCitiesContent by ID
router.delete("/manage-cities-content/:id", deleteManageCitiesContentById);

export default router;
