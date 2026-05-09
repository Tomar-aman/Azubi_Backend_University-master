import { industriesModel } from "../../models/index";

export class IndustriesService {
  public async getAllIndustriesService() {
    const industries = await industriesModel.find({ isDeleted: false });
    return industries;
  }

  public async getAllIndustriesByFilter(searchValue, pageNo, recordPerPage) {
    const query = industriesModel.find({ isDeleted: false });

    // Add search functionality
    if (searchValue) {
      void query.or([
        {
          industryName: {
            $regex: new RegExp(searchValue, "i"),
          },
        },
      ]);
    }

    // Count total documents (for pagination)
    const docs = await industriesModel
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

  public async getIndustryByIdService(id: string) {
    const industry = await industriesModel.findById(id);
    return industry;
  }

  public async addIndustryService(industryData: IndustriesService) {
    const newIndustry = await industriesModel.create({
      industryName: industryData,
    });
    return newIndustry;
  }

  public async updateIndustryByIdService(
    id: string,
    industryName: IndustriesService,
  ) {
    const updatedIndustry = await industriesModel.findByIdAndUpdate(id, {
      $set: { industryName },
    });
    return updatedIndustry;
  }

  public async deleteIndustryByIdService(id: string) {
    const deletedIndustry = await industriesModel.findByIdAndUpdate(id, {
      $set: {
        isDeleted: true,
      },
    });
    return deletedIndustry;
  }
}
