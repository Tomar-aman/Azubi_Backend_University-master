import { Schema, model, type Document } from "mongoose";

export interface FederalStates {
  name: string;
  isDeleted: boolean;
}

export interface FederalStatesDocument extends FederalStates, Document {
  createdAt: Date;
  updatedAt: Date;
}

const federalStateSchema = new Schema<FederalStatesDocument>(
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

const _FederalStatesModel = model<FederalStatesDocument>(
  "FederalStates",
  federalStateSchema,
);

export default _FederalStatesModel;
