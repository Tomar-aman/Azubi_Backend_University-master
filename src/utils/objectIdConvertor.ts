import mongoose from "mongoose";

class ObjectIdConverter {
  public convertToObjectId(strId: string): mongoose.Types.ObjectId {
    try {
      const objectId = new mongoose.Types.ObjectId(strId);
      return objectId;
    } catch (error) {
      return error;
    }
  }
}
export default ObjectIdConverter;
export const IdConverter = new ObjectIdConverter();
