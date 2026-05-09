import express from "express";
import JobBannerController from "./jobBanner.controler";
import AuthMiddleware from "../../middleware/authenticator";

const jobBannerRoute = express.Router();
const jobBannerController = new JobBannerController();
const authMiddleware = new AuthMiddleware();

jobBannerRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  jobBannerController.deleteBanner,
);
jobBannerRoute.get(
  "/",
  // authMiddleware.requireUser,
  jobBannerController.getAllBanners,
);
jobBannerRoute.post(
  "/",
  authMiddleware.requireUser,
  jobBannerController.createBanner,
);
jobBannerRoute.put(
  "/",
  authMiddleware.requireUser,
  jobBannerController.updateBanner,
);
jobBannerRoute.get("/app", jobBannerController.getAllBannerForApp);
export default jobBannerRoute;
