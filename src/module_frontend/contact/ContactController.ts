import { Request, Response } from "express";
import ContactModel from "../../models/contactModel";

class ContactController {
  // Create or Update Contact Record
  public async upsertContact(req: Request, res: Response): Promise<Response> {
    try {
      const { inputKey, inputKey1, inputKey2, inputKey3, inputKey4, field1, field2, field3, field4 } = req.body;

      // Since we're only handling one record, we can use `findOneAndUpdate` to either create or update it.
      const contact = await ContactModel.findOneAndUpdate(
        {},
        { inputKey, inputKey1, inputKey2, inputKey3, inputKey4, field1, field2, field3, field4 },
        { new: true, upsert: true } // `upsert: true` ensures it creates a new document if none exists
      );

      return res.status(200).json({
        success: true,
        message: "Contact record has been created/updated successfully",
        data: contact,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create/update contact record",
        error: error.message,
      });
    }
  }

  // Get Contact Record
  public async getContact(_: Request, res: Response): Promise<Response> {
    try {
      const contact = await ContactModel.findOne({});
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "No contact record found",
        });
      }
      return res.status(200).json({
        success: true,
        data: contact,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch contact record",
        error: error.message,
      });
    }
  }
}

export default new ContactController();
