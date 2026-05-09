import mongoose, { Schema, model } from "mongoose";
import _MediaModel from "./media";

const contactUsAddressSchema = new Schema({
  placeFirstHeading: { type: String, required: false, default: "" },
  placeFirstText: { type: String, required: false, default: "" },
  telFirstHeading: { type: String, required: false, default: "" },
  telFirstTiming: { type: String, required: false, default: "" },
  telFirstNumber: { type: String, required: false, default: "" },
  placeSecondHeading: { type: String, required: false, default: "" },
  placeSecondText: { type: String, required: false, default: "" },
  telSecondHeading: { type: String, required: false, default: "" },
  telSecondTiming: { type: String, required: false, default: "" },
  telSecondNumber: { type: String, required: false, default: "" },
  EmailHeading: { type: String, required: false, default: "" },
  EmailAddress: { type: String, required: false, default: "" },
  instagramLink: { type: String, required: false, default: "" },
  youTubeLink: { type: String, required: false, default: "" },
});

const contactAboutUsSchema = new Schema({
  topHeading: { type: String, required: false, default: "" },
  text: { type: String, required: false, default: "" },
  sideImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    required: false,
  },
  belowHeading: { type: String, required: false, default: "" },
  buttonText: { type: String, required: false, default: "" },
  buttonUrl: { type: String, required: false, default: "" },
  buttonColor: { type: String, required: false, default: "" },
});

const counterSchema = new Schema({
  heading: { type: String, required: false, default: "" },
  count: { type: String, required: false, default: "" },
});

const contactCardWithPointSchema = new Schema({
  heading: { type: String, required: false, default: "" },
  point1: { type: String, required: false, default: "" },
  point2: { type: String, required: false, default: "" },
  point3: { type: String, required: false, default: "" },
  point4: { type: String, required: false, default: "" },
  text: { type: String, required: false, default: "" },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    required: false,
  },
});

const contactCardSecondSchema = new Schema({
  heading: { type: String, required: false, default: "" },
  text: { type: String, required: false, default: "" },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    required: false,
  },
  buttonText: { type: String, required: false, default: "" },
  buttonUrl: { type: String, required: false, default: "" },
  buttonColor: { type: String, required: false, default: "" },
});

const aboutTeamCardSchema = new Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: _MediaModel,
  },
  heading: { type: String, required: false, default: "" },
  subHeading: { type: String, required: false, default: "" },
  buttonText: { type: String, required: false, default: "" },
  buttonUrl: { type: String, required: false, default: "" },
  buttonColor: { type: String, required: false, default: "" },
});

const contactFormSchema = new Schema({
  heading: { type: String, required: false, default: "" },
  text: { type: String, required: false, default: "" },
  buttonText: { type: String, required: false, default: "" },
});

const contactUsContentSchema = new Schema({
  pageHeadingInGermany: { type: String, required: false, default: "" },
  contactForm: { type: contactFormSchema, default: null },
  address: { type: contactUsAddressSchema, required: false, default: null },
  aboutUs: { type: contactAboutUsSchema, required: false, default: null },
  counterHeading: { type: String, required: false, default: "" },
  counters: { type: [counterSchema], default: [] },
  contactCardFirstWithPoints: {
    type: contactCardWithPointSchema,
    default: null,
  },
  ContactCardSecond: {
    type: contactCardSecondSchema,
    required: false,
    default: null,
  },
  aboutTeamHeading: { type: String, required: false, default: "" },
  aboutTeamSubHeading: { type: String, required: false, default: "" },
  aboutTeamCard: { type: [aboutTeamCardSchema], default: [] },
});

const _ContactUsContentModel = model(
  "contactUsContent",
  contactUsContentSchema,
);
export default _ContactUsContentModel;
