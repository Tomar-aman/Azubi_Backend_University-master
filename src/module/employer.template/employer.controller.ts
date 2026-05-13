import { type Request, type Response } from "express";
import { EmployerService } from "./employer.service";
import { FileHandler } from "../../utils/fileHandler";
import mongoose, { type Schema } from "mongoose";
import logger from "../../utils/logger";
import ObjectIdConverter from "../../utils/objectIdConvertor";
import { CompanyImageHandler } from "../../utils/companyImageHandler";
import { type EmployerBodyPaylaodFrontend } from "./employer.types";
import { companyImageModel, smtpSettingModel } from "../../models/index";
class EmployerController {
  private readonly employerService: EmployerService;
  private readonly fileHandler: FileHandler;
  private readonly objectIdConverter: ObjectIdConverter;
  private readonly companyImageHandler: CompanyImageHandler;
  constructor() {
    this.employerService = new EmployerService();
    this.fileHandler = new FileHandler();
    this.objectIdConverter = new ObjectIdConverter();
    this.companyImageHandler = new CompanyImageHandler();
  }

  /**
   * use for Admin side
   * @param req
   * @param res
   */
  public getAllEmployers = async (req: Request, res: Response) => {
    try {
      const { searchValue, pageNo, filter, recordPerPage } = req.query;
      const { _id, permissions, createdBy, position, name } = req.user as any;
      
      let creatorIdFilter = null;
      if (permissions !== undefined) {
        const isManagedEmployee = position !== undefined || name !== undefined;
        if (isManagedEmployee) {
          creatorIdFilter = createdBy; // ManagedEmployee sees User's employers
        } else {
          creatorIdFilter = _id; // ManagedUser sees their own employers
        }
      }

      const employers = await this.employerService.getAllEmployersService(
        searchValue,
        pageNo,
        filter,
        recordPerPage,
        creatorIdFilter,
      );
      const totalRecords = await this.employerService.getCount(creatorIdFilter);
      const recordPerPageValue = recordPerPage ? Number(recordPerPage) : 10;
      const count = Math.ceil(totalRecords / recordPerPageValue);
      res.sendSuccess200Response("Employers retrieved successfully", {
        employers,
        count,
      });
    } catch (error) {
      logger.error("getAllEmployers", error);
      res.sendErrorResponse("Error retrieving employers", error);
    }
  };

  public getEmployeesList = async (req: Request, res: Response) => {
    try {
      const { _id, permissions, createdBy, position, name } = req.user as any;
      let creatorIdFilter = null;
      if (permissions !== undefined) {
        const isManagedEmployee = position !== undefined || name !== undefined;
        if (isManagedEmployee) {
          creatorIdFilter = createdBy; // ManagedEmployee sees User's employers
        } else {
          creatorIdFilter = _id; // ManagedUser sees their own employers
        }
      }

      const companies = await this.employerService.getEmployeesListService(creatorIdFilter);
      res.sendSuccess200Response("Employers retrieved successfully", companies);
    } catch (error) {
      logger.error("getEmployeesList", error);
      res.sendErrorResponse("Error retrieving employers", error);
    }
  };

  public getEmployerById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const employer = await this.employerService.getEmployerByIdService(id);
      if (!employer) {
        res.sendNotFound404Response("Employer not found", null);
        return;
      }
      const newPayloadForFrontend = {
        newImage: employer.newImage,
        data: employer.employerDetail,
        images: employer.images,
      };
      res.sendSuccess200Response(
        "Employer retrieved successfully",
        newPayloadForFrontend,
      );
    } catch (error) {
      res.sendErrorResponse("Error retrieving employer", error);
    }
  };

  public updateEmployerById = async (req: Request, res: Response) => {
    try {
      const companyImages = req.files?.companyImages;
      const { id } = req.params;
      if (req.body.companyLogo) {
        req.body.companyLogo = this.objectIdConverter.convertToObjectId(
          req.body.companyLogo,
        );
      }
      if (req?.files?.companyLogo) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(
          req.files.companyLogo,
        );
        req.body.companyLogo = mediaId ?? "";
      }
      if (req?.body.oldCompanyLogo) {
        req.body.companyLogo =
          new mongoose.Types.ObjectId(req?.body.oldCompanyLogo) ?? "";
      }
      const updatedEmployer =
        await this.employerService.updateEmployerByIdService(id, req.body, {
          ...req.body,
          ...req.files,
        });
      if (Array.isArray(req.body.oldCompanyImages)) {
        // If array, loop through each item
        for (const image of req.body.oldCompanyImages) {
          const mediaId = new mongoose.Types.ObjectId(image); // Convert each image to ObjectId
          await companyImageModel.create({
            imageId: mediaId,
            companyId: id,
          });
        }
      } else if (typeof req.body.oldCompanyImages === "string") {
        // If it's a string, handle it as a single image
        const mediaId = new mongoose.Types.ObjectId(req.body.oldCompanyImages); // Convert to ObjectId
        await companyImageModel.create({
          imageId: mediaId,
          companyId: id,
        });
      }
      const { removedFile } = req.body;
      if (updatedEmployer) {
        await this.companyImageHandler.saveFileAndCreateMedia(
          companyImages as any[],
          removedFile,
          //@ts-ignore
          updatedEmployer._id,
        );
      }
      res.sendSuccess200Response(
        "Employer updated successfully",
        updatedEmployer,
      );
    } catch (error) {
      res.sendErrorResponse("Error updating employer", error);
    }
  };

  public deleteEmployerById = async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (id) {
        const deletedEmployer =
          await this.employerService.deleteEmployerByIdService(id as string);
        res.sendSuccess200Response(
          "Employer marked as deleted successfully",
          deletedEmployer,
        );
      }
    } catch (error) {
      res.sendErrorResponse("Error deleting employer", error);
    }
  };

  public addEmployer = async (req: Request, res: Response) => {
    try {
      const { _id } = req.user;
      const companyImages = req.files?.["companyImages[]"];
      const {
        industryName,
        contactPerson,
        jobTitle,
        companyName,
        email,
        website,
        mapUrl,
        phoneNo,
        address,
        zipCode,
        companyDescription,
        videoLink,
        city,
        status,
        locationUrl,
        oldTransformedCardContainImage,
      } = req.body;
      let companyLogo: any = "";
      if (req?.files?.companyLogo) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(
          req.files.companyLogo,
        );
        companyLogo = mediaId ?? "";
      }
      if (req.body.oldCompanyLogo) {
        companyLogo = new mongoose.Types.ObjectId(req.body.oldCompanyLogo);
      }
      const newEmployer = await this.employerService.addEmployerService(
        {
          locationUrl,
          industryName,
          contactPerson,
          jobTitle,
          companyName,
          email,
          website,
          mapUrl,
          phoneNo: "+49" + phoneNo,
          address,
          zipCode,
          companyLogo: companyLogo as unknown as Schema.Types.ObjectId,
          companyDescription,
          videoLink: JSON.parse(videoLink),
          city,
          status,
          createdBy: _id,
          isDeleted: false,
          oldTransformedCardContainImage,
        },
        { ...req.body, ...req.files },
      );
      const { removedFile } = req.body;
      if (newEmployer) {
        await this.companyImageHandler.saveFileAndCreateMedia(
          companyImages as any[],
          removedFile,
          newEmployer._id,
        );
      }
      const olImages = req.body["oldCompanyImages[]"];
      if (Array.isArray(olImages)) {
        for (let i = 0; i < olImages.length; i++) {
          await companyImageModel.create({
            imageId: new mongoose.Types.ObjectId(olImages[i]),
            companyId: newEmployer._id,
          });
        }
      } else if (typeof req.body.oldCompanyImages === "string") {
        // If it's a string, handle it as a single image
        const mediaId = new mongoose.Types.ObjectId(olImages); // Convert to ObjectId
        await companyImageModel.create({
          imageId: mediaId,
          companyId: newEmployer._id,
        });
      }

      res.sendCreated201Response("Employer added successfully", newEmployer);
    } catch (error) {
      res.sendErrorResponse("Error adding employer", error);
    }
  };

  public getEmployerByCityAndIndustriesId = async (
    req: Request,
    res: Response,
  ) => {
    const { city } = req.params;
    try {
      const data = await this.employerService.getCompanyByCity(city);
      res.sendSuccess200Response(" success", data);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };

  public getEmpSuggesstion = async (req: Request, res: Response) => {
    try {
      const { suggesstion } = req.query;
      const data = await this.employerService.getSuggesstionService(
        suggesstion as string,
      );
      res.sendSuccess200Response(" success", data);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };

  public getAllEmployersForFrontend = async (req: Request, res: Response) => {
    try {
      const {
        searchValue,
        isFillter,
        slectedCity,
        skip,
      }: EmployerBodyPaylaodFrontend = <any>req.query;
      const data = await this.employerService.getAllEmployersForFrontendService(
        { searchValue, isFillter, slectedCity, skip },
      );
      res.sendSuccess200Response(" success", data);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };

  public getJobsByCompanyId = async (req: Request, res: Response) => {
    try {
      const {
        companyId,
        skip,
        selectedCity,
      }: { companyId: string; skip: number; selectedCity: string[] } = <any>(
        req.query
      );
      const data = await this.employerService.getJobsByCompanyIdService(
        companyId,
        skip ?? 0,
        selectedCity,
      );
      res.sendSuccess200Response("success", data);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };

  public getJobsListByCompanyId = async (req: Request, res: Response) => {
    try {
      const companyId = req.params.id;
      const data =
        await this.employerService.getJobsListByCompanyIdService(companyId);
      res.sendSuccess200Response("success", data);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };

  public getCompanyDetail = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const data =
        await this.employerService.getCompanyDetailService(companyId);
      res.sendSuccess200Response(" success", data);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };

  public addAppointment = async (req: Request, res: Response) => {
    try {
      const attachments = req.files?.attachment;
      // const appoinmentData: Appoinment = req.body;
      // const { attachment, ...appoinmentData } = req.body;
      const bccContent = await smtpSettingModel.find();
      await this.employerService.addAppoinmentService(
        req.body,
        attachments,
        bccContent,
      );
      res.sendSuccess200Response(" success", null);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };
}

export default EmployerController;
