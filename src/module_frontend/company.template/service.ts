import { IdConverter } from "../../utils/objectIdConvertor";
import {
  cityModel,
  companyImageModel,
  employerModel,
  industriesModel,
  jobModel,
  jobTypesModel,
  mediaModel,
} from "../../models";

export async function getCompanyService(Id: string) {
  const company = await employerModel.aggregate([
    {
      $match: {
        _id: IdConverter.convertToObjectId(Id),
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
    {
      $lookup: {
        from: cityModel.collection.name,
        let: { id: "$city" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$id"],
              },
            },
          },
        ],
        as: "city",
      },
    },
    {
      $unwind: {
        path: "$city",
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
        from: jobModel.collection.name,
        let: { companyId: "$_id", companyName: "$companyName" },
        pipeline: [
          //fetch jobs for this company
          {
            $match: {
              isDesktopView: true,
              isDeleted: false,
            },
          },
          {
            $match: {
              $expr: {
                $eq: ["$company", "$$companyId"],
              },
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
              from: industriesModel.collection.name,
              localField: "industryName",
              foreignField: "_id",
              as: "industryDetail",
            },
          },
          {
            $unwind: {
              path: "$industryDetail",
              preserveNullAndEmptyArrays: true,
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
            $unwind: {
              path: "$jobTypeDetail",
              preserveNullAndEmptyArrays: true,
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
                {
                  $lookup: {
                    from: cityModel.collection.name,
                    let: { id: "$city" },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ["$_id", "$$id"],
                          },
                        },
                      },
                    ],
                    as: "city",
                  },
                },
                {
                  $unwind: {
                    path: "$city",
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
            $project: {
              _id: 1,
              jobTitle: 1,
              companyName: 1,
              companyLogo: 1,
              jobCities: 1,
              jobTypeDetail: 1,
              industryDetail: 1,
            },
          },
        ],
        as: "jobs",
      },
    },
    {
      $addFields: {
        companyImages: {
          $cond: {
            if: "$companyImages",
            then: {
              $map: {
                input: "$companyImages",
                as: "item",
                in: "$$item.companyImages",
              },
            },
            else: "",
          },
        },
        companyIndustry: {
          $cond: {
            if: "$industryName",
            then: "$industryName.industryName",
            else: "",
          },
        },
      },
    },
    {
      $project: {
        companyName: 1,
        companyLogo: 1,
        companyImages: 1,
        videoLink: 1,
        jobs: 1,
        contactPerson: 1,
        companyIndustry: 1,
        companyDescription: 1,
        jobDescription: 1,
        website: 1,
        phoneNo: 1,
        address: 1,
      },
    },
  ]);
  return company;
}

export async function getCompaniesLogoService() {
  const logos = await employerModel.aggregate([
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
    {
      $project: {
        companyLogo: 1,
      },
    },
  ]);
  return logos;
}
