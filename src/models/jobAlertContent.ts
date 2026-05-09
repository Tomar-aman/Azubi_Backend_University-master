import mongoose, { Schema, model, type Document } from "mongoose";

export interface JobAlertContent {
  image?: mongoose.Schema.Types.ObjectId;
  heading: string;
  subheading: string;
}

export interface JobAlertContentDocument extends JobAlertContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const jobAlertContentSchema = new Schema<JobAlertContentDocument>(
  {
    image: { type: mongoose.Schema.Types.ObjectId, required: true },
    heading: { type: String, required: true },
    subheading: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const JobAlertContentModel = model<JobAlertContentDocument>(
  "JobAlertContent",
  jobAlertContentSchema,
);

export default JobAlertContentModel;
