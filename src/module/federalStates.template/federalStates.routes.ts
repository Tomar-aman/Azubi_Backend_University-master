import express from "express";
import FederalStatesController from "./federalStates.controller";
import AuthMiddleware from "../../middleware/authenticator";

const federalStatesRoute = express.Router();
const industriesController = new FederalStatesController();
const authMiddleware = new AuthMiddleware();

federalStatesRoute.get("/", industriesController.getAllFederalStates);
federalStatesRoute.get(
  "/get_all_federals",
  industriesController.getAllFederalState,
);
federalStatesRoute.get(
  "/:id",
  authMiddleware.requireUser,
  industriesController.getFederalStateById,
);
federalStatesRoute.post(
  "/",
  authMiddleware.requireUser,
  industriesController.addFederalState,
);
federalStatesRoute.put(
  "/",
  authMiddleware.requireUser,
  industriesController.updateFederalStateById,
);
federalStatesRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  industriesController.deleteFederalStateById,
);

export default federalStatesRoute;
