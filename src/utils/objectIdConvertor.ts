import mongoose from "mongoose";

class ObjectIdConverter {
  public convertToObjectId(strId: any): mongoose.Types.ObjectId | null {
    try {
      if (!strId || !mongoose.Types.ObjectId.isValid(strId)) {
        return null;
      }
      return new mongoose.Types.ObjectId(strId);
    } catch (error) {
      return null;
    }
  }
}
export default ObjectIdConverter;
export const IdConverter = new ObjectIdConverter();
