import { Request, Response } from "express";
import { ManageCitiesContentModel } from "../../models/index";

// Create new ManageCitiesContent
export const createManageCitiesContent = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      heading,
      subheading,
      bottomHeading,
      firstButtonText,
      secondButtonText,
    } = req.body;
    const newContent = new ManageCitiesContentModel({
      heading,
      subheading,
      bottomHeading,
      firstButtonText,
      secondButtonText,
    });
    const savedContent = await newContent.save();
    res.status(201).json(savedContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all ManageCitiesContent
export const getManageCitiesContent = async (_: Request, res: Response) => {
  try {
    const contentList = await ManageCitiesContentModel.findOne();
    res.status(200).json(contentList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single ManageCitiesContent by ID
export const getManageCitiesContentById = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const content = await ManageCitiesContentModel.findById(id);
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a ManageCitiesContent by ID
export const updateManageCitiesContentById = async (
  req: Request,
  res: Response,
) => {
  try {
    const updatedContent = await ManageCitiesContentModel.findOneAndUpdate(
      {},
      req.body,
      { new: true },
    );
    if (!updatedContent) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft delete a ManageCitiesContent by ID
export const deleteManageCitiesContentById = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const content = await ManageCitiesContentModel.findById(id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    await content.save();
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
