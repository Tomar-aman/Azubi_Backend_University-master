
import { Schema, model, type Document, type Types } from "mongoose";

export interface ManageHomePage {
  headline: string;
  images: Types.ObjectId[]; // Array of ObjectIds referencing the Media collection
  heading: string;
  heading1?: string;
  text: string;
  backgroundImage: Types.ObjectId;
}

export interface ManageHomePageDocument extends ManageHomePage, Document {
  createdAt: Date;
  updatedAt: Date;
}

const manageHomePageSchema = new Schema<ManageHomePageDocument>(
  {
    headline: { type: String, required: true },
    images: [
      { type: Schema.Types.ObjectId, ref: "Media", required: true }, // Array of ObjectId references
    ],
    backgroundImage: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      required: false,
    },
    heading: { type: String, required: true },
    heading1: { type: String, required: false },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const ManageHomePageModel = model<ManageHomePageDocument>(
  "ManageHomePage",
  manageHomePageSchema,
);

export default ManageHomePageModel;
