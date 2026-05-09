import express from "express";
import ManageKeyController from "./manageKey.controller";
import AuthMiddleware from "../../middleware/authenticator";
import { editKeyValidator } from "./manageKey.schema";
import JoiValidator from "../../utils/joiValidator";

const manageKeyRoute = express.Router();
const manageKeyController = new ManageKeyController();
const authMiddleware = new AuthMiddleware();
const joiValidator = new JoiValidator();
manageKeyRoute.get(
  "/",
  authMiddleware.requireUser,
  manageKeyController.getAllKeys,
);

manageKeyRoute.put(
  "/",
  authMiddleware.requireUser,
  joiValidator.validate(editKeyValidator, "body"),
  manageKeyController.editKey,
);

export default manageKeyRoute;
