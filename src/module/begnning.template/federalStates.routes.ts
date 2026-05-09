import express from "express";
import BeginningController from "./federalStates.controller";
import AuthMiddleware from "../../middleware/authenticator";

const trainingRoute = express.Router();
const industriesController = new BeginningController();
const authMiddleware = new AuthMiddleware();

trainingRoute.get("/", industriesController.getAllFederalStates);
trainingRoute.get("/get_all_federals", industriesController.getAllFederalState);
trainingRoute.get(
  "/:id",
  authMiddleware.requireUser,
  industriesController.getFederalStateById,
);
trainingRoute.post(
  "/",
  authMiddleware.requireUser,
  industriesController.addFederalState,
);
trainingRoute.put(
  "/",
  authMiddleware.requireUser,
  industriesController.updateFederalStateById,
);
trainingRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  industriesController.deleteFederalStateById,
);

export default trainingRoute;
