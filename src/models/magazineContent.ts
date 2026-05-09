import mongoose, { Schema, model } from "mongoose";
import _MediaModel from "./media";

const magazineHeaderSchema = new Schema({
  buttonText: { type: String, required: false, default: "" },
  buttonUrl: { type: String, required: false, default: "" },
  buttonColor: { type: String, required: false, default: "" },
  sideText: { type: String, required: false, default: "" },
});

const jobMagazineCardSchema = new Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    default: null,
  },
  cardHeading: { type: String, required: false, default: "" },
  textFirst: { type: String, required: false, default: "" },
  textSecond: { type: String, required: false, default: "" },
  additionalText: { type: String, required: false, default: "" },
});

const jobMagazinePointSchema = new Schema({
  text: { type: String, required: false, default: "" },
});

const JobMagazineAboutServiceSchema = new Schema({
  headingFirst: { type: String, required: false, default: "" },
  textFirst: { type: String, required: false, default: "" },
  headingSecond: { type: String, required: false, default: "" },
  textSecond: { type: String, required: false, default: "" },
  buttonText: { type: String, required: false, default: "" },
  buttonUrl: { type: String, required: false, default: "" },
  buttonColor: { type: String, required: false, default: "" },
});

const jobMagazineSchema = new Schema({
  header: { type: magazineHeaderSchema, required: false, default: null },
  jobMagazineHeading: { type: String, required: false, default: "" },
  jobMagazineCards: { type: [jobMagazineCardSchema], default: [] },
  jobMagazinePointHeading: { type: String, required: false, default: "" },
  jobMagazinePointSideImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    required: false,
  },
  jobMagazinePointText: { type: String, required: false, default: "" },
  jobMagazinePoints: { type: [jobMagazinePointSchema], default: [] },
  aboutService: {
    type: JobMagazineAboutServiceSchema,
    required: false,
    default: null,
  },
});

const _JobMagazineContentModel = model("jobMagazineContent", jobMagazineSchema);
export default _JobMagazineContentModel;
