import mongoose from "mongoose";
import { Schema, model, type Document } from "mongoose";
import _MediaModel from "./media";

export interface Job {
  city: Schema.Types.ObjectId;
  company: Schema.Types.ObjectId;
  training?: Schema.Types.ObjectId | null;
  federalState?: Schema.Types.ObjectId | null;
  beginning?: Schema.Types.ObjectId | null;
  jobTitle: string;
  embeddedCode: string;
  startDate: Date;
  email: string;
  additionalEmail?: string;
  address: string;
  mapUrl?: string;
  zipCode: string;
  jobDescription: string;
  status: boolean;
  createdBy: Schema.Types.ObjectId;
  isDeleted: boolean;
  industryName: Schema.Types.ObjectId;
  videoLink: string[];
  jobType: Schema.Types.ObjectId;
  region: Schema.Types.ObjectId;
  isDesktopView?: boolean;
  locationField: string;
  locationUrl: any;
  oldJobImage?: any;
  oldtransformedCardContainImage?: any;
}

export interface JobDocument extends Job, Document {
  createdAt: Date;
  updatedAt: Date;
}

const additionalDataSchema = new Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  text: { type: String, default: "" },
});

const jobSchema = new Schema(
  {
    jobType: { type: Schema.Types.ObjectId, required: false },
    videoLink: { type: [{ type: String }], required: false },
    city: [{ type: Schema.Types.ObjectId, ref: "City", required: true }],
    industryName: {
      type: Schema.Types.ObjectId,
      ref: "Industries",
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    jobTitle: { type: String, required: true },
    embeddedCode: { type: String, default: "" },
    startDate: { type: Date, required: false },
    email: { type: String, required: true },
    additionalEmail: { type: String },
    address: { type: String, required: true },
    mapUrl: { type: String, required: false },
    zipCode: { type: String, required: false },
    locationField: { type: String, required: true },
    locationUrl: { type: String, required: false },
    jobDescription: { type: String, required: true },
    isDesktopView: { type: Boolean, default: false },
    training: {
      type: Schema.Types.ObjectId,
      ref: "Trainings",
      required: false,
      default: null,
    },
    federalState: {
      type: Schema.Types.ObjectId,
      ref: "FederalStates",
      required: false,
      default: null,
    },
    beginning: {
      type: Schema.Types.ObjectId,
      ref: "Beginnings",
      required: false,
      default: null,
    },
    additionalData: { type: [additionalDataSchema], default: [] },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    region: { type: Schema.Types.ObjectId, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  },
);

const _JobModel = model<JobDocument>("Job", jobSchema);

export default _JobModel;
