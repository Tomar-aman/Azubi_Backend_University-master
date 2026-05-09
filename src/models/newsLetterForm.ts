import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the fields
interface INewsletterForm extends Document {
  title: string;
  subtitle: string;
  placeholderText: string;
  buttonText: string;
  privacyNote: string;
  backgroundColor: string;
  leftImage: string; // Assuming this is a URL or can be an ObjectId
}

// Define the schema
const NewsletterFormSchema: Schema = new Schema({
  title: { type: String, required: true }, // "Schlau wie ein Fuchs!"
  subtitle: { type: String, required: true }, // "Sei up2date & abonniere den Fachzubi Newsletter!"
  placeholderText: { type: String, required: true }, // "Deine E-Mail"
  buttonText: { type: String, required: true }, // "Ja, ich bin dabei!"
  privacyNote: { type: String, required: true }, // The small text about privacy
  backgroundColor: { type: String, required: true }, // Hex, RGB, or named color
  leftImage: { type: mongoose.Types.ObjectId, required: true }, // URL or ObjectId for image reference
});

// Create the model
const NewsletterFormModel = mongoose.model<INewsletterForm>(
  "NewsletterForm",
  NewsletterFormSchema,
);

export default NewsletterFormModel;
