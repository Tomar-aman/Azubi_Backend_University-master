import { Schema, model, type Document } from "mongoose";

export interface Industries {
  industryName: string;
  isDeleted: boolean;
}

export interface IndustriesDocument extends Industries, Document {
  createdAt: Date;
  updatedAt: Date;
}

const industriesSchema = new Schema<IndustriesDocument>(
  {
    industryName: { type: String, required: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const _IndustriesModel = model<IndustriesDocument>(
  "Industries",
  industriesSchema,
);

export default _IndustriesModel;
