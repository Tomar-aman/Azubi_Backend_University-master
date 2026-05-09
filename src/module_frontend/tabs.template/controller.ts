import { Request, Response } from "express";
import { TabsModel } from "../../models/index";

// Create a new set of tabs
export const createTabs = async (req: Request, res: Response) => {
  try {
    const { tab1, tab2, tab3, tab4, tab5 } = req.body;
    const newTabs = new TabsModel({ tab1, tab2, tab3, tab4, tab5 });
    const savedTabs = await newTabs.save();
    res.status(201).json(savedTabs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sets of tabs
export const getTabs = async (_: Request, res: Response) => {
  try {
    const tabs = await TabsModel.find({ isDeleted: false });
    res.status(200).json(tabs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single set of tabs by ID
export const getTabById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tab = await TabsModel.findById(id);
    if (!tab || tab.isDeleted) {
      return res.status(404).json({ message: "Tab not found" });
    }
    res.status(200).json(tab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a set of tabs by ID
export const updateTabById = async (req: Request, res: Response) => {
  try {
    const updatedTabs = await TabsModel.findOneAndUpdate({}, req.body, { new: true });
    if (!updatedTabs || updatedTabs.isDeleted) {
      return res.status(404).json({ message: "Tab not found" });
    }
    res.status(200).json(updatedTabs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft delete a set of tabs by ID
export const deleteTabById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tab = await TabsModel.findById(id);
    if (!tab) {
      return res.status(404).json({ message: "Tab not found" });
    }
    tab.isDeleted = true;
    await tab.save();
    res.status(200).json({ message: "Tab deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
