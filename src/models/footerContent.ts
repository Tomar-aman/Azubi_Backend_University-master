import mongoose, { Schema, Document } from "mongoose";

// Define an interface for the footer document
interface IFooter extends Document {
  section1Title: string;
  section1Address: string;
  section1Phone: string;
  section1Email: string;
  section1WorkingHours: string;

  section2Title: string;
  section2Address: string;
  section2Phone: string;
  section2Email: string;
  section2WorkingHours: string;

  section3Title: string;
  section3Links: string[];

  backgroundColor: string;
  textColor: string;
  linkColor: string;
  borderColor: string;

  heading1: string;
  heading2: string;
  heading3: string;
}

// Define a schema for the footer
const footerSchema: Schema = new Schema({
  section1Title: { type: String, required: true },
  section1Address: { type: String, required: true },
  section1Phone: { type: String, required: true },
  section1Email: { type: String, required: true },
  section1WorkingHours: { type: String, required: true },

  section2Title: { type: String, required: true },
  section2Address: { type: String, required: true },
  section2Phone: { type: String, required: true },
  section2Email: { type: String, required: true },
  section2WorkingHours: { type: String, required: true },

  section3Title: { type: String, required: true },
  section3Links: [{ type: String, required: true }], // Array of links for section 3

  backgroundColor: { type: String, required: true },
  textColor: { type: String, required: true },
  linkColor: { type: String, required: true },
  borderColor: { type: String, required: true },

  heading1: { type: String, required: false },
  heading2: { type: String, required: false },
  heading3: { type: String, required: false },
});

// Create a model from the schema
const Footer = mongoose.model<IFooter>("Footer", footerSchema);

export default Footer;
