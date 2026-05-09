import { Schema, model, type Document } from "mongoose";

export interface Region {
  name: string;
  isDeleted: boolean;
}

export interface RegionsDocument extends Region, Document {
  createdAt: Date;
  updatedAt: Date;
}

const RegionSchema = new Schema<RegionsDocument>(
  {
    name: { type: String, required: true, unique: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const _RegionsModel = model<RegionsDocument>("Regions", RegionSchema);

export default _RegionsModel;
