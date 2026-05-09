import express from "express";
import {
  createUserBodyValidator,
  generateAccessTokenFromRefreshTokenValidator,
  loginUserBodyValidator,
} from "./auth.schema";
import AuthController from "./auth.controller";
import JoiValidator from "../../utils/joiValidator";

const authRoute = express.Router();
const authController = new AuthController();
const joiValidator = new JoiValidator();
authRoute.post(
  "/create-user",
  joiValidator.validate(createUserBodyValidator, "body"),
  authController.createUser,
);
authRoute.post(
  "/login-user",
  joiValidator.validate(loginUserBodyValidator, "body"),
  authController.loginUser,
);
authRoute.post(
  "/refresh-access-token",
  joiValidator.validate(generateAccessTokenFromRefreshTokenValidator, "body"),
  authController.generateAccessTokenFromRefreshToken,
);
export default authRoute;
