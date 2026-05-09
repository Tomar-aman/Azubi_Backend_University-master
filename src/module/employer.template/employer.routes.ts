import express from "express";
import EmployerController from "./employer.controller";
// import JoiValidator from "../../utils/joiValidator";
// import {
//   createEmployerBodyValidator,
//   updateEmployerSchema,
// } from "./employer.schema";
import AuthMiddleware from "../../middleware/authenticator";

const employerRoute = express.Router();
const employerController = new EmployerController();
// const joiValidator = new JoiValidator();
const authMiddleware = new AuthMiddleware();

employerRoute.get("/employees", employerController.getEmployeesList);
employerRoute.get("/job-list/:id", employerController.getJobsListByCompanyId);
employerRoute.get(
  "/",
  authMiddleware.requireUser,
  employerController.getAllEmployers,
);

employerRoute.post(
  "/",
  authMiddleware.requireUser,
  // joiValidator.validate(createEmployerBodyValidator, "body"),
  employerController.addEmployer,
);
employerRoute.put(
  "/:id",
  authMiddleware.requireUser,
  // joiValidator.validate(updateEmployerSchema, "body"),
  employerController.updateEmployerById,
);
employerRoute.delete(
  "/",
  authMiddleware.requireUser,
  employerController.deleteEmployerById,
);
employerRoute.get(
  "/get-employer-by-city-id/:city",
  authMiddleware.requireUser,
  employerController.getEmployerByCityAndIndustriesId,
);
employerRoute.get("/get-emp-suggesstion", employerController.getEmpSuggesstion);
employerRoute.get(
  "/get-all-emp-frontend",
  employerController.getAllEmployersForFrontend,
);

employerRoute.get("/get-jobs-by-id", employerController.getJobsByCompanyId);
employerRoute.post("/add-appoinment", employerController.addAppointment);

employerRoute.get(
  "/company-Detail/:companyId",
  employerController.getCompanyDetail,
);
employerRoute.get(
  "/:id",
  // authMiddleware.requireUser,
  employerController.getEmployerById,
);

export default employerRoute;
