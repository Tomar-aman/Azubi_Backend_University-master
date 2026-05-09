import { type Request, type Response } from "express";
import { SMTPService } from "./smtp.service";
import logger from "../../utils/logger";

class SMTPController {
  private readonly smtpService: SMTPService;

  constructor() {
    this.smtpService = new SMTPService();
  }

  public getSMTPSettings = async (_: Request, res: Response) => {
    try {
      const smtpSettings = await this.smtpService.getSMTPSettings();
      res.sendSuccess200Response(
        "SMTP settings retrieved successfully",
        smtpSettings,
      );
    } catch (error) {
      logger.error("getSMTPSettings", error);
      res.sendErrorResponse("Error retrieving SMTP settings", error);
    }
  };

  public updateSMTPSettings = async (req: Request, res: Response) => {
    try {
      const updatedSMTPSettings = await this.smtpService.updateSMTPSettings(
        req.body,
      );
      res.sendSuccess200Response(
        "SMTP settings updated successfully",
        updatedSMTPSettings,
      );
    } catch (error) {
      logger.error("updateSMTPSettings", error);
      res.sendErrorResponse("Error updating SMTP settings", error);
    }
  };
}

export default SMTPController;
