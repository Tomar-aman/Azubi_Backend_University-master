import express from "express";
import ManagedUserController from "./managedUser.controller";
import AuthMiddleware from "../../middleware/authenticator";

const managedUserRoute = express.Router();
const ctrl = new ManagedUserController();
const authMiddleware = new AuthMiddleware();

managedUserRoute.post("/", authMiddleware.requireUser, ctrl.createUser);
managedUserRoute.get("/", authMiddleware.requireUser, ctrl.getAllUsers);
managedUserRoute.get("/:id", authMiddleware.requireUser, ctrl.getUserById);
managedUserRoute.put("/:id", authMiddleware.requireUser, ctrl.updateUser);
managedUserRoute.delete("/:id", authMiddleware.requireUser, ctrl.deleteUser);
managedUserRoute.patch("/:id/toggle-status", authMiddleware.requireUser, ctrl.toggleStatus);

export default managedUserRoute;
