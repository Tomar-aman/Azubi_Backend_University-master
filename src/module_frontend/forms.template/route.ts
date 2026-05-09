import express from "express";
import { dynamicEmail, formHandler, subscribeHandler } from "./controller";

const formRoute = express.Router();
formRoute.post("/", formHandler);
formRoute.post("/subscribes", subscribeHandler);
formRoute.post("/dynamic-email", dynamicEmail);
export default formRoute;
