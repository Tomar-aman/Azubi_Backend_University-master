import mongoose, { Schema, model } from "mongoose";
import _MediaModel from "./media";

const youtubeSectionSchema = new Schema({
  heading: { type: String, default: "" },
  text: { type: String, default: "" },
  // videoLink: { type: String, default: "" },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  backgroundColor: { type: String, default: "" },
});

const cardSchema = new Schema({
  link: { type: String, default: "" },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
});

const searchBarContentSchema = new Schema({
  heading: { type: String, default: "" },
});

const topStateContentSchema = new Schema({
  heading: { type: String, default: "" },
});

const federalStateContentSchema = new Schema({
  heading: { type: String, default: "" },
});

const galleryContentSchema = new Schema({
  heading: { type: String, default: null },
  backgroundColor: { type: String, default: null },
});

const textContainerSchema = new Schema({
  text1: { type: String, default: "" },
  text2: { type: String, default: "" },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  logoGalleryColor: {
    type: String,
    required: false,
    default: null,
  },
});

const mailChimpSectionSchema = new Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  heading: { type: String, default: "" },
  text1: { type: String, default: "" },
  text2: { type: String, default: "" },
  buttonText: { type: String, default: "" },
});

const welcomeMessageForAppSchema = new Schema({
  heading: { type: String, default: "" },
  subHeading: { type: String, default: "" },
  text: { type: String, default: "" },
});

const homePageSchema = new Schema({
  youtubeSection: {
    type: youtubeSectionSchema,
    required: false,
    default: null,
  },
  cardHeading: { type: String, default: "" },
  cardText: { type: String, default: "" },
  CardBackgroundColor: { type: String, default: "" },
  cards: { type: [cardSchema], default: [] },
  searchBar: { type: searchBarContentSchema, required: false, default: null },
  topState: { type: topStateContentSchema, required: false, default: null },
  federalState: {
    type: federalStateContentSchema,
    required: false,
    default: null,
  },
  gallery: { type: galleryContentSchema, required: false, default: null },
  textContainer: { type: textContainerSchema, required: false, default: null },
  companyLogoHeading: { type: String, default: "" },
  mailChimpSection: {
    type: mailChimpSectionSchema,
    required: false,
    default: null,
  },
  headerLogoSideImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  logoSideImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  welcomeMessageForApp: {
    type: welcomeMessageForAppSchema,
    required: false,
    default: null,
  },
});

const _HomePageModel = model("homePageContent", homePageSchema);
export default _HomePageModel;
