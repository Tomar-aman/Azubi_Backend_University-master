import { type Request, type Response } from "express";
import { JobService } from "./job.service";
import logger from "../../utils/logger";
import { FileHandler } from "../../utils/fileHandler";
import { JobDocumentService } from "./job.documents.service";
import { JobImageHandler } from "../../utils/jobsImageHandler";
import mongoose from "mongoose";
import { jobImagesModel } from "../../models/index";
class JobController {
  private readonly jobService: JobService;
  private readonly fileHandler: FileHandler;
  private readonly jobDocumentService: JobDocumentService;
  private readonly jobImageHandler: JobImageHandler;
  constructor() {
    this.jobService = new JobService();
    this.fileHandler = new FileHandler();
    this.jobDocumentService = new JobDocumentService();
    this.jobImageHandler = new JobImageHandler();
  }

  public getAllJobs = async (req: Request, res: Response) => {
    try {
      const {
        searchValue,
        pageNo,
        filter,
        recordPerPage,
        slectedCity,
        isFillter,
        isFrontend,
        jobType,
        date,
        deviceId,
      } = req.query;
      const jobs = await this.jobService.getAllJobsService(
        searchValue as string,
        Number(pageNo),
        filter as string,
        Number(recordPerPage),
        slectedCity as string[],
        isFillter as string[],
        isFrontend as string,
        jobType as string[],
        date as any,
        deviceId as string,
      );
      const totalRecords = await this.jobService.getCount();
      const recordPerPageValue = recordPerPage ? Number(recordPerPage) : 10;
      const count = Math.ceil(totalRecords / recordPerPageValue);
      res.sendSuccess200Response("Jobs retrieved successfully", {
        jobs,
        count,
      });
    } catch (error) {
      logger.error("getAllJobs", error);
      res.sendErrorResponse("Error retrieving jobs", error);
    }
  };

  public getJobById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const job = await this.jobService.getJobByIdService(id);
      if (!job) {
        res.sendNotFound404Response("Job not found", null);
        return;
      }
      res.sendSuccess200Response("Job retrieved successfully", job);
    } catch (error) {
      console.log({ error });
      res.sendErrorResponse("Error retrieving job", error);
    }
  };

  public updateJobById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      if (!req.body.startTime) {
        req.body.startTime = null;
      }

      if (req.body.training) {
        if (!mongoose.Types.ObjectId.isValid(req.body.training)) {
          delete req.body.training; // Remove if not a valid ObjectId
        }
      } else {
        delete req.body.training; // Remove if empty
      }

      if (req.body.federalState) {
        if (
          req.body.federalState &&
          !mongoose.Types.ObjectId.isValid(req.body.federalState)
        ) {
          req.body.federalState = null;
        }
      } else {
        delete req.body.federalState; // Remove if empty
      }

      if (req.body.beginning) {
        if (
          req.body.beginning &&
          !mongoose.Types.ObjectId.isValid(req.body.beginning)
        ) {
          req.body.beginning = null;
        }
      } else {
        delete req.body.beginning; // Remove if empty
      }
      // eslint-disable-next-line no-empty
      if (req.body.videoLink && Array.isArray(req.body.videoLink)) {
      } else {
        if (!req.body.videoLink) {
          req.body.videoLink = [];
        } else {
          const newVideoLink: string[] = [];
          newVideoLink.push(req.body.videoLink);
          req.body.videoLink = newVideoLink;
        }
      }
      const files: any = Array.isArray(req.files?.attachments)
        ? req.files?.attachments
        : [req.files?.attachments];
      const attachments: any = [];
      for (const file of files) {
        const id: any = await this.fileHandler.saveFileAndCreateMedia(file);
        attachments.push(id);
      }
      if (req.body.newCity) {
        req.body.city = req.body.newCity;
      }
      const updatedJob = await this.jobService.updateJobByIdService(
        id,
        req.body,
        { ...req.body, ...req.files },
      );
      console.log("-----------", req.body);
      const { removedFile } = req.body;
      const jobsImages = req.files?.jobsImages;

      if (updatedJob) {
        await this.jobImageHandler.saveFileAndCreateMedia(
          jobsImages as any[],
          removedFile,
          id,
        );
        // use old edit job images
        if (req.body.oldJobImage) {
          if (
            Array.isArray(req.body.oldJobImage) &&
            req.body.oldJobImage.length
          ) {
            // If jobsImages is an array, create multiple entries
            const images = req.body.oldJobImage.map((item: string) => ({
              imageId: new mongoose.Types.ObjectId(item),
              jobId: id,
            }));

            // Save all images at once
            await jobImagesModel.insertMany(images);
          } else if (req.body.oldJobImage) {
            // If jobsImages is not an array, save a single image
            await jobImagesModel.create({
              imageId: new mongoose.Types.ObjectId(req.body.oldJobImage),
              jobId: id,
            });
          }
        }
      }
      if (req.files?.attachments) {
        await this.jobDocumentService.addDocuments(attachments, id);
      }
      if (req.body?.oldAttachments) {
        await this.jobDocumentService.addDocuments(
          [req.body?.oldAttachments],
          id,
        );
      }
      if (req.body?.deletedAttachment) {
        const deletedAttachments = Array.isArray(req.body?.deletedAttachment)
          ? req.body?.deletedAttachment
          : [req.body?.deletedAttachment];
        await this.jobDocumentService.deleteDocuments(deletedAttachments);
      }
      console.log("Job: ", updatedJob);
      res.sendSuccess200Response("Job updated successfully", updatedJob);
    } catch (error) {
      console.log({ error });
      res.sendErrorResponse("Error updating job", error);
    }
  };

  public deleteJobById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedJob = await this.jobService.deleteJobByIdService(id);
      res.sendSuccess200Response(
        "Job marked as deleted successfully",
        deletedJob,
      );
    } catch (error) {
      res.sendErrorResponse("Error deleting job", error);
    }
  };

  public addJob = async (req: Request, res: Response) => {
    try {
      const { _id } = req.user;
      const {
        company,
        jobTitle,
        email,
        additionalEmail,
        address,
        zipCode,
        jobDescription,
        status,
        isDeleted,
        industryName,
        newCity: city,
        jobType,
        embeddedCode,
        isDesktopView,
        beginning,
        federalState,
        training,
        mapUrl,
        locationField,
        locationUrl,
        region,
        oldtransformedCardContainImage,
      } = req.body;
      if (!req.body.startTime) {
        req.body.startTime = null;
      }
      try {
        if (Array.isArray(req.body.jobsImages) && req.body.jobsImages.length) {
          req.body.jobsImages = req.body.jobsImages.map((item: string) => {
            return new mongoose.Types.ObjectId(item);
          });
        }
      } catch (error) {
        console.log({ error });
      }
      if (Array.isArray(req.body.oldJobImage)) {
        console.log("---------------------------");
        // If oldJobImage is an array, map and create ObjectId
        req.body.jobsImages = req.body.oldJobImage.map((item: string) => {
          return new mongoose.Types.ObjectId(item);
        });
      } else {
        console.log("req.body.oldJobImage", req.body.oldJobImage);
        // If oldJobImage is not an array, do something else
        // For example, log an error, or handle the case where it's a single value or missing
        console.log("oldJobImage is not an array");
        // Handle single value (if needed)
        req.body.jobsImages = [
          new mongoose.Types.ObjectId(req.body.oldJobImage),
        ];
        console.log("Second Console---------------------------");
      }

      const { startDate } = req.body;
      // eslint-disable-next-line no-empty
      if (req.body.videoLink && Array.isArray(req.body.videoLink)) {
      } else {
        if (!req.body.videoLink) {
          req.body.videoLink = [];
        } else {
          const newVideoLink: string[] = [];
          newVideoLink.push(req.body.videoLink);
          req.body.videoLink = newVideoLink;
        }
      }
      const { videoLink } = req.body;
      const files: any = Array.isArray(req.files?.attachments)
        ? req.files?.attachments
        : [req.files?.attachments];
      const attachments: any = [];
      for (const file of files) {
        if (file) {
          const id: any = await this.fileHandler.saveFileAndCreateMedia(file);
          attachments.push(id);
        }
      }
      if (Array.isArray(req.body.oldAttachments)) {
        for (const file of req.body.oldAttachments) {
          if (file) {
            attachments.push(new mongoose.Types.ObjectId(file));
          }
        }
      } else if (req.body.oldAttachments) {
        attachments.push(new mongoose.Types.ObjectId(req.body.oldAttachments));
      }
      const newJob = await this.jobService.addJobService(
        {
          city,
          company,
          jobTitle,
          startDate,
          email,
          additionalEmail,
          address,
          mapUrl,
          zipCode,
          jobDescription,
          status,
          createdBy: _id,
          isDeleted,
          industryName,
          videoLink,
          jobType,
          embeddedCode,
          isDesktopView,
          federalState,
          beginning,
          training,
          locationField,
          locationUrl,
          region,
          oldtransformedCardContainImage: oldtransformedCardContainImage
            ? oldtransformedCardContainImage
            : "",
        },
        { ...req.body, ...req.files },
      );
      if (Array.isArray(req.body.jobsImages) && req.body.jobsImages.length) {
        // If jobsImages is an array, create multiple entries
        const images = req.body.jobsImages.map((item: string) => ({
          imageId: new mongoose.Types.ObjectId(item),
          jobId: newJob._id,
        }));

        // Save all images at once
        await jobImagesModel.insertMany(images);
      } else if (req.body.jobsImages) {
        // If jobsImages is not an array, save a single image
        await jobImagesModel.create({
          imageId: new mongoose.Types.ObjectId(req.body.jobsImages),
          jobId: newJob._id,
        });
      }

      const { removedFile } = req.body;
      const jobsImages = req.files?.jobsImages;
      if (newJob) {
        await this.jobImageHandler.saveFileAndCreateMedia(
          jobsImages as any[],
          removedFile,
          newJob._id,
        );
      }
      await this.jobDocumentService.addDocuments(attachments, newJob._id);

      res.sendCreated201Response("Job added successfully", newJob);
    } catch (error) {
      console.log({ error });
      res.sendErrorResponse("Error adding job", error);
    }
  };

  public getJobSuggestion = async (req: Request, res: Response) => {
    try {
      const { suggestion } = req.query;
      const data = await this.jobService.getSuggestionService(
        suggestion as string,
      );
      res.sendCreated201Response("Success", data);
    } catch (error) {
      res.sendErrorResponse("error", error);
    }
  };

  public addApplication = async (req: Request, res: Response) => {
    const attachments = req.files?.attachment;
    try {
      void this.jobService.addApplicationService(req.body, attachments);
      res.sendSuccess200Response("job applied successfully", null);
    } catch (error) {
      return res.sendErrorResponse("error", error);
    }
  };

  public revertApplication = async (req: Request, res: Response) => {
    try {
      this.jobService.revertApplication(req.body);
      res.sendSuccess200Response("job revert successfully", null);
    } catch (error) {
      return res.sendErrorResponse("error", error);
    }
  };
}
export default JobController;
