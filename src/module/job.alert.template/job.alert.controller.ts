import { type Request, type Response } from "express";
import { JobAlertContentService } from "./job.alert.service";
import logger from "../../utils/logger";
import { FileHandler } from "../../utils/fileHandler";
import ObjectIdConverter from "../../utils/objectIdConvertor";
import { smtpSettingModel } from "../../models";

class JobAlertContentController {
  private readonly jobAlertContentService: JobAlertContentService;
  private readonly fileHandler: FileHandler;
  private readonly objectIdConverter: ObjectIdConverter;
  constructor() {
    this.jobAlertContentService = new JobAlertContentService();
    this.fileHandler = new FileHandler();
    this.objectIdConverter = new ObjectIdConverter();
  }

  public getAllJobAlertContents = async (_: Request, res: Response) => {
    try {
      const jobAlertContents =
        await this.jobAlertContentService.getAllJobAlertContentsService();
      res.sendSuccess200Response(
        "Job alert contents retrieved successfully",
        jobAlertContents,
      );
    } catch (error) {
      logger.error("getAllJobAlertContents", error);
      res.sendErrorResponse("Error retrieving job alert contents", error);
    }
  };

  public getJobAlertContentById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const jobAlertContent =
        await this.jobAlertContentService.getJobAlertContentByIdService(id);

      if (!jobAlertContent) {
        res.sendNotFound404Response("Job alert content not found", null);
        return;
      }

      res.sendSuccess200Response(
        "Job alert content retrieved successfully",
        jobAlertContent,
      );
    } catch (error) {
      res.sendErrorResponse("Error retrieving job alert content", error);
    }
  };

  public addJobAlertContent = async (req: Request, res: Response) => {
    try {
      const { heading, subheading } = req.body;
      const image = req.files?.image;
      const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
      if (mediaId) {
        const objectId: any = this.objectIdConverter.convertToObjectId(mediaId);
        const newJobAlertContent =
          await this.jobAlertContentService.addJobAlertContentService({
            image: objectId,
            heading,
            subheading,
          });

        res.sendCreated201Response(
          "Job alert content added successfully",
          newJobAlertContent,
        );
      }
    } catch (error) {
      logger.error("addJobAlertContent", error);
      res.sendErrorResponse("Error adding job alert content", error);
    }
  };

  public updateJobAlertContentById = async (req: Request, res: Response) => {
    try {
      const { heading, subheading, _id } = req.body;
      const image = req.files?.image;
      if (image && typeof image !== "string") {
        const mediaId: any =
          await this.fileHandler.saveFileAndCreateMedia(image);
        const updatedJobAlertContent =
          await this.jobAlertContentService.updateJobAlertContentByIdService(
            _id,
            {
              image: req.body.oldMedia ? req.body.oldMedia : mediaId,
              heading,
              subheading,
            },
          );
        res.sendSuccess200Response(
          "Job alert content updated successfully",
          updatedJobAlertContent,
        );
      } else {
        let updateData: any = "";
        if (req.body.oldMedia) {
          updateData =
            await this.jobAlertContentService.updateJobAlertContentByIdService(
              _id,
              {
                image: req.body.oldMedia,
                heading,
                subheading,
              },
            );
        } else {
          updateData =
            await this.jobAlertContentService.updateJobAlertContentByIdService(
              _id,
              {
                heading,
                subheading,
              },
            );
        }

        res.sendSuccess200Response("Job alert content updated successfully", {
          updateData,
        });
      }
    } catch (error) {
      res.sendErrorResponse("Error updating job alert content", error);
    }
  };

  public deleteJobAlertContentById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedJobAlertContent =
        await this.jobAlertContentService.deleteJobAlertContentByIdService(id);

      res.sendSuccess200Response(
        "Job alert content marked as deleted successfully",
        deletedJobAlertContent,
      );
    } catch (error) {
      res.sendErrorResponse("Error deleting job alert content", error);
    }
  };

  public jobAlarmMail = async (req: Request, res: Response) => {
    try {
      const { location, industry, email } = req.body;
      const bccContent = await smtpSettingModel.find();
      await this.jobAlertContentService.jobAlarmMailService({
        email,
        location,
        industry,
        bccContent,
      });
      res.sendSuccess200Response("mail sent successfully", []);
    } catch (error) {
      res.sendErrorResponse("Error in send mail", error);
    }
  };
}

export default JobAlertContentController;
