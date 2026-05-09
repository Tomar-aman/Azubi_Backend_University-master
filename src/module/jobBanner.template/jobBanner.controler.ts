import ObjectIdConverter from "../../utils/objectIdConvertor";
import { FileHandler } from "../../utils/fileHandler";
import logger from "../../utils/logger";
import { JobBannerService } from "./jobBanner.service";
import mongoose from "mongoose";

class JobBannerController {
  private readonly jobBannerService: JobBannerService;
  private readonly fileHandler: FileHandler;
  private readonly objectIdConverter: ObjectIdConverter;
  constructor() {
    this.fileHandler = new FileHandler();
    this.jobBannerService = new JobBannerService();
    this.objectIdConverter = new ObjectIdConverter();
  }

  public getAllBanners = async (req, res) => {
    const { pageNo, recordPerPage, search } = req.query;
    try {
      const banners = await this.jobBannerService.getAllBanners({
        pageNo: Number(pageNo),
        recordPerPage: Number(recordPerPage),
        search,
      });
      res.sendSuccess200Response("banners retrieved successfully", banners);
    } catch (error) {
      logger.error("getAllBanners", error);
      res.sendErrorResponse("error code 102", error);
    }
  };

  public createBanner = async (req, res) => {
    try {
      if (Array.isArray(req.body.oldImages)) {
        req.body.images = req.body.images || [];
        req.body.images.push(
          ...req.body.oldImages.map((item) => {
            return new mongoose.Types.ObjectId(item);
          }),
        );
      } else {
        if (req.body.oldImages) {
          req.body.images = req.body.images || [];
          req.body.images.push(new mongoose.Types.ObjectId(req.body.oldImages));
        }
      }
      if (req?.files?.images) {
        const mediaIds: string[] = [];
        if (Array.isArray(req.files.images)) {
          for (const image of req.files.images) {
            const mediaId =
              await this.fileHandler.saveFileAndCreateMedia(image);
            mediaIds.push(mediaId as string);
          }
        } else {
          const mediaId = await this.fileHandler.saveFileAndCreateMedia(
            req.files.images,
          );
          mediaIds.push(mediaId as string);
        }
        req.body.images = mediaIds;
      }

      const banners = await this.jobBannerService.createBannerService(req.body);
      res.sendSuccess200Response("banners create successfully", banners);
      return banners;
    } catch (error) {
      logger.error("createBanner", error);
      res.sendErrorResponse("Error creating banner", error);
    }
  };

  public updateBanner = async (req, res) => {
    try {
      if (Array.isArray(req.body.oldImages)) {
        req.body.images = req.body.images || [];
        req.body.images.push(
          ...req.body.oldImages.map((item) => {
            return new mongoose.Types.ObjectId(item);
          }),
        );
      } else {
        if (req.body.oldImages) {
          req.body.images = req.body.images || [];
          req.body.images.push(new mongoose.Types.ObjectId(req.body.oldImages));
        }
      }
      if (req?.files?.images) {
        const mediaIds: string[] = [];
        if (Array.isArray(req.files.images)) {
          for (const image of req.files.images) {
            const mediaId =
              await this.fileHandler.saveFileAndCreateMedia(image);
            mediaIds.push(mediaId as string);
          }
        } else {
          const mediaId = await this.fileHandler.saveFileAndCreateMedia(
            req.files.images,
          );
          mediaIds.push(mediaId as string);
        }
        req.body.images = mediaIds;
      }
      if (req.body.removeFile) {
        const removeIds = req.body.removeFile;
        req.body.images = req.body.images?.filter(
          (imageId) => !removeIds.includes(imageId),
        );
      }
      const banners = await this.jobBannerService.updateBannerService(req.body);
      res.sendSuccess200Response("banners update successfully", banners);
      return banners;
    } catch (error) {
      console.log({ error });
      logger.error("updateBanner", error);
      res.sendErrorResponse("Error code 103", error);
    }
  };

  public deleteBanner = async (req, res) => {
    try {
      const id = req.params;
      const banners = await this.jobBannerService.deleteBanner(id);
      res.sendSuccess200Response("banners delete successfully", banners);
      return banners;
    } catch (error) {
      logger.error("deleteBanner", error);
      res.sendErrorResponse("Error code 104", error);
    }
  };

  public getAllBannerForApp = async (req, res) => {
    try {
      let { pageNo, recordPerPage, search, selectedCity, industries, jobType } =
        req.query;
      if (!Array.isArray(selectedCity)) {
        selectedCity = selectedCity
          ? [this.objectIdConverter.convertToObjectId(selectedCity)]
          : [];
      } else {
        selectedCity = selectedCity.map((city) =>
          this.objectIdConverter.convertToObjectId(city),
        );
      }

      if (!Array.isArray(industries)) {
        industries = industries
          ? [this.objectIdConverter.convertToObjectId(industries)]
          : [];
      } else {
        industries = industries.map((industry) =>
          this.objectIdConverter.convertToObjectId(industry),
        );
      }
      if (jobType) {
        jobType = this.objectIdConverter.convertToObjectId(jobType);
      }
      const banners = await this.jobBannerService.getAllBannersForApp({
        pageNo: Number(pageNo),
        recordPerPage: Number(recordPerPage),
        search,
        selectedCity,
        industries,
        jobType,
      });
      res.sendSuccess200Response("banners retrieve successfully", banners);
      return banners;
    } catch (error) {
      logger.error("deleteBanner", error);
      res.sendErrorResponse("Error code 105", error);
    }
  };
}

export default JobBannerController;
