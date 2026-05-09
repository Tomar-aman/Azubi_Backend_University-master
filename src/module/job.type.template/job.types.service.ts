import { type JobTypes } from "src/models/jobType";
import { jobTypesModel } from "../../models/index";
import ObjectIdConverter from "../../utils/objectIdConvertor";
export class JobTypesService {
  private readonly objectIdConverter: ObjectIdConverter;
  constructor() {
    this.objectIdConverter = new ObjectIdConverter();
  }

  public async getAllJobTypesService() {
    const jobTypes = await jobTypesModel.find({ isDeleted: false });
    return jobTypes;
  }

  public async findByName(jobTypeName) {
    const jobTypes = await jobTypesModel.findOne({
      jobTypeName: { $regex: new RegExp(`^${jobTypeName}$`, "i") },
      isDeleted: false,
    });
    return jobTypes;
  }

  public async getAllJobTypesByFilter(searchValue, pageNo, recordPerPage) {
    const query = jobTypesModel.find({ isDeleted: false });

    // Add search functionality
    if (searchValue) {
      void query.or([
        {
          jobTypeName: {
            $regex: new RegExp(searchValue, "i"),
          },
        },
      ]);
    }

    // Count total documents (for pagination)
    const docs = await jobTypesModel
      .find({
        isDeleted: false,
      })
      .count();

    // Set up pagination
    const limit = parseInt(recordPerPage || "0");
    const skip = (pageNo - 1) * limit;

    // Apply pagination and execute the query
    const result = await query
      .sort({ jobTypeName: 1 })
      .limit(limit)
      .skip(skip)
      .exec();
    return {
      count: Math.ceil(docs / Number(recordPerPage || 10)),
      data: result,
    };
  }

  public async getJobTypeByIdService(id: string) {
    const objectId = this.objectIdConverter.convertToObjectId(id);
    const jobType = await jobTypesModel.findById(objectId);
    return jobType;
  }

  public async addJobTypeService(jobTypeData: JobTypes) {
    const newJobType = await jobTypesModel.create({
      jobTypeName: jobTypeData.jobTypeName,
    });
    return newJobType;
  }

  public async updateJobTypeByIdService(id: string, jobTypeName: JobTypes) {
    const objectId = this.objectIdConverter.convertToObjectId(id);
    const updatedJobType = await jobTypesModel.findByIdAndUpdate(objectId, {
      $set: { jobTypeName: jobTypeName.jobTypeName },
    });
    return updatedJobType;
  }

  public async deleteJobTypeByIdService(id: string) {
    const objectId = this.objectIdConverter.convertToObjectId(id);
    const deletedJobType = await jobTypesModel.findByIdAndUpdate(objectId, {
      $set: {
        isDeleted: true,
      },
    });
    return deletedJobType;
  }
}
