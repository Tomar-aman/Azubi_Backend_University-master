import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import {
  getAllJobService,
  getJobBannersService,
  getJobService,
} from "./service";

export async function getAllJobs(req: Request, res: Response) {
  try {
    const jobs = await getAllJobService({ ...req.query });
    res.sendSuccess200Response("jobs retrieved successfully", jobs);
  } catch (error) {
    logger.error("getAllJobs", error);
    res.sendErrorResponse("Error retrieving jobs for frontend", error);
  }
}

export async function getJob(req: Request, res: Response) {
  try {
    const job = await getJobService(req.params.id);
    if (job.length > 0)
      return res.sendSuccess200Response("jobs retrieved successfully", job[0]);
    return res.sendSuccess200Response("jobs retrieved successfully", job);
  } catch (error) {
    logger.error("getAllJobs", error);
    res.sendErrorResponse("Error retrieving jobs for frontend", error);
  }
}

export async function getJobBanners(req: Request, res: Response) {
  try {
    const jobBanners = await getJobBannersService({ ...req.query });
    return res.sendSuccess200Response(
      "jobs banner retrieved successfully",
      jobBanners,
    );
  } catch (error) {
    logger.error("getAllJobs", error);
    res.sendErrorResponse("Error retrieving jobs banner for frontend", error);
  }
}
