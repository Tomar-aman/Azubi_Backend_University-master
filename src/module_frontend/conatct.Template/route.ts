import { Router } from "express";
import ContactFormController from "./controller"; // Adjust the path based on your structure

const router = Router();

// Route to create or update Contact Form
router.post("/contact-form", ContactFormController.createOrUpdateContactForm);

// Route to get Contact Form by ID
router.get("/contact-form", ContactFormController.getContactForm);

export default router;
