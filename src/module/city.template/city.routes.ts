import express from "express";
import CityController from "./city.controller";
import AuthMiddleware from "../../middleware/authenticator";

const cityRoute = express.Router();
const cityController = new CityController();
const authMiddleware = new AuthMiddleware();

cityRoute.get("/", cityController.getAllCities);
cityRoute.get("/get-city-frontend", cityController.getAllCitiesInFrontend);
cityRoute.get(
  "/get-region-cities-frontend",
  cityController.getAllStateswithCities,
);
cityRoute.get(
  "/get_all_city",
  authMiddleware.requireUser,
  cityController.getAllCitiesByFilter,
);
cityRoute.get("/:id", authMiddleware.requireUser, cityController.getCityById);
cityRoute.post("/", authMiddleware.requireUser, cityController.addCity);
cityRoute.put("/", authMiddleware.requireUser, cityController.updateCityById);
cityRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  cityController.deleteCityById,
);

export default cityRoute;
