import express from "express";
import JobController from "./job.controller";
import AuthMiddleware from "../../middleware/authenticator";
// import { createJobSchema, updateJobSchema } from "./job.types";
// import JoiValidator from "../../utils/joiValidator";

const jobRoute = express.Router();
const jobController = new JobController();
const authMiddleware = new AuthMiddleware();
// const joiValidator = new JoiValidator();

jobRoute.get("/get-suggestion", jobController.getJobSuggestion);
jobRoute.post("/job-application", jobController.addApplication);
jobRoute.get("/", jobController.getAllJobs);
jobRoute.post("/revert-application", jobController.revertApplication);
jobRoute.get("/:id", jobController.getJobById);
jobRoute.post(
  "/",
  authMiddleware.requireUser,
  // joiValidator.validate(createJobSchema, "body"),
  jobController.addJob,
);
jobRoute.put(
  "/:id",
  authMiddleware.requireUser,
  // joiValidator.validate(updateJobSchema, "body"),
  jobController.updateJobById,
);
jobRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  jobController.deleteJobById,
);

export default jobRoute;
