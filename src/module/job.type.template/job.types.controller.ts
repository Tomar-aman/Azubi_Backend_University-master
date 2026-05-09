import { type Request, type Response } from "express";
import { JobTypesService } from "./job.types.service";
import logger from "../../utils/logger";

class JobTypesController {
  private readonly jobTypesService: JobTypesService;

  constructor() {
    this.jobTypesService = new JobTypesService();
  }

  public getJobTypeByName = async (req: Request, res: Response) => {
    try {
      const { jobTypeName } = req.params;
      const jobType = await this.jobTypesService.findByName(jobTypeName);

      if (!jobType) {
        res.sendNotFound404Response("Job type not found", null);
        return;
      }

      res.sendSuccess200Response("Job type retrieved successfully", jobType);
    } catch (error) {
      logger.error("getJobTypeByName", error);
      res.sendErrorResponse("Error retrieving job type by name", error);
    }
  };

  public getAllJobTypes = async (_: Request, res: Response) => {
    try {
      const jobTypes = await this.jobTypesService.getAllJobTypesService();
      res.sendSuccess200Response("Job types retrieved successfully", jobTypes);
    } catch (error) {
      logger.error("getAllJobTypes", error);
      res.sendErrorResponse("Error retrieving job types", error);
    }
  };

  public getJobTypeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const jobType = await this.jobTypesService.getJobTypeByIdService(id);

      if (!jobType) {
        res.sendNotFound404Response("Job type not found", null);
        return;
      }

      res.sendSuccess200Response("Job type retrieved successfully", jobType);
    } catch (error) {
      res.sendErrorResponse("Error retrieving job type", error);
    }
  };

  public addJobType = async (req: Request, res: Response) => {
    try {
      const { name: jobTypeName } = req.body;

      const newJobType = await this.jobTypesService.addJobTypeService({
        jobTypeName,
        isDeleted: false,
      });

      res.sendCreated201Response("Job type added successfully", newJobType);
    } catch (error) {
      logger.error("addJobType", error);
      res.sendErrorResponse("Error adding job type", error);
    }
  };

  public updateJobTypeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const { name: updatedJobTypeData } = req.body;
      const updatedJobType =
        await this.jobTypesService.updateJobTypeByIdService(id, {
          jobTypeName: updatedJobTypeData,
        });

      res.sendSuccess200Response(
        "Job type updated successfully",
        updatedJobType,
      );
    } catch (error) {
      res.sendErrorResponse("Error updating job type", error);
    }
  };

  public deleteJobTypeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedJobType =
        await this.jobTypesService.deleteJobTypeByIdService(id);

      res.sendSuccess200Response(
        "Job type marked as deleted successfully",
        deletedJobType,
      );
    } catch (error) {
      res.sendErrorResponse("Error deleting job type", error);
    }
  };

  public getAllJobTypesByFilter = async (req: Request, res) => {
    try {
      const { searchValue, pageNo, recordPerPage } = req.query;
      const data = await this.jobTypesService.getAllJobTypesByFilter(
        searchValue,
        pageNo,
        recordPerPage,
      );
      res.sendSuccess200Response("Retrieve job types successfully", data);
    } catch (error) {
      logger.error("getAllJobTypesByFilter", error);
      res.sendErrorResponse("Error retrieving job types by filter", error);
    }
  };
}

export default JobTypesController;
