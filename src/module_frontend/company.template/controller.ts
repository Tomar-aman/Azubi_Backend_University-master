import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { getCompaniesLogoService, getCompanyService } from "./service";
import mediaModel from "../../models/media";

export async function getCompany(req: Request, res: Response) {
  try {
    const company = await getCompanyService(req.params.id);
    if (company.length > 0) {
      res.sendSuccess200Response("company retrieved successfully", company[0]);
      return;
    }
    res.sendSuccess200Response("company retrieved successfully", company);
  } catch (error) {
    logger.error("getAllJobs", error);
    res.sendErrorResponse("Error retrieving jobs for frontend", error);
  }
}

export async function getCompaniesLogo(_: Request, res: Response) {
  try {
    const logos = await getCompaniesLogoService();
    res.sendSuccess200Response("fetch successfully", logos);
  } catch (error) {
    res.sendErrorResponse("Error retrieving jobs for frontend", error);
  }
}

export async function getMedia(_: Request, res: Response) {
  try {
    const medias = await mediaModel.find({});
    res.sendSuccess200Response("fetch successfully", medias);
  } catch (error) {
    res.sendErrorResponse("Error retrieving jobs for frontend", error);
  }
}
