import mongoose, { Schema, model } from "mongoose";
import _MediaModel from "./media";

const jobWallBannerSchema = new Schema({
  heading: { type: String, required: false, default: "" },
  subHeading: { type: String, required: false, default: "" },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    required: false,
  },
});

const jobWallContentSchema = new Schema({
  banner: { type: jobWallBannerSchema, required: false, default: null },
  contactPersonIcon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    required: false,
  },
  industryIcon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    required: false,
  },
  locationIcon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: _MediaModel,
    required: false,
  },
});

const _JobWallContentModel = model("jobWallContent", jobWallContentSchema);
export default _JobWallContentModel;
