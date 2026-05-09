import { Request, Response } from "express";
import { mapDetailModel } from "../../models/index";

class MapDetailController {
  // Method to create or update a single MapDetail record
  public async createOrUpdate(req: Request, res: Response): Promise<void> {
    try {
      const { field1, field2, field3, field4, field5 } = req.body;

      // Check if a MapDetail record exists
      const existingRecord = await mapDetailModel.findOne();

      if (existingRecord) {
        // Update existing record
        existingRecord.field1 = field1;
        existingRecord.field2 = field2;
        existingRecord.field3 = field3;
        existingRecord.field4 = field4;
        existingRecord.field5 = field5;
        await existingRecord.save();
        res.status(200).json({ message: "MapDetail updated successfully", data: existingRecord });
      } else {
        // Create a new record
        const newMapDetail = new mapDetailModel({ field1, field2, field3, field4, field5 });
        await newMapDetail.save();
        res.status(201).json({ message: "MapDetail created successfully", data: newMapDetail });
      }
    } catch (error) {
      res.status(500).json({ message: "Error creating/updating MapDetail", error: error.message });
    }
  }

  // Method to get the existing MapDetail record (read operation)
  public async get(_: Request, res: Response): Promise<void> {
    try {
      const mapDetail = await mapDetailModel.findOne();
      if (mapDetail) {
        res.status(200).json({ data: mapDetail });
      } else {
        res.status(404).json({ message: "No MapDetail found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching MapDetail", error: error.message });
    }
  }
}

export default new MapDetailController();
