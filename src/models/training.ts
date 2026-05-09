import { Schema, model, type Document } from "mongoose";

export interface Trainings {
  name: string;
  isDeleted: boolean;
}

export interface TrainingsDocument extends Trainings, Document {
  createdAt: Date;
  updatedAt: Date;
}

const trainingSchema = new Schema<TrainingsDocument>(
  {
    name: { type: String, required: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const _TrainingsModel = model<TrainingsDocument>("Trainings", trainingSchema);

export default _TrainingsModel;
