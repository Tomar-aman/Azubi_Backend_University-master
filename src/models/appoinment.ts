import { Schema, model, type Document } from "mongoose";

export interface Appoinment {
  companyId: Schema.Types.ObjectId;
  applicantName: string;
  email: string;
  phone: string;
  aboutMe: string;
  coverLetter: string;
}

export interface AppoinmentDocument extends Appoinment, Document {
  createdAt: Date;
  updatedAt: Date;
}

const appoinmentSchema = new Schema<AppoinmentDocument>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Employer", required: true },
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    aboutMe: { type: String, required: false },
    coverLetter: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const appoinmentModel = model<AppoinmentDocument>(
  "Appoinment",
  appoinmentSchema,
);
export default appoinmentModel;
