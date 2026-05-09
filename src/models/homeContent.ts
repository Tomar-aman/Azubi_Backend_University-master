import { Schema, model, type Document } from "mongoose";
export interface ManageHomeContent {
  bannerCustomColor: string;
  galleryCustomColor: string;
  blockCustomColor: string;
  companyCustomColor: string;
  tips_1: string;
  tips_2: string;
  tips_3: string;
  tips_url_1: string;
  tips_url_2: string;
  tips_url_3: string;
  mailChimpLogo: any;
}

export interface ManageHomeContentDocument extends ManageHomeContent, Document {
  createdAt: Date;
  updatedAt: Date;
}
const manageHomeContentSchema = new Schema<ManageHomeContentDocument>(
  {
    bannerCustomColor: { type: String, required: false },
    galleryCustomColor: { type: String, required: false },
    blockCustomColor: { type: String, required: false },
    companyCustomColor: { type: String, required: false },
    mailChimpLogo: { type: String, required: false },
    tips_1: { type: String, required: false },
    tips_2: { type: String, required: false },
    tips_3: { type: String, required: false },
    tips_url_1: { type: String, required: false },
    tips_url_2: { type: String, required: false },
    tips_url_3: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

const _ManageHomeContentModel = model<ManageHomeContentDocument>(
  "ManageHomeContent",
  manageHomeContentSchema,
);

export default _ManageHomeContentModel;
