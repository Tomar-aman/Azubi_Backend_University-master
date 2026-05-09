import mongoose from "mongoose";
import { Schema, model, type Document } from "mongoose";

export interface Company {
  companyId: mongoose.Schema.Types.ObjectId;
  imageId: mongoose.Schema.Types.ObjectId;
}

export interface CompanyDocument extends Company, Document {
  createdAt: Date;
  updatedAt: Date;
}

const companyImage = new Schema<CompanyDocument>(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    imageId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  },
);

const _companyImageModel = model<CompanyDocument>(
  "CompanyImages",
  companyImage,
);

export default _companyImageModel;
