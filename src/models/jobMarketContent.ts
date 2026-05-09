import { Schema, model, type Document } from "mongoose";

export interface JobMarketContent {
  heading: string;
  description: string;
  sidebarText: string;
  sidebarColor: string;
  subHeading: string;
  bottomBarColor: string;
  linkText: string;
  linkUrl: string;
}

export interface JobMarketContentDocument extends JobMarketContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const jobMarketContentSchema = new Schema<JobMarketContentDocument>(
  {
    heading: { type: String, required: true },
    description: { type: String, required: true },
    sidebarText: { type: String, required: true },
    sidebarColor: { type: String, required: true },
    subHeading: { type: String, required: true },
    bottomBarColor: { type: String, required: true },
    linkText: { type: String, required: false },
    linkUrl: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

const _JobMarketContentModel = model<JobMarketContentDocument>(
  "JobMarketContent",
  jobMarketContentSchema,
);

export default _JobMarketContentModel;
