import { IdConverter } from "../../utils/objectIdConvertor";
import {
  cityModel,
  companyImageModel,
  employerModel,
  industriesModel,
  jobBannerModel,
  jobModel,
  jobTypesModel,
  mediaModel,
} from "../../models";
import mongoose from "mongoose";

export async function getAllJobService(filters) {
  let search = filters?.search || "";
  const itemPerPage = 10;
  const page = filters.currentPage || 1;
  let filterQuery: any[] = [{}];
  //convert single field into an array
  for (const key in filters) {
    if (Object.hasOwnProperty.call(filters, key)) {
      if (!Array.isArray(filters[key])) {
        filters[key] = [filters[key]];
      }
    }
  }
  if (filters?.selectedTrainings) {
    filterQuery.push({
      training: {
        $in: filters.selectedTrainings.map(
          (i: string) => new mongoose.Types.ObjectId(i),
        ),
      },
    });
  }
  if (filters?.selectedBeginnings) {
    filterQuery.push({
      beginning: {
        $in: filters.selectedBeginnings.map(
          (i: string) => new mongoose.Types.ObjectId(i),
        ),
      },
    });
  }
  if (filters?.selectedFederals) {
    filterQuery.push({
      federalState: {
        $in: filters.selectedFederals.map(
          (i: string) => new mongoose.Types.ObjectId(i),
        ),
      },
    });
  }
  if (filters?.selectedIndustry) {
    filterQuery.push({
      industryName: {
        $in: filters.selectedIndustry.map(
          (i: string) => new mongoose.Types.ObjectId(i),
        ),
      },
    });
  }
  if (filters?.selectedJobTypes) {
    filterQuery.push({
      jobType: {
        $in: filters.selectedJobTypes.map(
          (i: string) => new mongoose.Types.ObjectId(i),
        ),
      },
    });
  }

  if (filters?.selectedCities) {
    filterQuery.push({
      city: {
        $in: filters.selectedCities.map(
          (i: string) => new mongoose.Types.ObjectId(i),
        ),
      },
    });
  }
  console.log("filters.regionfilters.region", filters.region);
  if (filters?.region) {
    filterQuery.push({
      region: {
        $in: filters.region.map((i: string) => new mongoose.Types.ObjectId(i)),
      },
    });
  }
  const jobs = await jobModel.aggregate([
    {
      $match: {
        isDesktopView: true,
        isDeleted: false,
        status: true,
        $and: [...filterQuery],
      },
    },
    {
      $lookup: {
        from: industriesModel.collection.name,
        localField: "industryName",
        foreignField: "_id",
        as: "industryDetail",
      },
    },
    {
      $lookup: {
        from: jobTypesModel.collection.name,
        localField: "jobType",
        foreignField: "_id",
        as: "jobTypeDetail",
      },
    },
    {
      $lookup: {
        from: cityModel.collection.name,
        localField: "city",
        foreignField: "_id",
        as: "jobCities",
      },
    },
    {
      $lookup: {
        from: employerModel.collection.name,
        let: { id: "$company" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$id"],
              },
            },
          },
          {
            $lookup: {
              from: mediaModel.collection.name,
              let: { id: "$companyLogo" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$id"],
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
      $match: {
        "company.status": true,
      },
    },
    {
      $addFields: {
        companyName: {
          $cond: {
            if: "$company",
            then: "$company.companyName",
            else: "",
          },
        },
        companyLogo: {
          $cond: {
            if: "$company",
            then: "$company.companyLogo",
            else: "",
          },
        },
        jobCities: {
          $cond: {
            if: "$jobCities",
            then: {
              $map: {
                input: "$jobCities",
                as: "item",
                in: "$$item.name",
              },
            },
            else: "",
          },
        },
      },
    },
    {
      $match: {
        $or: [
          { companyName: { $regex: search, $options: "i" } },
          { jobTitle: { $regex: search, $options: "i" } },
          // { jobDescription: { $regex: search, $options: "i" } },
        ],
      },
    },
    {
      $unwind: {
        path: "$industryDetail",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$jobTypeDetail",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        jobTitle: 1,
        // jobDescription: 1,
        companyName: 1,
        companyLogo: 1,
        jobCities: 1,
        industryDetail: 1,
        jobTypeDetail: 1,
      },
    },
    {
      $skip: (page - 1) * itemPerPage,
    },
    {
      $limit: itemPerPage,
    },
  ]);

  //count documents with filters or without filters
  const count = await jobModel.aggregate([
    {
      $match: {
        isDesktopView: true,
        isDeleted: false,
        $and: [...filterQuery],
      },
    },
    {
      $lookup: {
        from: employerModel.collection.name,
        let: { id: "$company" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$id"],
              },
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
      $addFields: {
        companyName: {
          $cond: {
            if: "$company",
            then: "$company.companyName",
            else: "",
          },
        },
      },
    },
    {
      $match: {
        $or: [
          { companyName: { $regex: search, $options: "i" } },
          { jobTitle: { $regex: search, $options: "i" } },
          // { jobDescription: { $regex: search, $options: "i" } },
        ],
      },
    },
  ]);
  const totalPages = Math.ceil(count.length / itemPerPage);
  return { jobs, totalPages, count: count.length };
}

export async function getJobService(Id: string) {
  const job = await jobModel.aggregate([
    {
      $match: {
        isDesktopView: true,
        isDeleted: false,
        _id: IdConverter.convertToObjectId(Id),
      },
    },
    {
      $lookup: {
        from: cityModel.collection.name,
        localField: "city",
        foreignField: "_id",
        as: "jobCities",
      },
    },
    {
      $lookup: {
        from: employerModel.collection.name,
        let: { id: "$company" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$id"],
              },
            },
          },
          {
            $lookup: {
              from: industriesModel.collection.name,
              let: { industryId: "$industryName" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$industryId"],
                    },
                  },
                },
                {
                  $project: {
                    industryName: 1,
                    _id: 1,
                  },
                },
              ],
              as: "industryName",
            },
          },
          {
            $unwind: {
              path: "$industryName",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: companyImageModel.collection.name,
              let: { jobId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$companyId", "$$jobId"],
                    },
                  },
                },
                {
                  $lookup: {
                    from: mediaModel.collection.name,
                    let: { documentId: "$imageId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$_id", "$$documentId"] },
                        },
                      },
                    ],
                    as: "companyImages",
                  },
                },
                {
                  $unwind: {
                    path: "$companyImages",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    companyImages: 1,
                  },
                },
              ],
              as: "companyImages",
            },
          },
          {
            $lookup: {
              from: mediaModel.collection.name,
              let: { id: "$companyLogo" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$id"],
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
      $addFields: {
        companyName: {
          $cond: {
            if: "$company",
            then: "$company.companyName",
            else: "",
          },
        },
        embeddedCode: {
          $cond: {
            if: "$embeddedCode",
            then: "$embeddedCode",
            else: "",
          },
        },
        companyImages: {
          $cond: {
            if: "$company",
            then: {
              $map: {
                input: "$company.companyImages",
                as: "item",
                in: "$$item.companyImages",
              },
            },
            else: "",
          },
        },
        companyIndustry: {
          $cond: {
            if: "$company",
            then: "$company.industryName.industryName",
            else: "",
          },
        },
        companyDescription: {
          $cond: {
            if: "$company",
            then: "$company.companyDescription",
            else: "",
          },
        },
        companyLogo: {
          $cond: {
            if: "$company",
            then: "$company.companyLogo",
            else: "",
          },
        },
        jobCities: {
          $cond: {
            if: "$jobCities",
            then: {
              $map: {
                input: "$jobCities",
                as: "item",
                in: "$$item.name",
              },
            },
            else: "",
          },
        },
        companyId: {
          $cond: {
            if: "$company",
            then: "$company._id",
            else: "",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        jobTitle: 1,
        jobDescription: 1,
        companyName: 1,
        companyLogo: 1,
        jobCities: 1,
        companyIndustry: 1,
        companyDescription: 1,
        companyImages: 1,
        startDate: 1,
        companyId: 1,
        embeddedCode: 1,
        videoLink: 1,
      },
    },
  ]);
  return job;
}

export async function getJobBannersService(filters) {
  let filterQuery: any[] = [{}];
  //convert single field into an array
  for (const key in filters) {
    if (Object.hasOwnProperty.call(filters, key)) {
      if (!Array.isArray(filters[key])) {
        filters[key] = [filters[key]];
      }
    }
  }
  if (filters?.jobTypes) {
    filterQuery.push({
      $or: [
        {
          job_type: {
            $in: filters.jobTypes.map(
              (i: string) => new mongoose.Types.ObjectId(i),
            ),
          },
        },
        {
          typesOfJobs: {
            $in: filters.jobTypes.map(
              (i: string) => new mongoose.Types.ObjectId(i),
            ),
          },
        },
      ],
    });
  }
  if (filters?.industry) {
    filterQuery.push({
      $or: [
        {
          job_industry: {
            $in: filters.industry.map(
              (i: string) => new mongoose.Types.ObjectId(i),
            ),
          },
        },
        {
          industry: {
            $in: filters.industry.map(
              (i: string) => new mongoose.Types.ObjectId(i),
            ),
          },
        },
      ],
    });
  }
  if (filters?.cities) {
    filterQuery.push({
      city: {
        $in: filters.cities.map((i: string) => new mongoose.Types.ObjectId(i)),
      },
    });
  }
  const jobBanners = await jobBannerModel.aggregate([
    {
      $match: {
        isDelete: false,
      },
    },
    {
      $lookup: {
        from: jobModel.collection.name,
        let: { job: "$job" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$job", "$_id"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              jobTitle: 1,
              // jobDescription: 1,
              isDesktopView: 1,
              industryName: 1,
              jobType: 1,
            },
          },
        ],
        as: "job_info",
      },
    },
    {
      $unwind: {
        path: "$job_info",
        preserveNullAndEmptyArrays: true,
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
        path: "$images",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        job_info: {
          $cond: {
            if: "$job_info",
            then: "$job_info",
            else: null,
          },
        },
        job_industry: {
          $cond: {
            if: "$job_info",
            then: "$job_info.industryName",
            else: "",
          },
        },
        // job_type: {
        //   $cond: {
        //     if: "$job_info",
        //     then: "$job_info.jobType",
        //     else: "",
        //   },
        // },
        job_city: {
          $cond: {
            if: "$job_info",
            then: "$job_info.city",
            else: "",
          },
        },
        isDesktopView: {
          $cond: {
            if: "$job_info",
            then: "$job_info.isDesktopView",
            else: false,
          },
        },
      },
    },
    {
      $match: {
        // isDesktopView: true,
        // $or: [{ isDesktopView: true }, { jobUrl: { $ne: "" } }],
        $and: [...filterQuery],
      },
    },
    {
      $project: {
        _id: 1,
        bannerTitle: 1,
        jobUrl: 1,
        images: 1,
        job_info: 1,
        isDesktopView: 1,
        job_type: 1,
        job_industry: 1,
      },
    },
  ]);
  return jobBanners;
}
