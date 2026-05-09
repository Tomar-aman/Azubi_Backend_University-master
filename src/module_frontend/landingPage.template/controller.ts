import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { FileHandler } from "../../utils/fileHandler";
import LandingPageImagesModel from "../../models/landingPageGallery";
const fileHandler = new FileHandler();
export const createLandingPageContent = async (req: Request, res: Response) => {
  try {
    const mediaIds: Types.ObjectId[] = [];
    if (req.files && Array.isArray(req.files.image)) {
      for (const file of req.files.image) {
        const mediaId = await fileHandler.saveFileAndCreateMedia(file);
        if (mediaId) {
          mediaIds.push(new Types.ObjectId(mediaId)); // Convert the mediaId to ObjectId and push it into the array
        }
      }
    }

    if (mediaIds.length > 20) {
      return res.status(400).json({ message: "Maximum of 20 images allowed" });
    }

    const newContent = new LandingPageImagesModel({
      images: mediaIds,
    });

    const savedContent = await newContent.save();
    res.status(201).json(savedContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all ManageHomePage entries
export const getLandingPageContents = async (_: Request, res: Response) => {
  try {
    const contents = await LandingPageImagesModel.findOne().populate("images"); // Populate to get full Media document
    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateLandingPageContent = async (req: Request, res: Response) => {
  try {
    const { existingImageIds } = req.body;

    // Fetch the current document from the database
    const existingContent = await LandingPageImagesModel.findOne();
    if (!existingContent) {
      return res.status(404).json({ message: "Content not found" });
    }
    let updatedImageIds = (existingContent.images =
      JSON.parse(existingImageIds));
    await existingContent.save();
    // Process new uploaded files if any
    if (req.files) {
      if (req.files && Array.isArray(req.files.image)) {
        for (const file of req.files.image) {
          const mediaId = await fileHandler.saveFileAndCreateMedia(file);
          if (mediaId) {
            updatedImageIds.push(new Types.ObjectId(mediaId));
          }
        }
      } else {
        const mediaId = await fileHandler.saveFileAndCreateMedia(
          req.files.image,
        );
        if (mediaId) {
          updatedImageIds.push(new Types.ObjectId(mediaId));
        }
      }
    }

    // Filter out any removed images if `existingImageIds` is provided
    if (existingImageIds && Array.isArray(existingImageIds)) {
      updatedImageIds = updatedImageIds.filter((id) =>
        existingImageIds.includes(id.toString()),
      );
    }

    if (updatedImageIds.length > 20) {
      return res.status(400).json({ message: "Maximum of 20 images allowed" });
    }

    let oldImagesArray;
    if (Array.isArray(req.body["oldImages[]"])) {
      oldImagesArray = req.body["oldImages[]"];
    } else if (req.body["oldImages[]"]) {
      // Single item handling
      oldImagesArray = [req.body["oldImages[]"]];
    } else {
      oldImagesArray = [];
    }

    updatedImageIds.push(
      ...oldImagesArray.map((item) => {
        return new mongoose.Types.ObjectId(item);
      }),
    );
    // Update the document
    existingContent.images = updatedImageIds;
    const updatedContent = await LandingPageImagesModel.findOneAndUpdate(
      {},
      existingContent,
    );
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
