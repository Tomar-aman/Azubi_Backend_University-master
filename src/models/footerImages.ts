import { Schema, model, Document, Types } from "mongoose";

export interface ManageHomePage {
  images: Types.ObjectId[]; // Array of ObjectIds referencing the Media collection
}

export interface ManageHomePageDocument extends ManageHomePage, Document {
  createdAt: Date;
  updatedAt: Date;
}

const FooterImagesSchema = new Schema<ManageHomePageDocument>(
  {
    images: [
      { type: Schema.Types.ObjectId, ref: "Media", required: true }, // Array of ObjectId references
    ],
  },
  {
    timestamps: true,
  }
);

const FooterImagesModel = model<ManageHomePageDocument>(
  "FooterImages",
  FooterImagesSchema
);

export default FooterImagesModel;
