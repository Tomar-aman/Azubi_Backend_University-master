import { Schema, model, type Document } from "mongoose";

export interface Contact {
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
}

export interface ContactDocument extends Contact, Document {
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<ContactDocument>(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const ContactModel = model<ContactDocument>("Contact", contactSchema);

export default ContactModel;
