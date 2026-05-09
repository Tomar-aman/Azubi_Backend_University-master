import { type Request, type Response } from "express";
import { IndustriesService } from "./industries.service";
import logger from "../../utils/logger";

class IndustriesController {
  private readonly industriesService: IndustriesService;

  constructor() {
    this.industriesService = new IndustriesService();
  }

  public getAllIndustries = async (_: Request, res: Response) => {
    try {
      const industries = await this.industriesService.getAllIndustriesService();
      res.sendSuccess200Response(
        "Industries retrieved successfully",
        industries,
      );
    } catch (error) {
      logger.error("getAllIndustries", error);
      res.sendErrorResponse("Error retrieving industries", error);
    }
  };

  public getIndustryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const industry = await this.industriesService.getIndustryByIdService(id);

      if (!industry) {
        res.sendNotFound404Response("Industry not found", null);
        return;
      }

      res.sendSuccess200Response("Industry retrieved successfully", industry);
    } catch (error) {
      res.sendErrorResponse("Error retrieving industry", error);
    }
  };

  public addIndustry = async (req: Request, res: Response) => {
    try {
      const { name: industryName } = req.body;

      const newIndustry =
        await this.industriesService.addIndustryService(industryName);

      res.sendCreated201Response("Industry added successfully", newIndustry);
    } catch (error) {
      logger.error("addIndustry", error);
      res.sendErrorResponse("Error adding industry", error);
    }
  };

  public updateIndustryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const { name: updatedIndustryData } = req.body;
      const updatedIndustry =
        await this.industriesService.updateIndustryByIdService(
          id,
          updatedIndustryData,
        );

      res.sendSuccess200Response(
        "Industry updated successfully",
        updatedIndustry,
      );
    } catch (error) {
      res.sendErrorResponse("Error updating industry", error);
    }
  };

  public deleteIndustryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedIndustry =
        await this.industriesService.deleteIndustryByIdService(id);

      res.sendSuccess200Response(
        "Industry marked as deleted successfully",
        deletedIndustry,
      );
    } catch (error) {
      res.sendErrorResponse("Error deleting industry", error);
    }
  };

  public getAllIndustry = async (req, res) => {
    try {
      const { searchValue, pageNo, recordPerPage } = req.query;
      const data = await this.industriesService.getAllIndustriesByFilter(
        searchValue,
        pageNo,
        recordPerPage,
      );
      res.sendSuccess200Response(" retrieve Industry  successfully", data);
    } catch (error) {
      logger.error("getAllIndustry", error);
      res.sendErrorResponse("Error getAllIndustry industry", error);
    }
  };
}

export default IndustriesController;
