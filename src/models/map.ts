import { Schema, model, type Document } from "mongoose";

export interface MapDetail {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
}

export interface MapDetailDocument extends MapDetail, Document {
  createdAt: Date;
  updatedAt: Date;
}

const mapDetailSchema = new Schema<MapDetailDocument>(
  {
    field1: { type: String, required: true },
    field2: { type: String, required: true },
    field3: { type: String, required: true },
    field4: { type: String, required: false },
    field5: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

const MapDetailModel = model<MapDetailDocument>("MapDetail", mapDetailSchema);

export default MapDetailModel;
