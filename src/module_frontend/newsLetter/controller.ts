import { Request, Response } from "express";
import NewsletterFormModel from "../../../src/models/newsLetterForm";
import { FileHandler } from "../../utils/fileHandler";
import { mediaModel } from "../../../src/models/index";

class NewsletterFormController {
  private fileHandler: FileHandler;

  constructor(fileHandler: FileHandler) {
    this.fileHandler = fileHandler;
  }

  // Create or update the newsletter form
  public async createOrUpdateNewsletterForm(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const {
        title,
        subtitle,
        placeholderText,
        buttonText,
        privacyNote,
        backgroundColor,
      } = req.body;

      // Handle file upload for leftImage if provided (assume companyLogo is the image field)
      let leftImage;
      if (req.files?.companyLogo) {
        leftImage = await this.fileHandler.saveFileAndCreateMedia(
          req.files.companyLogo,
        );
      }

      // Check if a newsletter form document already exists
      const existingForm = await NewsletterFormModel.findOne();

      if (existingForm) {
        // Update existing form
        existingForm.title = title;
        existingForm.subtitle = subtitle;
        existingForm.placeholderText = placeholderText;
        existingForm.buttonText = buttonText;
        existingForm.privacyNote = privacyNote;
        existingForm.backgroundColor = backgroundColor;

        if (leftImage) {
          existingForm.leftImage = leftImage._id; // Update leftImage if new image is provided
        }

        const updatedForm = await existingForm.save();
        return res.status(200).json(updatedForm);
      } else {
        // Create new form
        const newNewsletterForm = new NewsletterFormModel({
          title,
          subtitle,
          placeholderText,
          buttonText,
          privacyNote,
          backgroundColor,
          leftImage: leftImage ? leftImage._id : null, // Set leftImage if available
        });

        const savedForm = await newNewsletterForm.save();
        return res.status(201).json(savedForm);
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Failed to create or update newsletter form" });
    }
  }

  // Get the newsletter form (since there will only be one)
  public async getNewsletterForm(_: Request, res: Response): Promise<Response> {
    try {
      const newsletterForm = await NewsletterFormModel.aggregate([
        {
          $lookup: {
            from: mediaModel.collection.name, // Name of the Media collection (ensure it's lowercase or correctly named)
            localField: "leftImage", // Field in NewsletterFormModel that references Media
            foreignField: "_id", // Field in Media that NewsletterFormModel.leftImage references
            as: "leftImageDetails", // Name of the field to store the joined media data
          },
        },
        {
          $unwind: {
            path: "$leftImageDetails", // Unwind the array of joined media (since `leftImage` is likely a single image)
            preserveNullAndEmptyArrays: true, // In case no image is associated, this avoids errors
          },
        },
        {
          $project: {
            title: 1,
            subtitle: 1,
            placeholderText: 1,
            buttonText: 1,
            privacyNote: 1,
            backgroundColor: 1,
            leftImageDetails: "$leftImageDetails",
          },
        },
      ]);

      if (!newsletterForm) {
        return res.status(404).json({ message: "Newsletter form not found" });
      }

      return res.status(200).json(newsletterForm);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Failed to retrieve newsletter form" });
    }
  }
}

export default NewsletterFormController;
