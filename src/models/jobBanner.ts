import { Schema, model, type Types, type Document } from "mongoose";

// Define schema for JobBanner referencing Job, City, and Company
export interface JobBannerDocument extends Document {
  isDelete: boolean;
  job?: Types.ObjectId;
  city: Types.ObjectId;
  companyName: Types.ObjectId;
  bannerTitle: string;
  jobUrl: string;
  images: Types.ObjectId[]; // Array of ObjectIds for media
  industry: Types.ObjectId;
  typesOfJobs: Types.ObjectId;
  embeddedCode: string;
}

const jobBannerSchema = new Schema<JobBannerDocument>({
  isDelete: { type: Boolean, required: true, default: false },
  job: { type: Schema.Types.ObjectId },
  city: { type: Schema.Types.ObjectId, required: true },
  companyName: { type: Schema.Types.ObjectId, required: false },
  bannerTitle: { type: String, default: "" },
  jobUrl: { type: String, default: "" },
  industry: { type: Schema.Types.ObjectId, default: "" },
  images: [{ type: Schema.Types.ObjectId }],
  typesOfJobs: { type: Schema.Types.ObjectId, required: true },
  embeddedCode: {
    type: String,
    default: "",
  },
});

const JobBannerModel = model<JobBannerDocument>("JobBanner", jobBannerSchema);

export default JobBannerModel;
