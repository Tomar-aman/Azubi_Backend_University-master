import { Router } from "express";
import ContactController from "./ContactController";

const router = Router();

// Route to create or update the contact record
router.post("/contact", ContactController.upsertContact);

// Route to get the contact record
router.get("/contact", ContactController.getContact);

export default router;
