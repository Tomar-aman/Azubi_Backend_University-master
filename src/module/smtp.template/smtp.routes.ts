import express from "express";
import SMTPController from "./smtp.controller";
import AuthMiddleware from "../../middleware/authenticator";
import { smtpUpdateValidator } from "./smtp.schema"; // Assuming you have a schema for SMTP updates
import JoiValidator from "../../utils/joiValidator";

const smtpRoute = express.Router();
const smtpController = new SMTPController();
const authMiddleware = new AuthMiddleware();
const joiValidator = new JoiValidator();

// GET SMTP Settings
smtpRoute.get("/", authMiddleware.requireUser, smtpController.getSMTPSettings);

// UPDATE SMTP Settings
smtpRoute.put(
  "/",
  authMiddleware.requireUser,
  joiValidator.validate(smtpUpdateValidator, "body"),
  smtpController.updateSMTPSettings,
);

export default smtpRoute;
