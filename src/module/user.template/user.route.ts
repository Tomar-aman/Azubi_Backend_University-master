import express from "express";
import UserController from "./user.controller";
import AuthMiddleware from "../../middleware/authenticator";
import JoiValidator from "../../utils/joiValidator";
import { updateProfileValidator } from "./user.template.schema";

const userRoute = express.Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware();
const joiValidator = new JoiValidator();
userRoute.get("/", authMiddleware.requireUser, userController.getUser);
// New route to update user profile
userRoute.put(
  "/update-profile",
  authMiddleware.requireUser,
  joiValidator.validate(updateProfileValidator, "body"),
  userController.updateProfile,
);
userRoute.get("/reset-link/:email", userController.getForPasswordLink);
userRoute.put("/reset-password", userController.resetPassword);
userRoute.get(
  "/dashboard",
  userController.getAllDashBoardDataHandler,
);
export default userRoute;
