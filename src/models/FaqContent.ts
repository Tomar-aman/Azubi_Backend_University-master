import mongoose, { Schema, model } from "mongoose";
import _MediaModel from "./media";

// Define CardContent schema
const cardContentSchema = new Schema({
  title: { type: String, required: false },
  link: { type: String, required: false },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    required: false,
  },
});

// Define Accordion schema
const accordionSchema = new Schema({
  heading: { type: String, required: false },
  content: { type: String, required: false },
});

// Define IconSection schema
const iconSectionSchema = new Schema({
  heading: { type: String, required: false },
  subHeading: { type: String, required: false },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    required: false,
  },
});

// Define Header schema
const headerSchema = new Schema({
  heading: { type: String, required: false },
  title: { type: String, required: false },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    required: false,
  },
});

// Define the main schema
const faqContentSchema = new Schema({
  header: { type: headerSchema, required: false, default: null },
  cards: { type: [cardContentSchema], default: [] },
  iconSection: { type: iconSectionSchema, required: false, default: null },
  accordionTitle: { type: String, required: false, default: "" },
  accordion: { type: [accordionSchema], default: [] },
});

const _FaqContentModel = model("FaqContent", faqContentSchema);

export default _FaqContentModel;
