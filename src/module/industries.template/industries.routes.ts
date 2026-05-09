import express from "express";
import IndustriesController from "./industries.controller";
import AuthMiddleware from "../../middleware/authenticator";

const industriesRoute = express.Router();
const industriesController = new IndustriesController();
const authMiddleware = new AuthMiddleware();

industriesRoute.get("/", industriesController.getAllIndustries);
industriesRoute.get("/get_all_Industry", industriesController.getAllIndustry);
industriesRoute.get(
  "/:id",
  authMiddleware.requireUser,
  industriesController.getIndustryById,
);
industriesRoute.post(
  "/",
  authMiddleware.requireUser,
  industriesController.addIndustry,
);
industriesRoute.put(
  "/",
  authMiddleware.requireUser,
  industriesController.updateIndustryById,
);
industriesRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  industriesController.deleteIndustryById,
);

export default industriesRoute;
