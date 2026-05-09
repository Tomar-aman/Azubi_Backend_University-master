import express from "express";
import AuthMiddleware from "../../middleware/authenticator";
import ManageContentController from "./manage.content.controller";
import JoiValidator from "../../utils/joiValidator";
import { editContentValidator } from "./manage.content.schema";

const manageContentRoute = express.Router();
const manageContentController = new ManageContentController();
const authMiddleware = new AuthMiddleware();
const joiValidator = new JoiValidator();
manageContentRoute.get("/", manageContentController.getAllContent);

manageContentRoute.put(
  "/",
  authMiddleware.requireUser,
  joiValidator.validate(editContentValidator, "body"),
  manageContentController.editContent,
);

manageContentRoute.put(
  "/home-content",
  // authMiddleware.requireUser,
  manageContentController.editHomeContent,
);

manageContentRoute.get(
  "/home-content",
  // authMiddleware.requireUser,
  manageContentController.getHomeContent,
);
// job market
manageContentRoute.put(
  "/job-market-content",
  manageContentController.editJobMarketContent,
);
manageContentRoute.get(
  "/job-market-content",
  manageContentController.getAllJobMarketContent,
);
// apply form content
manageContentRoute.put(
  "/apply-form-content",
  manageContentController.editApplyFormContent,
);
manageContentRoute.get(
  "/apply-form-content",
  manageContentController.getAllApplyFormContent,
);

// company content
manageContentRoute.put(
  "/company-content",
  manageContentController.editCompanyContent,
);
manageContentRoute.get(
  "/company-content",
  manageContentController.getAllCompanyContent,
);

// side bar content for app
manageContentRoute.put(
  "/side-bar-content",
  manageContentController.editSideBarContent,
);
manageContentRoute.get(
  "/side-bar-content",
  manageContentController.getAllSideBarContent,
);

// faq content
manageContentRoute.put("/faq-content", manageContentController.editFaqContent);
manageContentRoute.get(
  "/faq-content",
  manageContentController.getAllFAQContent,
);

// about content
manageContentRoute.put(
  "/about-content",
  manageContentController.editAboutContent,
);
manageContentRoute.get(
  "/about-content",
  manageContentController.getAllAboutContent,
);

// job magazine content
manageContentRoute.put(
  "/magazine-order",
  manageContentController.editJobMagazineContent,
);
manageContentRoute.get(
  "/magazine-order",
  manageContentController.getAllJobMagazineContent,
);

// contact us content
manageContentRoute.get(
  "/contact-us",
  manageContentController.getAllContactUsContent,
);
manageContentRoute.put(
  "/contact-us",
  manageContentController.editContactUsContent,
);

// job wall content route
manageContentRoute.get(
  "/job-wall",
  manageContentController.getAllJobWallContent,
);
manageContentRoute.put("/job-wall", manageContentController.editJobWallContent);

// home page v2
manageContentRoute.get(
  "/home-page-v2",
  manageContentController.getAllHomePageV2Content,
);
manageContentRoute.put(
  "/home-page-v2",
  manageContentController.editHomePageV2Content,
);

// email content
manageContentRoute.get(
  "/email-content",
  manageContentController.getAllEmailContent,
);
manageContentRoute.put(
  "/email-content",
  manageContentController.editEmailContent,
);
export default manageContentRoute;
