import { type Request, type Response } from "express";
import { ContactService } from "./contact.service";
import logger from "../../utils/logger";
import emailService from "../../utils/emailService";
import { smtpSettingModel } from "../../models";
class ContactController {
  private readonly contactService: ContactService;

  constructor() {
    this.contactService = new ContactService();
  }

  public getAllContacts = async (_: Request, res: Response) => {
    try {
      const contacts = await this.contactService.getAllContacts();
      res.status(200).json({
        success: true,
        message: "Contacts retrieved successfully",
        data: contacts,
      });
    } catch (error) {
      logger.error("getAllContacts", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving contacts",
        error: error.message,
      });
    }
  };

  public getContactById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const contact = await this.contactService.getContactById(id);

      if (!contact) {
        res.status(404).json({
          success: false,
          message: "Contact not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Contact retrieved successfully",
        data: contact,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving contact",
        error: error.message,
      });
    }
  };

  public addContact = async (req: Request, res: Response) => {
    try {
      const contactData = req.body;
      const newContact = await this.contactService.addContact(contactData);
      const bccContent = await smtpSettingModel.find();
      void emailService.sendEmail({
        // bcc: ["karriere@azubiregional.de"],
        bcc: `${bccContent[0]?.to}`,
        subject: "Kontaktanfrage AzubiRegional.de Allgemein",
        html: `
          <p><b>Name:</b> ${contactData.name}</p>
          <p><b>Email:</b> ${contactData.email}</p>
          <p><b>Phone Number:</b> ${contactData.phoneNumber}</p>
          <p><b>Message:</b> ${contactData.message}</p>
        `,
      });

      res.status(201).json({
        success: true,
        message: "Contact added successfully",
        data: newContact,
      });
    } catch (error) {
      logger.error("addContact", error);
      res.status(500).json({
        success: false,
        message: "Error adding contact",
        error: error.message,
      });
    }
  };

  public updateContactById = async (req: Request, res: Response) => {
    try {
      const updatedContactData = req.body;
      const updatedContact = await this.contactService.updateContactById(
        updatedContactData._id,
        updatedContactData,
      );
      res.status(200).json({
        success: true,
        message: "Contact updated successfully",
        data: updatedContact,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating contact",
        error: error.message,
      });
    }
  };

  public deleteContactById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedContact = await this.contactService.deleteContactById(id);
      res.status(200).json({
        success: true,
        message: "Contact deleted successfully",
        data: deletedContact,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting contact",
        error: error.message,
      });
    }
  };

  public getAllContactsByFilter = async (req: Request, res: Response) => {
    try {
      const { searchValue, pageNo, recordPerPage } = req.query;
      const contacts = await this.contactService.getAllContactsByFilter(
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        searchValue ? searchValue.toString() : "",
        parseInt(pageNo as string),
        parseInt(recordPerPage as string),
      );
      res.status(200).json({
        success: true,
        message: "Contacts retrieved successfully",
        data: contacts,
      });
    } catch (error) {
      logger.error("getAllContactsByFilter", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving contacts",
        error: error.message,
      });
    }
  };
}

export default ContactController;
