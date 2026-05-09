import { Schema, model, type Document } from "mongoose";

export interface ApplicationTip {
  title: string;
  description: string;
}

export interface ApplicationTipDocument extends ApplicationTip, Document {
  createdAt: Date;
  updatedAt: Date;
}

const applicationTipSchema = new Schema<ApplicationTipDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const ApplicationTipModel = model<ApplicationTipDocument>(
  "ApplicationTip",
  applicationTipSchema,
);

export default ApplicationTipModel;
