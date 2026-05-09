import express from "express";
import FederalStatesController from "./regions.controller";
import AuthMiddleware from "../../middleware/authenticator";

const regionRoute = express.Router();
const industriesController = new FederalStatesController();
const authMiddleware = new AuthMiddleware();

regionRoute.get("/", industriesController.getAllFederalStates);
regionRoute.get("/get_all_federals", industriesController.getAllFederalState);
regionRoute.get(
  "/:id",
  authMiddleware.requireUser,
  industriesController.getFederalStateById,
);
regionRoute.post(
  "/",
  authMiddleware.requireUser,
  industriesController.addFederalState,
);
regionRoute.put(
  "/",
  authMiddleware.requireUser,
  industriesController.updateFederalStateById,
);
regionRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  industriesController.deleteFederalStateById,
);

export default regionRoute;
