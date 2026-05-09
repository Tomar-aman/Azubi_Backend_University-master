import { applicationTip } from "../../models/index";
import { type ApplicationTipDocument } from "../../models/applicationTip";

export class ApplicationTipsService {
  public async getAllTips(): Promise<ApplicationTipDocument[]> {
    return await applicationTip.find();
  }

  public async getTipById(id: string): Promise<ApplicationTipDocument | null> {
    return await applicationTip.findById(id);
  }

  public async updateTip(
    id: string,
    title: string,
    description: string,
  ): Promise<ApplicationTipDocument | null> {
    return await applicationTip.findByIdAndUpdate(
      id,
      { title, description },
      { new: true },
    );
  }

  public async deleteTip(id: string) {
    return await applicationTip.findByIdAndDelete(id);
  }

  // New method for getting all tips by filter
  public async getAllTipsByFilter(
    searchValue: string,
    pageNo: number,
    recordPerPage: number,
  ): Promise<{ count: number; data: ApplicationTipDocument[] }> {
    const query = applicationTip.find();

    // Add search functionality
    if (searchValue) {
      void query.or([
        {
          title: {
            $regex: new RegExp(searchValue, "i"),
          },
        },
        {
          description: {
            $regex: new RegExp(searchValue, "i"),
          },
        },
      ]);
    }

    // Count total documents (for pagination)
    const totalDocs = await applicationTip.countDocuments();

    // Set up pagination
    const limit = recordPerPage;
    const skip = (pageNo - 1) * limit;

    // Apply pagination and execute the query
    const data = await query
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    return { count: Math.ceil(totalDocs / limit), data };
  }

  public async createTip(
    title: string,
    description: string,
  ): Promise<ApplicationTipDocument> {
    return await applicationTip.create({ title, description });
  }
}
