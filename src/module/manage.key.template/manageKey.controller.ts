import { type Request, type Response } from "express";
import { ManageKeyService } from "./manageKey.service";
import logger from "../../utils/logger";

class ManageKeyController {
  private readonly manageKeyService: ManageKeyService;

  constructor() {
    this.manageKeyService = new ManageKeyService();
  }

  public getAllKeys = async (_, res: Response) => {
    try {
      const keys = await this.manageKeyService.getAllKeysService();
      res.sendSuccess200Response("Keys retrieved successfully", keys);
    } catch (error) {
      logger.error("getAllKeys", error);
      res.sendErrorResponse("Error retrieving keys", error);
    }
  };

  public editKey = async (req: Request, res: Response) => {
    try {
      const updatedKey = await this.manageKeyService.editKeyService(req.body);
      res.sendSuccess200Response("Key edited successfully", updatedKey);
    } catch (error) {
      logger.error("editKey", error);
      res.sendErrorResponse("Error editing key", error);
    }
  };
}

export default ManageKeyController;
