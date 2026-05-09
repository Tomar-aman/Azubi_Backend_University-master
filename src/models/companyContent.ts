import { Schema, model, type Document } from "mongoose";

export interface CompanyContent {
  content: string;
  advertisement: string;
  owner: string;
  industry: string;
  companyInfo: string;
  website: string;
  contact: string;
  address: string;
  ownerImage: Schema.Types.ObjectId;
  industryImage: Schema.Types.ObjectId;
}

export interface CompanyContentDocument extends CompanyContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const companyContentSchema = new Schema<CompanyContentDocument>(
  {
    content: { type: String, required: true },
    advertisement: { type: String, required: true },
    owner: { type: String, required: true },
    industry: { type: String, required: true },
    companyInfo: { type: String, required: true },
    website: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    ownerImage: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      required: false,
    },
    industryImage: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const _CompanyContentModel = model<CompanyContentDocument>(
  "CompanyContent",
  companyContentSchema,
);

export default _CompanyContentModel;
