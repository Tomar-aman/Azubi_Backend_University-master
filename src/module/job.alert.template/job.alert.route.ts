import express from "express";
import JobAlertContentController from "./job.alert.controller";
import AuthMiddleware from "../../middleware/authenticator";

const jobAlertContentsRoute = express.Router();
const jobAlertContentController = new JobAlertContentController();
const authMiddleware = new AuthMiddleware();

jobAlertContentsRoute.get(
  "/",
  jobAlertContentController.getAllJobAlertContents,
);

jobAlertContentsRoute.post(
  "/job-alarm",
  jobAlertContentController.jobAlarmMail,
);
// jobAlertContentsRoute.get(
//   "/:id",
//   jobAlertContentController.getJobAlertContentById,
// );
jobAlertContentsRoute.post(
  "/",
  authMiddleware.requireUser,
  jobAlertContentController.addJobAlertContent,
);
jobAlertContentsRoute.put(
  "/",
  authMiddleware.requireUser,
  jobAlertContentController.updateJobAlertContentById,
);
jobAlertContentsRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  jobAlertContentController.deleteJobAlertContentById,
);

export default jobAlertContentsRoute;
