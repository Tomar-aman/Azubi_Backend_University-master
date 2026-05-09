import { Schema, model, type Document } from "mongoose";

export interface Media {
  type: string;
  fileName: string;
  filepath: string;
}

export interface MediaDocument extends Media, Document {
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<MediaDocument>(
  {
    type: { type: String, required: true },
    fileName: { type: String, required: true },
    filepath: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const _MediaModel = model<MediaDocument>("Media", mediaSchema);

export default _MediaModel;
