import express from "express";
import { getCompaniesLogo, getCompany, getMedia } from "./controller";

const frontendCompanyRoute = express.Router();
frontendCompanyRoute.get("/all-media", getMedia);
frontendCompanyRoute.get("/", getCompaniesLogo);
frontendCompanyRoute.get("/:id", getCompany);

export default frontendCompanyRoute;
