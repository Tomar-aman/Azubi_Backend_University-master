import { type Request, type Response } from "express";
import { ApplicationTipsService } from "./tip.service";

class ApplicationTipsController {
  private readonly applicationTipsService: ApplicationTipsService;

  constructor() {
    this.applicationTipsService = new ApplicationTipsService();
  }

  public getAllTips = async (_: Request, res: Response): Promise<void> => {
    try {
      const tips = await this.applicationTipsService.getAllTips();
      res.status(200).json(tips);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public getTipById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const tip = await this.applicationTipsService.getTipById(id);
      if (!tip) {
        res.status(404).json({ error: "Tip not found" });
        return;
      }
      res.status(200).json(tip);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public createTip = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description } = req.body;
      const newTip = await this.applicationTipsService.createTip(
        title,
        description,
      );
      res.status(201).json(newTip);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public updateTip = async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } = req.body;
      const { title, description } = req.body;
      const updatedTip = await this.applicationTipsService.updateTip(
        _id,
        title,
        description,
      );
      if (!updatedTip) {
        res.status(404).json({ error: "Tip not found" });
        return;
      }
      res.status(200).json(updatedTip);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public deleteTip = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedTip = await this.applicationTipsService.deleteTip(id);
      if (!deletedTip) {
        res.status(404).json({ error: "Tip not found" });
        return;
      }
      res.status(200).json(deletedTip);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public getAllTipsByFilter = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { searchValue, pageNo, recordPerPage } = req.query;
      const tips = await this.applicationTipsService.getAllTipsByFilter(
        searchValue as string,
        parseInt(pageNo as string),
        parseInt(recordPerPage as string),
      );
      res.status(200).json({
        success: true,
        message: "Application tips retrieved successfully",
        data: tips,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving application tips",
        error: error.message,
      });
    }
  };
}
export default ApplicationTipsController;
