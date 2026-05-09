import { regionModel } from "../../models/index";

export class TrainingService {
  public async getAllFederalStatesService() {
    const federalState = await regionModel.find({ isDeleted: false });
    return federalState;
  }

  public async getAllFederalStateByFilter(searchValue, pageNo, recordPerPage) {
    const query = regionModel.find({ isDeleted: false });

    // Add search functionality
    if (searchValue) {
      void query.or([
        {
          name: {
            $regex: new RegExp(searchValue, "i"),
          },
        },
      ]);
    }

    // Count total documents (for pagination)
    const docs = await regionModel
      .find({
        isDeleted: false,
      })
      .count();

    // Set up pagination
    const limit = parseInt(recordPerPage || "0");
    const skip = (pageNo - 1) * limit;

    // Apply pagination and execute the query
    const result = await query
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
    return {
      count: Math.ceil(docs / Number(recordPerPage || 10)),
      data: result,
    };
  }

  public async getFederalStateByIdService(id: string) {
    const FederalState = await regionModel.findById(id);
    return FederalState;
  }

  public async addFederalStateService(federalStateData: string) {
    const newFederalState = await regionModel.create({
      name: federalStateData,
    });
    return newFederalState;
  }

  public async updateFederalStateByIdService(id: string, name: string) {
    const updatedFederalState = await regionModel.findByIdAndUpdate(id, {
      $set: { name },
    });
    return updatedFederalState;
  }

  public async deleteFederalStateByIdService(id: string) {
    const deletedFederalState = await regionModel.findByIdAndUpdate(id, {
      $set: {
        isDeleted: true,
      },
    });
    return deletedFederalState;
  }
}
