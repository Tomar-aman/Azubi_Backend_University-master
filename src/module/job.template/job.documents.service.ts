import { Schema } from "mongoose";
import { jobDocumentModel } from "../../models/index";

type jobDocument = {
  document: Schema.Types.ObjectId;
  job: Schema.Types.ObjectId;
};
export class JobDocumentService {
  public async addDocuments(
    documentIds: Schema.Types.ObjectId[],
    jobId: Schema.Types.ObjectId,
  ) {
    let documents: jobDocument[] = [];
    documentIds.forEach((id) => documents.push({ document: id, job: jobId }));
    await jobDocumentModel.insertMany(documents);
  }

  public async deleteDocuments(documentIds:string[]){
    await jobDocumentModel.deleteMany({_id:{$in:documentIds}})
  }
}
