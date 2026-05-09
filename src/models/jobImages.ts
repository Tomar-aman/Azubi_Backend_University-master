import mongoose from "mongoose";
import { Schema, model, type Document } from "mongoose";

export interface JobImage {
  jobId: mongoose.Schema.Types.ObjectId;
  imageId: mongoose.Schema.Types.ObjectId;
}

export interface JobImageDocument extends JobImage, Document {
  createdAt: Date;
  updatedAt: Date;
}

const jobImages = new Schema<JobImageDocument>(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, required: true },
    imageId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  },
);

const _jobImagesModel = model<JobImageDocument>("jobImages", jobImages);

export default _jobImagesModel;
