import mongoose, { Schema, model, type Document } from "mongoose";
import _MediaModel from "./media";

export interface Employer {
  industryName: Schema.Types.ObjectId;
  contactPerson: string;
  jobTitle: string;
  companyName: string;
  email: string;
  website: string;
  mapUrl?: string;
  phoneNo: string;
  address: string;
  zipCode: string;
  companyLogo: mongoose.Schema.Types.ObjectId;
  companyDescription: string;
  videoLink: string[];
  city: mongoose.Schema.Types.ObjectId;
  status: boolean;
  isDeleted: boolean;
  createdBy: Schema.Types.ObjectId;
  locationUrl: string;
  oldTransformedCardContainImage: any;
}

export interface EmployerDocument extends Employer, Document {
  createdAt: Date;
  updatedAt: Date;
  companyImage?: any;
}

const additionalDataSchema = new Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  text: { type: String, default: "" },
});

const employerSchema = new Schema(
  {
    industryName: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Industries",
    },
    contactPerson: { type: String, required: false, default: "" },
    jobTitle: { type: String, required: false, default: "" },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    locationUrl: { type: String, required: false },
    website: { type: String, required: true },
    mapUrl: { type: String, required: false },
    phoneNo: { type: String, required: false },
    address: { type: String, required: true },
    zipCode: { type: String, required: false },
    companyLogo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Media",
    },
    companyDescription: { type: String, required: true },
    videoLink: { type: [{ type: String }], required: false },
    city: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "City" },
    status: { type: Boolean, default: true },
    additionalData: { type: [additionalDataSchema], default: [] },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  },
);

const _EmployerModel = model<EmployerDocument>("Employer", employerSchema);

export default _EmployerModel;
