import express from "express";
import ManagedEmployeeController from "./managedEmployee.controller";
import AuthMiddleware from "../../middleware/authenticator";

const managedEmployeeRoute = express.Router();
const ctrl = new ManagedEmployeeController();
const authMiddleware = new AuthMiddleware();

managedEmployeeRoute.post("/", authMiddleware.requireUser, ctrl.createEmployee);
managedEmployeeRoute.get("/", authMiddleware.requireUser, ctrl.getAllEmployees);
managedEmployeeRoute.get("/:id", authMiddleware.requireUser, ctrl.getEmployeeById);
managedEmployeeRoute.put("/:id", authMiddleware.requireUser, ctrl.updateEmployee);
managedEmployeeRoute.delete("/:id", authMiddleware.requireUser, ctrl.deleteEmployee);
managedEmployeeRoute.patch("/:id/toggle-status", authMiddleware.requireUser, ctrl.toggleStatus);

export default managedEmployeeRoute;
