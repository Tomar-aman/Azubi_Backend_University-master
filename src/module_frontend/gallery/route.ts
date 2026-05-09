import express from "express";
import {
  createManageHomePageContent,
  getManageHomePageContents,
  updateManageHomePageContent,
} from "./controller";

const router = express.Router();

// Route to create a new ManageHomePage content with file uploads
router.post("/manage-homepage", createManageHomePageContent);

// Route to get all ManageHomePage contents
router.get("/manage-homepage", getManageHomePageContents);

// Route to update a ManageHomePage content by ID with file uploads
router.put("/manage-homepage", updateManageHomePageContent);

export default router;
