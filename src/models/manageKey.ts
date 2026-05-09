import { Schema, model, type Document } from "mongoose";

export interface ManageKey {
  hostKey: string;
  portKey: string;
  notificationKey: string;
}

export interface ManageKeyDocument extends ManageKey, Document {
  createdAt: Date;
  updatedAt: Date;
}

const manageKeySchema = new Schema<ManageKeyDocument>(
  {
    hostKey: { type: String, required: true },
    portKey: { type: String, required: true },
    notificationKey: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const _ManageKeyModel = model<ManageKeyDocument>("ManageKey", manageKeySchema);

export default _ManageKeyModel;
