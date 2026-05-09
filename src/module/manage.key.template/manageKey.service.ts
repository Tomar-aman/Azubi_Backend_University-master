import { manageKeyModel } from "../../models/index";
import { type ManageKeyDocument } from "../../models/manageKey";
import { type Schema } from "mongoose";

export class ManageKeyService {
  public async getAllKeysService() {
    const keys = await manageKeyModel.findOne();
    return keys;
  }

  public async editKeyService(updatedData: Schema<ManageKeyDocument>) {
    const updatedKey = await manageKeyModel.findOneAndUpdate({}, updatedData, {
      new: true,
      upsert: true,
    });
    return updatedKey;
  }
}
