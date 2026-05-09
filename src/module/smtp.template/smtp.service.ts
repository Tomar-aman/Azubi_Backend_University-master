import { smtpSettingModel } from "../../models/index";
import { type SmtpSetting } from "../../models/smtp"; // Assuming you have an SMTP model

export class SMTPService {
  public async getSMTPSettings() {
    try {
      const smtpSettings = await smtpSettingModel.findOne();
      return smtpSettings;
    } catch (error) {
      // Handle errors appropriately (e.g., log the error or throw a custom error)
      throw new Error("Error fetching SMTP settings: " + error.message);
    }
  }

  public async updateSMTPSettings(updatedData: Partial<SmtpSetting>) {
    try {
      const updatedSMTPSettings = await smtpSettingModel.findOneAndUpdate(
        {},
        updatedData,
        {
          new: true,
          upsert: true,
        },
      );
      return updatedSMTPSettings;
    } catch (error) {
      // Handle errors appropriately (e.g., log the error or throw a custom error)
      throw new Error("Error updating SMTP settings: " + error.message);
    }
  }
}
