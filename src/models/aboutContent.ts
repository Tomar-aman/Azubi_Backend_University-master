import mongoose, { Schema, model } from "mongoose";
import _MediaModel from "./media";

const BannerSchema = new Schema({
  text: { type: String, required: false, default: "" },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
});

const AboutTextBlockSchema = new Schema({
  topHeading: { type: String, required: false, default: "" },
  sideHeading: { type: String, required: false, default: "" },
  text: { type: String, required: false },
});

const featuresSchema = new Schema({
  text: { type: String, required: false, default: "" },
});

const ourCustomerSchema = new Schema({
  url: { type: String, required: false, default: "" },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
});

const marketingCards = new Schema({
  heading: { type: String, required: false, default: "" },
  text: { type: String, required: false, default: "" },
});

const sliderSchema = new Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
});

const exhibitorSchema = new Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
});

const careerFairCardSchema = new Schema({
  heading: { type: String, required: false, default: "" },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  text: { type: String, required: false, default: "" },
});

const contactCardSchema = new Schema({
  heading: { type: String, required: false, default: "" },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  text: { type: String, required: false, default: "" },
});

const calenderSchema = new Schema({
  sideImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  headingFirst: { type: String, required: false, default: "" },
  textFirst: { type: String, required: false, default: "" },
  headingTwo: { type: String, required: false, default: "" },
  textTwo: { type: String, required: false, default: "" },
  headingThird: { type: String, required: false, default: "" },
  textThird: { type: String, required: false, default: "" },
  headingForth: { type: String, required: false, default: "" },
  textFourth: { type: String, required: false, default: "" },
  calendlyUrl: { type: String, required: false, default: "" },
});

const mediaCardSchema = new Schema({
  headingFirst: { type: String, required: false, default: "" },
  headingSecond: { type: String, required: false, default: "" },
  buttonHeading: { type: String, required: false, default: "" },
  url: { type: String, required: false, default: "" },
});

const cardOfferSchema = new Schema({
  heading: { type: String, required: false, default: "" },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  text: { type: String, required: false, default: "" },
  url: { type: String, required: false, default: "" },
});

const twoCardSchema = new Schema({
  heading: { type: String, required: false, default: "" },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  text: { type: String, required: false, default: "" },
  buttonUrl: { type: String, required: false, default: "" },
  buttonText: { type: String, required: false, default: "" },
  buttonColor: { type: String, required: false, default: "" },
});

const aboutSchema = new Schema({
  banner: { type: BannerSchema, required: false, default: null },
  textBlock: { type: AboutTextBlockSchema, required: false, default: null },
  aboutFeaturesHeadingFirst: { type: String, required: false, default: "" },
  aboutFeaturesHeadingSecond: { type: String, required: false, default: "" },
  aboutFeaturesImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    required: false,
  },
  features: { type: [featuresSchema], default: [] },
  ourCustomers: { type: [ourCustomerSchema], default: [] },
  marketingFirstHeading: { type: String, required: false, default: "" },
  marketingSecondHeading: { type: String, required: false, default: "" },
  marketingCards: { type: [marketingCards], default: [] },
  slider: { type: [sliderSchema], default: [] },
  careerFairFirstHeading: { type: String, required: false, default: "" },
  careerFairSecondHeading: { type: String, required: false, default: "" },
  careerFairCards: { type: [careerFairCardSchema], default: [] },
  exhibitors: { type: [exhibitorSchema], default: [] },
  youTubeHeadingFirst: { type: String, required: false, default: "" },
  youTubeHeadingSecond: { type: String, required: false, default: "" },
  youTubeLinkFirst: { type: String, required: false, default: "" },
  youTubeLinkSecond: { type: String, required: false, default: "" },
  contactHeadingFirst: { type: String, required: false, default: "" },
  contactHeadingSecond: { type: String, required: false, default: "" },
  contactCard: { type: [contactCardSchema], default: [] },
  calender: { type: calenderSchema, default: null },
  mediaDataHeading: { type: String, required: false, default: "" },
  mediaCards: { type: [mediaCardSchema], default: [] },
  OfferCards: { type: [cardOfferSchema], default: [] },
  twoCards: { type: [twoCardSchema], default: [] },
});

const _AboutContentModel = model("aboutContent", aboutSchema);
export default _AboutContentModel;
