import express from "express";
import { getAllJobs, getJob, getJobBanners } from "./controller";

const frontendJobRoute = express.Router();
frontendJobRoute.get("/", getAllJobs);
frontendJobRoute.get("/job-banners", getJobBanners);
frontendJobRoute.get("/:id", getJob);

export default frontendJobRoute;
