import { Schema, model, type Document } from "mongoose";

export interface JobTypes {
  jobTypeName: string;
  isDeleted?: boolean;
}

export interface JobTypesDocument extends JobTypes, Document {
  createdAt: Date;
  updatedAt: Date;
}

const jobTypesSchema = new Schema<JobTypesDocument>(
  {
    jobTypeName: { type: String, required: true, unique: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const JobTypesModel = model<JobTypesDocument>("JobTypes", jobTypesSchema);

export default JobTypesModel;
