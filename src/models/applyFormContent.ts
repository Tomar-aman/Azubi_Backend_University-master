import { Schema, model, type Document } from "mongoose";

export interface ApplyFormContent {
  name: string;
  email: string;
  number: string;
  about_me: string;
  letter: string;
}

export interface ApplyFormContentDocument extends ApplyFormContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const applyFormContentSchema = new Schema<ApplyFormContentDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    number: { type: String, required: true },
    about_me: { type: String, required: true },
    letter: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const _ApplyFormContentModel = model<ApplyFormContentDocument>(
  "ApplyFormContent",
  applyFormContentSchema,
);

export default _ApplyFormContentModel;
