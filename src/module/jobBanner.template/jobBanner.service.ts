import { type JobBannerDocument } from "../../models/jobBanner";
import {
  applicationModel,
  cityModel,
  employerModel,
  industriesModel,
  jobBannerModel,
  jobModel,
  jobTypesModel,
  mediaModel,
} from "../../models/index";
interface BannerQueryParams {
  recordPerPage: number;
  pageNo: number;
  search: string;
  industries?: string[];
  selectedCity?: string[];
  jobType?: string;
}
export class JobBannerService {
  public async getAllBanners({
    recordPerPage,
    pageNo,
    search,
  }: BannerQueryParams) {
    try {
      const skip = (pageNo - 1) * recordPerPage;
      const docs = await jobBannerModel
        .find({
          isDelete: false,
        })
        .count();
      const data = await jobBannerModel.aggregate([
        {
          $match: {
            isDelete: false,
          },
        },
        {
          $match: {
            bannerTitle: { $regex: search || "", $options: "i" }, // Ensure search is defined
          },
        },
        {
          $lookup: {
            from: employerModel.collection.name,
            let: {
              companyId: "$companyName",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$companyId"],
                  },
                },
              },
            ],
            as: "employers",
          },
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$employers",
          },
        },
        {
          $lookup: {
            from: cityModel.collection.name,
            let: {
              cityId: "$city",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$cityId"],
                  },
                },
              },
            ],
            as: "cityDetail",
          },
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$cityDetail",
          },
        },
        {
          $lookup: {
            from: jobModel.collection.name,
            let: {
              jobId: "$job",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$jobId"],
                  },
                },
              },
            ],
            as: "jobs",
          },
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$jobs",
          },
        },
        {
          $lookup: {
            from: mediaModel.collection.name,
            let: {
              images: "$images",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$images"],
                  },
                },
              },
            ],
            as: "images",
          },
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$images",
          },
        },
        {
          $lookup: {
            from: industriesModel.collection.name,
            let: {
              industryId: "$industry",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$industryId"],
                  },
                },
              },
            ],
            as: "industry",
          },
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$industry",
          },
        },
        {
          $group: {
            _id: "$_id",
            bannerTitle: { $first: "$bannerTitle" },
            embeddedCode: { $first: "$embeddedCode" },
            jobUrl: { $first: "$jobUrl" },
            createAt: { $first: "$createdAt" },
            images: {
              $addToSet: {
                _id: "$images._id",
                path: "$images.filepath",
                fileName: "$images.fileName",
              },
            },
            employers: {
              $first: {
                companyName: "$employers.companyName",
                _id: "$employers._id",
              },
            },
            city: {
              $first: {
                cityName: "$cityDetail.name",
                _id: "$cityDetail._id",
              },
            },
            jobs: {
              $first: {
                jobName: "$jobs.jobTitle",
                _id: "$jobs._id",
              },
            },
            industry: {
              $first: {
                jobName: "$industry.industryName",
                _id: "$industry._id",
              },
            },
          },
        },
        {
          $sort: {
            createAt: -1,
          },
        },
        { $skip: skip },
        { $limit: recordPerPage },
      ]);
      return { data, count: Math.ceil(docs / Number(recordPerPage || 10)) };
    } catch (error) {
      return error;
    }
  }

  public async createBannerService(payload: JobBannerDocument) {
    const newBanner = await jobBannerModel.create(payload);
    return newBanner;
  }

  public async updateBannerService(payload: JobBannerDocument) {
    const updatedBanner = await jobBannerModel.findOneAndUpdate(
      { _id: payload.id },
      payload,
      { new: true },
    );
    return updatedBanner;
  }

  public async deleteBanner(payload: JobBannerDocument) {
    const updatedBanner = await jobBannerModel.findByIdAndUpdate(payload.id, {
      isDelete: true,
    });
    return updatedBanner;
  }

  public async getAllBannersForApp({
    recordPerPage,
    pageNo,
    search,
    selectedCity,
    industries,
    jobType,
  }: BannerQueryParams) {
    let matchCriteriaForSelectedCity: any = [];
    let matchCriteriaForIndustries: any = [];
    let jobTypeFilter = {};
    try {
      // eslint-disable-next-line no-self-compare
      if (selectedCity?.length ?? 0 > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        matchCriteriaForSelectedCity = {
          $expr: {
            $in: ["$cityDetail._id", selectedCity],
          },
        };
      }
      // eslint-disable-next-line no-self-compare
      if (industries?.length ?? 0 > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        matchCriteriaForIndustries = {
          $expr: {
            $in: ["$industry._id", industries],
          },
        };
      }
      if (jobType) {
        jobTypeFilter = { "jobs.jobType": jobType };
      }

      const skip = (pageNo - 1) * recordPerPage;
      const data = await jobBannerModel.aggregate([
        {
          $match: {
            isDelete: false,
          },
        },
        {
          $match: {
            bannerTitle: { $regex: search || "", $options: "i" }, // Ensure search is defined
          },
        },
        {
          $lookup: {
            from: employerModel.collection.name,
            let: {
              companyId: "$companyName",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$companyId"],
                  },
                },
              },
            ],
            as: "employers",
          },
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$employers",
          },
        },
        {
          $lookup: {
            from: cityModel.collection.name,
            let: {
              cityId: "$city",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$cityId"],
                  },
                },
              },
            ],
            as: "cityDetail",
          },
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$cityDetail",
          },
        },
        {
          $lookup: {
            from: jobModel.collection.name,
            let: {
              jobId: "$job",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$jobId"],
                  },
                },
              },
            ],
            as: "jobs",
          },
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$jobs",
          },
        },
        {
          $lookup: {
            from: mediaModel.collection.name,
            let: {
              images: "$images",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$images"],
                  },
                },
              },
            ],
            as: "images",
          },
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$images",
          },
        },
        {
          $lookup: {
            from: industriesModel.collection.name,
            let: {
              industryId: "$industry",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$industryId"],
                  },
                },
              },
            ],
            as: "industry",
          },
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$industry",
          },
        },
        {
          $match: {
            ...matchCriteriaForSelectedCity,
          },
        },
        {
          $match: {
            ...matchCriteriaForIndustries,
          },
        },
        {
          $group: {
            _id: "$_id",
            bannerTitle: { $first: "$bannerTitle" },
            embeddedCode: { $first: "$embeddedCode" },
            jobUrl: { $first: "$jobUrl" },
            createAt: { $first: "$createdAt" },
            images: {
              $addToSet: {
                _id: "$images._id",
                path: "$images.filepath",
                fileName: "$images.fileName",
              },
            },
            employers: {
              $first: {
                companyName: "$employers.companyName",
                _id: "$employers._id",
              },
            },
            city: {
              $first: {
                cityName: "$cityDetail.name",
                _id: "$cityDetail._id",
              },
            },
            jobs: {
              $first: {
                jobName: "$jobs.jobTitle",
                jobType: "$jobs.jobType",
                _id: "$jobs._id",
              },
            },
            industry: {
              $first: {
                jobName: "$industry.industryName",
                _id: "$industry._id",
              },
            },
          },
        },
        {
          $match: {
            ...jobTypeFilter,
          },
        },
        {
          $sort: {
            createAt: -1,
          },
        },
        {
          $addFields: {
            jobs: {
              $cond: {
                if: "$jobs._id",
                then: "$jobs._id",
                else: "",
              },
            },
          },
        },
        {
          $lookup: {
            from: jobModel.collection.name,
            let: { jobId: "$jobs" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$jobId"],
                  },
                },
              },
              {
                $lookup: {
                  from: employerModel.collection.name,
                  let: { companyId: "$company" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$_id", "$$companyId"],
                        },
                      },
                    },
                    {
                      $lookup: {
                        from: mediaModel.collection.name,
                        let: { logoId: "$companyLogo" },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $eq: ["$_id", "$$logoId"],
                              },
                            },
                          },
                        ],
                        as: "companyLogo",
                      },
                    },
                    {
                      $unwind: {
                        path: "$companyLogo",
                        preserveNullAndEmptyArrays: true,
                      },
                    },
                    {
                      $project: {
                        _id: 1,
                        companyName: 1,
                        companyLogo: "$companyLogo.filepath",
                      },
                    },
                  ],
                  as: "company",
                },
              },
              {
                $unwind: {
                  path: "$company",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: cityModel.collection.name,
                  localField: "city",
                  foreignField: "_id",
                  as: "cityInfo",
                },
              },
              {
                $lookup: {
                  from: industriesModel.collection.name,
                  localField: "industryName",
                  foreignField: "_id",
                  as: "industryInfo",
                },
              },
              {
                $unwind: {
                  path: "$industryInfo",
                  preserveNullAndEmptyArrays: true,
                },
              },

              {
                $lookup: {
                  from: applicationModel.collection.name,
                  let: { jobIds: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$jobId", "$$jobIds"],
                        },
                      },
                    },

                    {
                      $count: "applicationCount",
                    },
                  ],
                  as: "count",
                },
              },
              {
                $unwind: {
                  path: "$count",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $unwind: {
                  path: "$cityInfo",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $addFields: {
                  count: { applicationCount: 0 },
                },
              },
              {
                $lookup: {
                  from: jobTypesModel.collection.name,
                  let: { jobTypeId: "$jobType" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$_id", "$$jobTypeId"],
                        },
                      },
                    },
                  ],
                  as: "jobTypeDoc",
                },
              },
              {
                $unwind: {
                  path: "$jobTypeDoc",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $group: {
                  _id: "$_id", // Group by the document's _id field or any other unique identifier
                  jobTypeId: { $first: "$jobType" },
                  jobTitle: { $first: "$jobTitle" },
                  createdAt: { $first: "$createdAt" },
                  city: { $addToSet: "$cityInfo.name" },
                  industryName: {
                    $first: "$industryInfo.industryName",
                  },
                  status: { $first: "$status" },
                  company: { $first: "$company.companyName" },
                  companyLogo: { $first: "$company.companyLogo" },
                  companyId: { $first: "$company._id" },
                  startDate: { $first: "$startDate" },
                  count: { $first: "$count" },
                  jobType: { $first: "$jobTypeDoc.jobTypeName" },
                  deviceId: {
                    $first: "$jobApplicationForDevice.deviceId",
                  },
                },
              },
            ],
            as: "jobs",
          },
        },
        {
          $unwind: {
            path: "$jobs",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $skip: skip },
        { $limit: recordPerPage },
      ]);
      return data;
    } catch (error) {
      return error;
    }
  }
}
