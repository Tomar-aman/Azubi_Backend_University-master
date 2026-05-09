/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import { ManageContentService } from "./manage.content.service";
import logger from "../../utils/logger";
import { FileHandler } from "../../utils/fileHandler";
class ManageContentController {
  private readonly manageContentService: ManageContentService;
  private readonly fileHandler: FileHandler;
  constructor() {
    this.manageContentService = new ManageContentService();
    this.fileHandler = new FileHandler();
  }

  public getAllContent = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllContentService();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  public editContent = async (req: Request, res: Response) => {
    try {
      const updatedContent = await this.manageContentService.editContentService(
        req.body,
      );
      res.sendSuccess200Response("Content edited successfully", updatedContent);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  // home content
  public editHomeContent = async (req: Request, res: Response) => {
    try {
      // text data
      const {
        bannerCustomColor,
        galleryCustomColor,
        blockCustomColor,
        companyCustomColor,
        tips_url_1,
        tips_url_2,
        tips_url_3,
        oldtips_3,
        oldtips_2,
        oldtips_1,
        oldMailChimpLogo,
      } = req.body;
      // file data
      const { tips_1, tips_2, tips_3, mailChimpLogo } = req?.files || {};
      await this.manageContentService.editHomeContent(
        {
          bannerCustomColor,
          galleryCustomColor,
          blockCustomColor,
          companyCustomColor,
          tips_url_1,
          tips_url_2,
          tips_url_3,
        },
        {
          tips_1,
          tips_2,
          tips_3,
          mailChimpLogo,
          oldtips_3,
          oldtips_2,
          oldtips_1,
          oldMailChimpLogo,
        },
      );

      res.sendSuccess200Response("Content edited successfully", []);
    } catch (error) {
      console.log({ error });
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  public getHomeContent = async (_: Request, res: Response) => {
    try {
      const [data] = await this.manageContentService.getHomeContent();
      res.sendSuccess200Response("Content edited successfully", data);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  // job market content
  public getAllJobMarketContent = async (_, res: Response) => {
    try {
      const content =
        await this.manageContentService.getAllJobMarketContentService();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  public editJobMarketContent = async (req: Request, res: Response) => {
    try {
      const updatedContent =
        await this.manageContentService.editJobMarketContentService(req.body);
      res.sendSuccess200Response("Content edited successfully", updatedContent);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  // apply form content
  public getAllApplyFormContent = async (_, res: Response) => {
    try {
      const content =
        await this.manageContentService.getAllApplyFormContentService();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  public editApplyFormContent = async (req: Request, res: Response) => {
    try {
      const updatedContent =
        await this.manageContentService.editApplyFormContentService(req.body);
      res.sendSuccess200Response("Content edited successfully", updatedContent);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  // company content
  public getAllCompanyContent = async (_, res: Response) => {
    try {
      const content =
        await this.manageContentService.getAllCompanyContentService();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  public editCompanyContent = async (req: Request, res: Response) => {
    try {
      const { ownerImage, industryImage } = req?.files || {};
      const { oldIndustryImage, oldOwnerImage } = req.body;
      if (ownerImage) {
        const newOwnerImage =
          await this.fileHandler.saveFileAndCreateMedia(ownerImage);
        req.body.ownerImage = newOwnerImage;
      }
      if (oldOwnerImage) {
        req.body.ownerImage = oldOwnerImage;
      }
      if (industryImage) {
        const newIndustryImage =
          await this.fileHandler.saveFileAndCreateMedia(industryImage);
        req.body.industryImage = newIndustryImage;
      }
      if (oldIndustryImage) {
        req.body.industryImage = oldIndustryImage;
      }
      const updatedContent =
        await this.manageContentService.editCompanyContentService(req.body);
      res.sendSuccess200Response("Content edited successfully", updatedContent);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  // side bar content for app
  public getAllSideBarContent = async (_, res: Response) => {
    try {
      const content =
        await this.manageContentService.getAllSideBarContentService();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  public editSideBarContent = async (req: Request, res: Response) => {
    try {
      const updatedContent =
        await this.manageContentService.editSideBarContentService(req.body);
      res.sendSuccess200Response("Content edited successfully", updatedContent);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  // faq content
  public editFaqContent = async (req: Request, res: Response) => {
    const { operation } = req.query;

    try {
      if (operation === "accordion") {
        const payload = req.body;
        const updatedContent = await this.manageContentService.editFaqContent(
          payload,
          operation,
        );
        return res.sendSuccess200Response(
          "FAQ Accordion Content  edited successfully",
          updatedContent,
        );
      }
      if (operation === "iconSection") {
        const { image } = req?.files || {};
        const payload = req.body;
        if (payload.image === "[object Object]") {
          delete payload.image;
        }
        const updatedContent = await this.manageContentService.editFaqContent(
          {
            data: payload,
            media: { image },
          },
          "iconSection",
        );
        return res.sendSuccess200Response(
          "FAQ Icon section Content  edited successfully",
          updatedContent,
        );
      }
      if (operation === "header") {
        const updatedContent = await this.manageContentService.editFaqContent(
          {
            ...req.body,
            ...req.files,
          },
          "header",
        );
        return res.sendSuccess200Response(
          "FAQ Header Content  edited successfully",
          updatedContent,
        );
      }
      if (operation === "cards") {
        req.body = { ...req.body, ...req.files };
        const updatedContent = await this.manageContentService.editFaqContent(
          req.body,
          "cards",
        );
        return res.sendSuccess200Response(
          "FAQ cards Content  edited successfully",
          updatedContent,
        );
      }
      return res.sendErrorResponse("invalid operation value", null);
    } catch (error) {
      console.log({ error });
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  public getAllFAQContent = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllFAQContentService();
      res.sendSuccess200Response("FAQ Content retrieved successfully", content);
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  /* about content */
  public editAboutContent = async (req: Request, res: Response) => {
    const { operation } = req.query;
    try {
      if (operation === "banner") {
        req.body = { ...req.body, ...req.files };
        const updatedContent = await this.manageContentService.editAboutContent(
          req.body,
          "banner",
        );
        return res.sendSuccess200Response(
          "Banner Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "textBlock") {
        const updatedContent = await this.manageContentService.editAboutContent(
          req.body,
          operation,
        );
        return res.sendSuccess200Response(
          "Text Block Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "aboutFeature") {
        req.body = { ...req.body, ...req.files };
        const updatedContent = await this.manageContentService.editAboutContent(
          req.body,
          "aboutFeature",
        );
        return res.sendSuccess200Response(
          "About Feature Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "marketing") {
        const updatedContent = await this.manageContentService.editAboutContent(
          req.body,
          "marketing",
        );
        return res.sendSuccess200Response(
          "About Market Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "youTube") {
        const updatedContent = await this.manageContentService.editAboutContent(
          req.body,
          "youTube",
        );
        return res.sendSuccess200Response(
          "About youtube Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "mediaData") {
        const updatedContent = await this.manageContentService.editAboutContent(
          req.body,
          "mediaData",
        );
        return res.sendSuccess200Response(
          "About Media Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "calender") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "calender",
        );
        return res.sendSuccess200Response(
          "About Calender Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "offerCard") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "offerCard",
        );
        return res.sendSuccess200Response(
          "About Offer Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "customer") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "customer",
        );
        return res.sendSuccess200Response(
          "About customer Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "slider") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "slider",
        );
        return res.sendSuccess200Response(
          "About Slider Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "exhibitor") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "exhibitor",
        );
        return res.sendSuccess200Response(
          "About exhibitor Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "careerFair") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "careerFair",
        );
        return res.sendSuccess200Response(
          "About Career Fair Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "contact") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "contact",
        );
        return res.sendSuccess200Response(
          "About contact Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "twoCards") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          operation,
        );
        return res.sendSuccess200Response(
          "Card Content edited successfully",
          updatedContent,
        );
      }
      return res.sendErrorResponse("invalid operation value", null);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  public getAllAboutContent = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllAboutContent();
      res.sendSuccess200Response(
        "AboutContent retrieved successfully",
        content,
      );
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  /* job magazine order content */

  public getAllJobMagazineContent = async (_, res: Response) => {
    try {
      const content =
        await this.manageContentService.getAllJobMagazineContent();
      res.sendSuccess200Response(
        "AboutContent retrieved successfully",
        content,
      );
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  public editJobMagazineContent = async (req: Request, res: Response) => {
    const { operation } = req.query;
    try {
      if (operation === "header") {
        const updatedContent =
          await this.manageContentService.editJobMagazineContent(
            req.body,
            operation,
          );
        return res.sendSuccess200Response(
          "Header Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "jobMagazineCard") {
        const updatedContent =
          await this.manageContentService.editJobMagazineContent(
            { ...req.body, ...req.files },
            operation,
          );
        return res.sendSuccess200Response(
          "Magazine card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "jobMagazinePoints") {
        const updatedContent =
          await this.manageContentService.editJobMagazineContent(
            { ...req.body, ...req.files },
            operation,
          );
        return res.sendSuccess200Response(
          "Magazine points Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "aboutService") {
        const updatedContent =
          await this.manageContentService.editJobMagazineContent(
            req.body,
            operation,
          );
        return res.sendSuccess200Response(
          "About Our services Content edited successfully",
          updatedContent,
        );
      }
      return res.sendErrorResponse("invalid operation value", null);
    } catch (error) {
      console.log({ error });
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  /* contact us content */
  public getAllContactUsContent = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllContactUsContent();
      res.sendSuccess200Response(
        "Contact us Content retrieved successfully",
        content,
      );
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  public editContactUsContent = async (req: Request, res: Response) => {
    const { operation } = req.query;
    try {
      if (operation === "pageHeading") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            req.body,
            operation,
          );
        return res.sendSuccess200Response(
          "Header Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "addressSection") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            req.body,
            operation,
          );
        return res.sendSuccess200Response(
          "Address section Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "aboutUs") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            { ...req.body, ...req.files },
            operation,
          );
        return res.sendSuccess200Response(
          "About us Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "counter") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            req.body,
            operation,
          );
        return res.sendSuccess200Response(
          "Counter Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "contactCardFirstWithPoints") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            { ...req.body, ...req.files },
            operation,
          );
        return res.sendSuccess200Response(
          "Card with point Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "ContactCardSecond") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            { ...req.body, ...req.files },
            operation,
          );
        return res.sendSuccess200Response(
          "Card second Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "aboutTeam") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            { ...req.body, ...req.files },
            operation,
          );
        return res.sendSuccess200Response(
          "About team Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "contactForm") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            req.body,
            operation,
          );
        return res.sendSuccess200Response(
          "Contact Form Content edited successfully",
          updatedContent,
        );
      }
      return res.sendErrorResponse("invalid operation value", null);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  /* job wall content controller */
  public getAllJobWallContent = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllJobWallContent();
      res.sendSuccess200Response(
        "Job wall Content retrieved successfully",
        content,
      );
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  public editJobWallContent = async (req: Request, res: Response) => {
    const { operation } = req.query;
    try {
      if (operation === "banner") {
        const updatedContent =
          await this.manageContentService.editJobWallContent(
            { ...req.body, ...req.files },
            operation,
          );
        return res.sendSuccess200Response(
          "Job wall Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "industryIcon") {
        const updatedContent =
          await this.manageContentService.editJobWallContent(
            { ...req.files, ...req.body },
            operation,
          );
        return res.sendSuccess200Response(
          "Job wall Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "contactPersonIcon") {
        const updatedContent =
          await this.manageContentService.editJobWallContent(
            { ...req.files, ...req.body },
            operation,
          );
        return res.sendSuccess200Response(
          "Job wall Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "locationIcon") {
        const updatedContent =
          await this.manageContentService.editJobWallContent(
            { ...req.files, ...req.body },
            operation,
          );
        return res.sendSuccess200Response(
          "Job wall Content edited successfully",
          updatedContent,
        );
      }
      return res.sendErrorResponse("invalid operation value", null);
    } catch (error) {
      console.log({ error });
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  /* home page dynamic content v2 */
  public editHomePageV2Content = async (req: Request, res: Response) => {
    const { operation } = req.query;
    try {
      if (operation === "cardSection") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            { ...req.body, ...req.files },
            operation,
          );
        return res.sendSuccess200Response(
          "Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "youtubeSection") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            { ...req.body, ...req.files },
            operation,
          );
        return res.sendSuccess200Response(
          "edited successfully",
          updatedContent,
        );
      }
      if (operation === "searchBar") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            req.body,
            operation,
          );
        return res.sendSuccess200Response(
          "edited successfully",
          updatedContent,
        );
      }
      if (operation === "topState") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            req.body,
            operation,
          );
        return res.sendSuccess200Response(
          "edited successfully",
          updatedContent,
        );
      }
      if (operation === "federalState") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            req.body,
            operation,
          );
        return res.sendSuccess200Response(
          "edited successfully",
          updatedContent,
        );
      }
      if (operation === "gallery") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            req.body,
            operation,
          );
        return res.sendSuccess200Response(
          "edited successfully",
          updatedContent,
        );
      }
      if (operation === "textContainer") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            { ...req.body, ...req.files },
            operation,
          );
        return res.sendSuccess200Response(
          "edited successfully",
          updatedContent,
        );
      }
      if (operation === "emailSection") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            { ...req.body, ...req.files },
            operation,
          );
        return res.sendSuccess200Response(
          "edited successfully",
          updatedContent,
        );
      }
      if (operation === "companiesLogo") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            { ...req.body },
            operation,
          );
        return res.sendSuccess200Response(
          "edited successfully",
          updatedContent,
        );
      }
      if (operation === "headerLogoSideImage") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            { ...req.body, ...req.files },
            operation,
          );
        return res.sendSuccess200Response(
          "Header logo side image edited successfully",
          updatedContent,
        );
      }
      if (operation === "welcomeMessageForApp") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            req.body,
            operation,
          );
        return res.sendSuccess200Response(
          "edited successfully",
          updatedContent,
        );
      }

      return res.sendErrorResponse("invalid operation value", null);
    } catch (error) {
      console.log({ error });
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  public getAllHomePageV2Content = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllHomePageV2Content();
      res.sendSuccess200Response(
        "Home page v2 Content retrieved successfully",
        content,
      );
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  /* Email Dynamic content */
  public editEmailContent = async (req: Request, res: Response) => {
    const { operation } = req.query;
    try {
      if (operation === "application") {
        const updatedContent = await this.manageContentService.editEmailContent(
          req.body,
          operation,
        );
        return res.sendSuccess200Response(
          "Content edited successfully",
          updatedContent,
        );
      }

      if (operation === "appointment") {
        const updatedContent = await this.manageContentService.editEmailContent(
          req.body,
          operation,
        );
        return res.sendSuccess200Response(
          "Content edited successfully",
          updatedContent,
        );
      }

      return res.sendErrorResponse("invalid operation value", null);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  public getAllEmailContent = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllEmailContent();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };
}

export default ManageContentController;
