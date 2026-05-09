import express from "express";
import AuthMiddleware from "../../middleware/authenticator";
import JobTypesController from "./job.types.controller";

const jobTypesRoute = express.Router();
const jobTypesController = new JobTypesController();
const authMiddleware = new AuthMiddleware();

jobTypesRoute.get("/", jobTypesController.getAllJobTypes);
jobTypesRoute.get(
  "/get_all_JobType",
  jobTypesController.getAllJobTypesByFilter,
);
jobTypesRoute.get(
  "/:id",
  authMiddleware.requireUser,
  jobTypesController.getJobTypeById,
);
jobTypesRoute.post(
  "/",
  authMiddleware.requireUser,
  jobTypesController.addJobType,
);
jobTypesRoute.put(
  "/",
  authMiddleware.requireUser,
  jobTypesController.updateJobTypeById,
);
jobTypesRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  jobTypesController.deleteJobTypeById,
);

jobTypesRoute.get(
  "/find/:jobTypeName",
  authMiddleware.requireUser,
  jobTypesController.getJobTypeByName,
);

export default jobTypesRoute;
