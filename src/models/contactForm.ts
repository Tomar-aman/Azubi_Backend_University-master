import { Schema, model, type Document } from "mongoose";

// Updated interface based on new fields
export interface ContactDetail {
  heading: string;
  subHeading: string;
  text: string;
  firstInputText: string;
  secondInputText: string;
  thirdInputText: string;
  fourthInputText: string;
  bottomHeading: string;
  firstCheckboxText: string;
  secondCheckboxText: string;
  thirdCheckboxText: string;
  fourthCheckboxText: string;
  submitButtonText: string;
  content: string;
}

export interface ContactDocument extends ContactDetail, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Updated schema
const contactDetailSchema = new Schema<ContactDocument>(
  {
    heading: { type: String, required: true },
    subHeading: { type: String, required: true },
    text: { type: String, required: true },
    firstInputText: { type: String, required: true },
    secondInputText: { type: String, required: true },
    thirdInputText: { type: String, required: true },
    fourthInputText: { type: String, required: true },
    bottomHeading: { type: String, required: true },
    firstCheckboxText: { type: String, required: true },
    secondCheckboxText: { type: String, required: true },
    thirdCheckboxText: { type: String, required: true },
    fourthCheckboxText: { type: String, required: true },
    submitButtonText: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  },
);

const ContactFormModel = model<ContactDocument>(
  "ContactModelDetail",
  contactDetailSchema,
);

export default ContactFormModel;
