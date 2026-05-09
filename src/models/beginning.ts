import { Schema, model, type Document } from "mongoose";

export interface Beginnings {
  name: string;
  isDeleted: boolean;
}

export interface BeginningsDocument extends Beginnings, Document {
  createdAt: Date;
  updatedAt: Date;
}

const beginningsSchema = new Schema<BeginningsDocument>(
  {
    name: { type: String, required: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const _BeginningsModel = model<BeginningsDocument>(
  "Beginnings",
  beginningsSchema,
);

export default _BeginningsModel;
