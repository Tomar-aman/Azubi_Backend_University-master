import { type Request, type Response } from "express";
import { CityService } from "./city.service";
import logger from "../../utils/logger";

class CityController {
  private readonly cityService: CityService;

  constructor() {
    this.cityService = new CityService();
  }

  public getAllCities = async (req: Request, res: Response) => {
    try {
      const { popularity } = req.query;
      if (Number(popularity)) {
        const cities = await this.cityService.getPopularCity();
        return res.sendSuccess200Response(
          "popular Cities retrieved successfully",
          cities,
        );
      }
      const cities = await this.cityService.getAllCitiesService();
      return res.sendSuccess200Response(
        "Cities retrieved successfully",
        cities,
      );
    } catch (error) {
      logger.error("getAllCities", error);
      res.sendErrorResponse("Error retrieving cities", error);
    }
  };

  public getAllCitiesByFilter = async (req, res: Response) => {
    try {
      const { searchValue, pageNo, recordPerPage } = req.query;
      const payload = { searchValue, pageNo, recordPerPage };
      const cities = await this.cityService.getAllCitiesByFilter(payload);
      res.sendSuccess200Response("Cities retrieved successfully", cities);
    } catch (error) {
      logger.error("getAllCities", error);
      res.sendErrorResponse("Error retrieving cities", error);
    }
  };

  public getCityById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const city = await this.cityService.getCityByIdService(id);
      if (!city) {
        res.sendNotFound404Response("City not found", null);
        return;
      }
      res.sendSuccess200Response("City retrieved successfully", city);
    } catch (error) {
      res.sendErrorResponse("Error retrieving city", error);
    }
  };

  public addCity = async (req: Request, res: Response) => {
    try {
      const newCity = await this.cityService.addCityService(req.body);
      res.sendCreated201Response("City added successfully", newCity);
    } catch (error) {
      logger.error("addCity", error);
      res.sendErrorResponse("Error adding city", error);
    }
  };

  public updateCityById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const updatedCity = await this.cityService.updateCityByIdService(
        id,
        req.body,
      );
      res.sendSuccess200Response("City updated successfully", updatedCity);
    } catch (error) {
      res.sendErrorResponse("Error updating city", error);
    }
  };

  public deleteCityById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedCity = await this.cityService.deleteCityByIdService(id);
      res.sendSuccess200Response("City deleted successfully", deletedCity);
    } catch (error) {
      res.sendErrorResponse("Error deleting city", error);
    }
  };

  public getAllCitiesInFrontend = async (_, res: Response) => {
    try {
      const cities = await this.cityService.getAllCitiesFrontendService();
      res.sendSuccess200Response("Cities retrieved successfully", cities);
    } catch (error) {
      logger.error("getAllCities", error);
      res.sendErrorResponse("Error retrieving cities", error);
    }
  };

  public getAllStateswithCities = async (_, res) => {
    try {
      const data = await this.cityService.getRegionWithCities();
      res.sendSuccess200Response("Cities retrieved successfully", data);
    } catch (error) {
      logger.error("getAllCities", error);
      res.sendErrorResponse("Error retrieving cities", error);
    }
  };
}

export default CityController;
