import { type Request, type Response } from "express";
import { Types } from "mongoose";
import ManageHomePageModel from "../../../src/models/gallery";
import { FileHandler } from "../../utils/fileHandler";
const fileHandler = new FileHandler();
export const createManageHomePageContent = async (
  req: Request,
  res: Response,
) => {
  try {
    const { headline } = req.body;

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

    const newContent = new ManageHomePageModel({
      headline,
      images: mediaIds,
    });

    const savedContent = await newContent.save();
    res.status(201).json(savedContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all ManageHomePage entries
export const getManageHomePageContents = async (_: Request, res: Response) => {
  try {
    const contents = await ManageHomePageModel.findOne()
      .populate("images")
      .populate("backgroundImage"); // Populate to get full Media document
    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateManageHomePageContent = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      headline,
      existingImageIds,
      deletedImageIds,
      text,
      heading,
      heading1,
      oldImages,
      oldBackgroundImage,
    } = req.body;

    // Fetch the current document from the database
    const existingContent = await ManageHomePageModel.findOne();
    if (!existingContent) {
      return res.status(404).json({
        remote: "error",
        message: "Content not found",
      });
    }

    // Initialize updatedImageIds with existing images
    let updatedImageIds = [...existingContent.images];

    // Handle deleted images if any
    if (deletedImageIds) {
      const deletedIds = JSON.parse(deletedImageIds);
      if (Array.isArray(deletedIds) && deletedIds.length > 0) {
        // Remove deleted images from updatedImageIds
        updatedImageIds = updatedImageIds.filter(
          (id) => !deletedIds.includes(id.toString()),
        );

        // Optional: Delete files from storage
        for (const deletedId of deletedIds) {
          try {
            // await fileHandler.deleteFile(deletedId);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Failed to delete file with ID ${deletedId}:`, error);
          }
        }
      }
    }

    // Handle new uploaded files
    const newUploadedFiles: Types.ObjectId[] = [];
    if (req.files) {
      if (Array.isArray(req.files.image)) {
        for (const file of req.files.image) {
          const mediaId = await fileHandler.saveFileAndCreateMedia(file);
          if (mediaId) {
            newUploadedFiles.push(new Types.ObjectId(mediaId));
          }
        }
      } else if (req.files.image) {
        const mediaId = await fileHandler.saveFileAndCreateMedia(
          req.files.image,
        );
        if (mediaId) {
          newUploadedFiles.push(new Types.ObjectId(mediaId));
        }
      }
    }

    // Handle background image
    if (req.files?.backgroundImage) {
      const mediaId = await fileHandler.saveFileAndCreateMedia(
        req.files.backgroundImage,
      );
      if (mediaId) {
        // // If there's an existing background image, delete it
        // if (existingContent.backgroundImage) {
        //   try {
        //     await fileHandler.deleteFile(existingContent.backgroundImage.toString());
        //   } catch (error) {
        //     console.error('Failed to delete old background image:', error);
        //   }
        // }
        existingContent.backgroundImage = new Types.ObjectId(mediaId);
      }
    } else if (oldBackgroundImage) {
      existingContent.backgroundImage = new Types.ObjectId(oldBackgroundImage);
    }

    // Handle existing images
    if (existingImageIds) {
      const parsedExistingIds = JSON.parse(existingImageIds);
      if (Array.isArray(parsedExistingIds)) {
        updatedImageIds = parsedExistingIds.map((id) => new Types.ObjectId(id));
      }
    }

    // Handle old images (from gallery)
    if (oldImages) {
      let oldImagesArray: string[] = [];
      try {
        oldImagesArray = JSON.parse(oldImages);
        if (!Array.isArray(oldImagesArray)) {
          oldImagesArray = [oldImages];
        }
      } catch (error) {
        oldImagesArray = [oldImages];
      }

      const oldImagesObjectIds = oldImagesArray.map(
        (id) => new Types.ObjectId(id),
      );
      updatedImageIds = [...updatedImageIds, ...oldImagesObjectIds];
    }

    // Add newly uploaded files
    updatedImageIds = [...updatedImageIds, ...newUploadedFiles];

    // Remove duplicates from updatedImageIds
    updatedImageIds = Array.from(
      new Set(updatedImageIds.map((id) => id.toString())),
    ).map((id) => new Types.ObjectId(id));

    // Check maximum images limit
    if (updatedImageIds.length > 20) {
      return res.status(400).json({
        remote: "error",
        message: "Maximum of 20 images allowed",
      });
    }

    // Update the document
    const updateData = {
      headline: headline || existingContent.headline,
      images: updatedImageIds,
      heading: heading || existingContent.heading,
      heading1: heading1 || existingContent.heading1,
      text: text || existingContent.text,
      backgroundImage: existingContent.backgroundImage,
    };

    const updatedContent = await ManageHomePageModel.findOneAndUpdate(
      {},
      updateData,
      { new: true }, // Return the updated document
    );

    return res.status(200).json({
      remote: "success",
      data: updatedContent,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Update homepage content error:", error);
    return res.status(500).json({
      remote: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
