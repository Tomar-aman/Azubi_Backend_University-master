import { Schema, model, type Document } from "mongoose";

export interface ManageCitiesContent {
  heading: string;
  subheading: string;
  bottomHeading: string;
  firstButtonText: string;
  secondButtonText: string;
}

export interface ManageCitiesContentDocument extends ManageCitiesContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const manageCitiesContentSchema = new Schema<ManageCitiesContentDocument>(
  {
    heading: { type: String, required: true },
    subheading: { type: String, required: true },
    bottomHeading: { type: String, required: true },
    firstButtonText: { type: String, required: true },
    secondButtonText: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const _ManageCitiesContentModel = model<ManageCitiesContentDocument>(
  "ManageCitiesContent",
  manageCitiesContentSchema,
);

export default _ManageCitiesContentModel;
