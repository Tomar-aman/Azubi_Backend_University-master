import { type Request, type Response } from "express";
import { FederalStateService } from "./federalStates.service";
import logger from "../../utils/logger";

class FederalStatesController {
  private readonly federalStateService: FederalStateService;

  constructor() {
    this.federalStateService = new FederalStateService();
  }

  public getAllFederalStates = async (_: Request, res: Response) => {
    try {
      const federalStates =
        await this.federalStateService.getAllFederalStatesService();
      res.sendSuccess200Response(
        "Industries retrieved successfully",
        federalStates,
      );
    } catch (error) {
      logger.error("getAllFederalStates", error);
      res.sendErrorResponse("Error retrieving federal States", error);
    }
  };

  public getFederalStateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const federalState =
        await this.federalStateService.getFederalStateByIdService(id);

      if (!federalState) {
        res.sendNotFound404Response("federal state not found", null);
        return;
      }

      res.sendSuccess200Response(
        "federal state retrieved successfully",
        federalState,
      );
    } catch (error) {
      res.sendErrorResponse("Error retrieving federal state", error);
    }
  };

  public addFederalState = async (req: Request, res: Response) => {
    try {
      const { name: industryName } = req.body;

      const newFederalState =
        await this.federalStateService.addFederalStateService(industryName);

      res.sendCreated201Response(
        "federal state added successfully",
        newFederalState,
      );
    } catch (error) {
      logger.error("federalState", error);
      res.sendErrorResponse("Error adding federal state", error);
    }
  };

  public updateFederalStateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const { name: updatedIndustryData } = req.body;
      const updatedFederalState =
        await this.federalStateService.updateFederalStateByIdService(
          id,
          updatedIndustryData,
        );

      res.sendSuccess200Response(
        "federal state updated successfully",
        updatedFederalState,
      );
    } catch (error) {
      res.sendErrorResponse("Error updating federal state", error);
    }
  };

  public deleteFederalStateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleteFederalState =
        await this.federalStateService.deleteFederalStateByIdService(id);

      res.sendSuccess200Response(
        "federal state marked as deleted successfully",
        deleteFederalState,
      );
    } catch (error) {
      res.sendErrorResponse("Error deleting industry", error);
    }
  };

  public getAllFederalState = async (req, res) => {
    try {
      const { searchValue, pageNo, recordPerPage } = req.query;
      const data = await this.federalStateService.getAllFederalStateByFilter(
        searchValue,
        pageNo,
        recordPerPage,
      );
      res.sendSuccess200Response(" retrieve federal state  successfully", data);
    } catch (error) {
      logger.error("getAllIndustry", error);
      res.sendErrorResponse("Error getAllFederalState", error);
    }
  };
}

export default FederalStatesController;
