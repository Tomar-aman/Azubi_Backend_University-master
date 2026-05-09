import { Schema, model } from "mongoose";

export interface JobDocument {
  job: Schema.Types.ObjectId;
  document: Schema.Types.ObjectId;
}

const jobDocumentSchema = new Schema<JobDocument>({
  job: {
    type: Schema.Types.ObjectId,
    ref: "job",
    required: true,
  },

  document: {
    type: Schema.Types.ObjectId,
    ref: "Media",
    required: true,
  },
});

const _JobDocumentModel = model<JobDocument>("JobDocument", jobDocumentSchema);
export default _JobDocumentModel;
