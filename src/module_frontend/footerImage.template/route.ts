import express from "express";
import {
  createFooterPageContent,
  getFooterPageContents,
  updateFooterPageContent,
} from "./controller";

const router = express.Router();

// Route to create a new ManageHomePage content with file uploads
router.post("/hello", createFooterPageContent);

// Route to get all ManageHomePage contents
router.get("/", getFooterPageContents);

// Route to update a ManageHomePage content by ID with file uploads
router.put("/", updateFooterPageContent);

export default router;
