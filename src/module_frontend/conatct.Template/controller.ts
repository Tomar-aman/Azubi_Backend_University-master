import { Request, Response } from "express";
import {contactFormDaynamic} from "../../models/index";

class ContactFormController {
  // Create or Update Contact Form
  public async createOrUpdateContactForm(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const contactDetailData = req.body;
      delete contactDetailData._id;

      // If `id` exists in the request, update the existing document, otherwise create a new one.
      const updatedContactDetail = await contactFormDaynamic.findOneAndUpdate(
        {}, // Find the document using `_id` (adjust this based on your unique field)
        contactDetailData,
        { new: true, upsert: true, runValidators: true },
      );

      return res.status(200).json({
        message: updatedContactDetail ? "Contact Form updated successfully." : "Contact Form created successfully.",
        data: updatedContactDetail
      });
    } catch (error) {
      return res.status(500).json({ message: "Error creating or updating Contact Form.", error: error.message });
    }
  }

  // Get Contact Form by ID
  public async getContactForm(_: Request, res: Response): Promise<Response> {
    try {

      const contactDetail = await contactFormDaynamic.findOne().sort({ createdAt: -1 });

      if (!contactDetail) {
        return res.status(404).json({ message: "Contact Form not found." });
      }

      return res.status(200).json({ data: contactDetail });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching Contact Form.", error: error.message });
    }
  }
}

export default new ContactFormController();
