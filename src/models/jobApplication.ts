import { Schema, model, type Document } from "mongoose";

export interface Application {
  jobId: Schema.Types.ObjectId;
  deviceId?: string;
  applicantName: string;
  email: string;
  phone: string;
  aboutMe: string;
  coverLetter: string;
}

export interface ApplicationDocument extends Application, Document {
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<ApplicationDocument>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    aboutMe: { type: String, required: false },
    coverLetter: { type: String, required: true },
    deviceId: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

const applicationModel = model<ApplicationDocument>(
  "Application",
  applicationSchema,
);
export default applicationModel;
