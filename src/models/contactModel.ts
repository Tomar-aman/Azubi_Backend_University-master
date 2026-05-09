import { Schema, model, type Document } from "mongoose";

export interface ContactModel {
  inputKey: string;
  inputKey1: string;
  inputKey2: string;
  inputKey3: string;
  inputKey4: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

export interface ContactModelDocument extends ContactModel, Document {
  createdAt: Date;
  updatedAt: Date;
}

const contactModelSchema = new Schema<ContactModelDocument>(
  {
    inputKey: { type: String, required: true },
    inputKey1: { type: String, required: true },
    inputKey2: { type: String, required: true },
    inputKey3: { type: String, required: true },
    inputKey4: { type: String, required: true },
    field1: { type: String, required: true },
    field2: { type: String, required: true },
    field3: { type: String, required: true },
    field4: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
  },
);

const ContactModel = model<ContactModelDocument>("ContactModel", contactModelSchema);

export default ContactModel;
