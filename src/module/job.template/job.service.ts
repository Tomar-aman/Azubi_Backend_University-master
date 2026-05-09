import ObjectIdConverter from "../../utils/objectIdConvertor";
import {
  applicationModel,
  beginningsModel,
  cityModel,
  companyImageModel,
  emailContentModel,
  employerModel,
  federalStateModel,
  industriesModel,
  jobDocumentModel,
  jobImagesModel,
  jobModel,
  jobTypesModel,
  mediaModel,
  regionModel,
  smtpSettingModel,
  trainingsModel,
  userModel,
} from "../../models/index";
import { type Job } from "../../models/jobs";
import { type Application } from "../../models/jobApplication";
import ejs from "ejs";
import path from "path";
import emailService from "../../utils/emailService";
import JobTypesModel from "../../models/jobType";
import { FileHandler } from "../../utils/fileHandler";
export class JobService {
  private readonly objectIdConverter: ObjectIdConverter;
  private readonly fileHandler: FileHandler;
  constructor() {
    this.fileHandler = new FileHandler();
    this.objectIdConverter = new ObjectIdConverter();
  }

  public async getAllJobsService(
    searchValue: string,
    pageNo: number,
    filter: string,
    recordPerPage: number,
    slectedCity: any,
    industry: any,
    isFrontend: string,
    jobType: string[],
    date: any,
    deviceId: string,
  ) {
    recordPerPage = recordPerPage ?? 10;
    recordPerPage = recordPerPage > 0 ? recordPerPage : 10;
    const filterQuery = {};
    let convertedJobType: any = [];
    let queryForJobType = {};
    let queryForDate = {};
    let queryForDeviceId: any = [];
    if (deviceId) {
      queryForDeviceId = [
        {
          $lookup: {
            from: applicationModel.collection.name,
            let: { jobIds: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$deviceId", deviceId],
                      },
                      {
                        $eq: ["$jobId", "$$jobIds"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "jobApplicationForDevice",
          },
        },
        {
          $unwind: {
            path: "$jobApplicationForDevice",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];
    }
    if (jobType) {
      convertedJobType = this.objectIdConverter.convertToObjectId(
        jobType as any,
      );
      queryForJobType = {
        $expr: {
          $eq: ["$jobTypeId", convertedJobType],
        },
      };
    }
    if (date) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      queryForDate = {
        $expr: {
          $gt: ["$createdAt", new Date(date)],
        },
      };
    }
    if (industry) {
      if (typeof industry === "string") {
        industry = [industry];
      }
      filterQuery["industryName"] = {
        $in: industry.map((item) => {
          return this.objectIdConverter.convertToObjectId(item);
        }),
      };
    }
    if (slectedCity) {
      if (typeof slectedCity === "string") {
        slectedCity = [slectedCity];
      }
      filterQuery["cityInfo._id"] = {
        $in: slectedCity.map((data: any) =>
          this.objectIdConverter.convertToObjectId(data),
        ),
      };
    }

    const pipeline: any = [
      {
        $match: { isDeleted: false },
      },
      {
        $match: {
          ...(isFrontend ? { status: true } : {}),
        },
      },
      ...queryForDeviceId,
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
        $match: {
          ...filterQuery,
        },
      },
      {
        $unwind: {
          path: "$cityInfo",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: JobTypesModel.collection.name,
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
          locationUrl: { $first: "$locationUrl" },
          locationField: { $first: "$locationField" },
          jobTitle: { $first: "$jobTitle" },
          embeddedCode: { $first: "$embeddedCode" },
          isDesktopView: { $first: "$isDesktopView" },
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
      convertedJobType && {
        $match: {
          ...queryForJobType,
        },
      },
      {
        $match: {
          ...queryForDate,
        },
      },
      deviceId && {
        $match: {
          $expr: { $eq: ["$deviceId", deviceId] },
        },
      },
      // End
      {
        $sort: {
          [!filter ? "createdAt" : "startDate"]: filter === "DSC" ? 1 : -1,
        },
      },
      searchValue && {
        $match: {
          $or: [
            { jobTitle: { $regex: new RegExp(searchValue, "i") } },
            { city: { $regex: new RegExp(searchValue, "i") } },
            { industryName: { $regex: new RegExp(searchValue, "i") } },
            { company: { $regex: new RegExp(searchValue, "i") } },
          ],
        },
      },
      {
        $skip: isFrontend ? 0 : (pageNo - 1) * recordPerPage || 0,
      },
      {
        $limit: isFrontend ? pageNo * recordPerPage : recordPerPage || 0,
      },
    ].filter(Boolean);

    try {
      const result = await jobModel.aggregate(pipeline).exec();
      return result;
    } catch (error) {
      console.log({ error });
      return error; // Rethrow the error to propagate it up the stack
    }
  }

  public async getCount() {
    const jobCount = await jobModel.find().count({
      isDeleted: false,
    });
    return jobCount;
  }

  public async getJobByIdService(id: string) {
    const jobId = this.objectIdConverter.convertToObjectId(id);
    const [job] = await jobModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: ["$_id", jobId],
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
              $addFields: {
                industryName: {
                  $cond: {
                    if: "$industryName",
                    then: "$industryName.industryName",
                    else: "",
                  },
                },
              },
            },
            {
              $lookup: {
                from: cityModel.collection.name,
                let: { cityId: "$city" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$cityId"],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                      address: 1,
                      zipCode: 1,
                      directionLink: 1,
                      startTime: 1,
                      endTime: 1,
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
              $addFields: {
                location: {
                  $cond: {
                    if: "$city",
                    then: "$city.name",
                    else: "",
                  },
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
                companyLogo: 1,
                videoLink: 1,
                industryName: 1,
                location: 1,
                companyDescription: 1,
                jobDescription: 1,
                phoneNo: 1,
                website: 1,
                email: 1,
                address: 1,
                mapUrl: 1,
                additionalData: 1,
                region: 1,
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
          from: beginningsModel.collection.name,
          let: { beginningId: "$beginning" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$beginningId"],
                },
              },
            },
            {
              $project: {
                name: 1,
                _id: 1,
              },
            },
          ],
          as: "beginning",
        },
      },
      {
        $unwind: {
          path: "$beginning",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: trainingsModel.collection.name,
          let: { trainingId: "$training" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$trainingId"],
                },
              },
            },
            {
              $project: {
                name: 1,
                _id: 1,
              },
            },
          ],
          as: "training",
        },
      },
      {
        $unwind: {
          path: "$training",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: federalStateModel.collection.name,
          let: { federalId: "$federalState" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$federalId"],
                },
              },
            },
            {
              $project: {
                name: 1,
                _id: 1,
              },
            },
          ],
          as: "federalState",
        },
      },
      {
        $unwind: {
          path: "$federalState",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: cityModel.collection.name,
          let: { cityId: "$city" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$cityId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                address: 1,
                zipCode: 1,
                directionLink: 1,
                startTime: 1,
                endTime: 1,
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
          from: jobDocumentModel.collection.name,
          let: { jobId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$job", "$$jobId"],
                },
              },
            },
            {
              $lookup: {
                from: mediaModel.collection.name,
                let: { documentId: "$document" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$documentId"] },
                    },
                  },
                  {
                    $project: {
                      createdAt: 0,
                      updatedAt: 0,
                      __v: 0,
                    },
                  },
                ],
                as: "document",
              },
            },
            {
              $unwind: {
                path: "$document",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                job: 0,
              },
            },
          ],
          as: "attachments",
        },
      },
      {
        $lookup: {
          from: companyImageModel.collection.name,
          let: { jobId: "$company._id" },
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
                  {
                    $project: {
                      createdAt: 0,
                      updatedAt: 0,
                      __v: 0,
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
          from: jobImagesModel.collection.name,
          let: { documentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$jobId", "$$documentId"],
                },
              },
            },
          ],
          as: "jobImage",
        },
      },
      {
        $unwind: {
          path: "$jobImage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: mediaModel.collection.name,
          let: { documentId: "$jobImage.imageId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$documentId"],
                },
              },
            },
          ],
          as: "Images",
        },
      },
      {
        $unwind: {
          path: "$Images",
          preserveNullAndEmptyArrays: true,
        },
      },
      // start
      {
        $lookup: {
          from: jobTypesModel.collection.name,
          let: { documentId: "$jobType" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$_id", "$$documentId"],
                    },
                    {
                      $eq: ["$isDeleted", false],
                    },
                  ],
                },
              },
            },
          ],
          as: "jobTypeDetail",
        },
      },
      {
        $unwind: {
          path: "$jobTypeDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      // End
      {
        $lookup: {
          from: regionModel.collection.name,
          let: { documentId: "$region" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$_id", "$$documentId"],
                    },
                  ],
                },
              },
            },
          ],
          as: "regionDetail",
        },
      },
      {
        $unwind: {
          path: "$regionDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          city: {
            $addToSet: "$city",
          },
          cityDetail: {
            $addToSet: "$city",
          },
          regionDetail: {
            $first: "$regionDetail",
          },
          jobImages: { $addToSet: "$Images" },
          industryName: { $first: "$industryName" },
          isDesktopView: { $first: "$isDesktopView" },
          beginning: { $first: "$beginning" },
          training: { $first: "$training" },
          federalState: { $first: "$federalState" },
          jobType: { $first: "$jobType" },
          company: { $first: "$company" },
          jobTitle: { $first: "$jobTitle" },
          embeddedCode: { $first: "$embeddedCode" },
          startDate: { $first: "$startDate" },
          email: { $first: "$email" },
          address: { $first: "$address" },
          mapUrl: { $first: "$mapUrl" },
          zipCode: { $first: "$zipCode" },
          jobDescription: { $first: "$jobDescription" },
          status: { $first: "$status" },
          isDeleted: { $first: "$isDeleted" },
          createdBy: { $first: "$createdBy" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          attachments: { $first: "$attachments" },
          companyImages: { $addToSet: "$companyImages" },
          additionalData: { $addToSet: "$additionalData" },
          videoLink: { $first: "$videoLink" },
          jobTypeName: { $first: "$jobTypeDetail.jobTypeName" },
          locationField: { $first: "$locationField" },
          locationUrl: { $first: "$locationUrl" },
        },
      },
    ]);
    const additionalData = await employerModel
      .findById(job.company._id)
      .populate([{ path: "additionalData.image" }])
      .lean();
    const jobAddtionalData = await jobModel
      .findById(id)
      .populate([{ path: "additionalData.image" }])
      .lean();
    //@ts-ignore
    job.company.additionalData = additionalData?.additionalData || [];
    //@ts-ignore
    job.additionalData = jobAddtionalData?.additionalData || [];
    return job;
  }

  public async updateJobByIdService(
    id: string,
    updatedData: Job | any,
    additionalData: any,
  ) {
    //delete all keys that not start with object
    for (let itm in additionalData) {
      if (!itm.startsWith("objects")) delete additionalData[itm];
    }
    //transform card data
    let transformedCardContainImage: any[] = [];
    let idx = 0;
    for (let _reqData in additionalData) {
      transformedCardContainImage.push({
        _id: additionalData[`objects[${idx}][_id]`],
        image: additionalData[`objects[${idx}][image]`] ?? null,
        text: additionalData[`objects[${idx}][text]`],
        oldImage: additionalData[`objects[${idx}][oldImage]`],
      });
      idx = idx + 1;
    }

    /*filter the actual object comes from frontend*/
    transformedCardContainImage = transformedCardContainImage.filter(
      (itm: any) => itm._id,
    );

    /* after filter now save the image in backend and attached mediaId with image property*/
    for (let card of transformedCardContainImage) {
      if (card.image) {
        const media = await this.fileHandler.saveFileAndCreateMedia(card.image);
        card.image = media?.toString();
      }
    }
    if (updatedData.federalState === "undefined") {
      updatedData.federalState = null;
    }
    if (updatedData.beginning === "undefined") {
      updatedData.beginning = null;
    }
    if (updatedData.training === "undefined") {
      updatedData.training = null;
    }
    const updatedJob = await jobModel.findByIdAndUpdate(
      id,
      { $set: { ...updatedData } },
      {
        new: true,
      },
    );

    /* now retrieve cards from db */
    //@ts-ignore
    const oldCards: any[] = updatedJob?.additionalData || [];
    /* push update frontend cards over old cards */
    /* first check transformedCardContainImage cards exists in Cards */
    let finalCardForDocument: any[] = [];
    for (let newCard of transformedCardContainImage) {
      /* this line find the newCard in oldCards */
      const oldCard = oldCards.find(
        (card) => card._id?.toString() === newCard._id.toString(),
      );
      if (newCard?.oldImage) {
        newCard.image = newCard.oldImage;
      }
      if (oldCard?.oldImage) {
        newCard.image = oldCard.oldImage;
      }
      if (oldCard) {
        /* if old card is exists then push it and replace image if contains in newCard*/
        finalCardForDocument.push({
          ...newCard,
          image: newCard?.image || oldCard?.image || null,
        });
      } else {
        finalCardForDocument.push({
          ...newCard,
        });
      }
    }

    /* remove all _id */
    finalCardForDocument = finalCardForDocument.map(
      ({ _id, ...restData }) => restData,
    );
    if (updatedData.oldtransformedCardContainImage) {
      finalCardForDocument = updatedData.oldtransformedCardContainImage;
    }
    const finalUpdate = await jobModel.findByIdAndUpdate(
      id,
      {
        additionalData: finalCardForDocument,
      },
      {
        new: true,
      },
    );

    return finalUpdate;
  }

  public async deleteJobByIdService(id: string) {
    const deletedJob = await jobModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true },
    );
    return deletedJob;
  }

  public async addJobService(jobData: Job, additionalData: any) {
    const desktopViewPayload: any = {};

    if (jobData.isDesktopView) {
      desktopViewPayload.training = jobData.training;
      desktopViewPayload.beginning = jobData.beginning;
      desktopViewPayload.federalState = jobData.federalState;
    }
    const { training, beginning, federalState, ...rest } = jobData;

    //delete all keys that not start with object
    for (let itm in additionalData) {
      if (!itm.startsWith("objects")) delete additionalData[itm];
    }

    //transform card data
    let transformedCardContainImage: any[] = [];
    let idx = 0;
    for (let _reqData in additionalData) {
      transformedCardContainImage.push({
        _id: additionalData[`objects[${idx}][_id]`],
        image: additionalData[`objects[${idx}][image]`] ?? null,
        text: additionalData[`objects[${idx}][text]`],
        oldImage: additionalData[`objects[${idx}][oldImage]`],
      });
      idx = idx + 1;
    }

    /*filter the actual object comes from frontend*/
    transformedCardContainImage = transformedCardContainImage.filter(
      (itm: any) => itm._id,
    );

    /* after filter now save the image in backend and attached mediaId with image property*/
    for (let card of transformedCardContainImage) {
      if (card.image) {
        const media = await this.fileHandler.saveFileAndCreateMedia(card.image);
        card.image = media?.toString();
      }
      if (card.oldImage) {
        card.image = card.oldImage.oldImage?.toString();
      }
    }

    /* remove all _id */
    transformedCardContainImage = transformedCardContainImage.map(
      ({ _id, ...restData }) => restData,
    );
    if (jobData.oldtransformedCardContainImage) {
      transformedCardContainImage = jobData.oldtransformedCardContainImage;
    }
    const newJob = await jobModel.create({
      ...rest,
      ...desktopViewPayload,
      additionalData: transformedCardContainImage,
      status: true,
    });
    return newJob;
  }

  public async getSuggestionService(searchValue: string) {
    try {
      const suggestion = await jobModel.aggregate([
        {
          $match: {
            isDeleted: false,
            status: true,
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
                $project: {
                  _id: 1,
                  companyName: 1,
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
            from: cityModel.collection.name,
            let: { cityId: "$city" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$cityId"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
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
            from: jobDocumentModel.collection.name,
            let: { jobid: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$job", "$$jobid"],
                  },
                },
              },
              {
                $project: {
                  job: 0,
                },
              },
            ],
            as: "attachments",
          },
        },
        {
          $match: {
            $or: [
              {
                "industryName.industryName": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              { "company.companyName": { $regex: searchValue, $options: "i" } },
              { jobTitle: { $regex: searchValue, $options: "i" } },
            ],
          },
        },
        // {
        //   $match: {
        //     $expr: {
        //       $or: [
        //         {
        //           $eq: [searchValue, null],
        //         },
        //         {
        //           $eq: [searchValue, ""],
        //         },
        //         {
        //           $regexMatch: {
        //             input: { $ifNull: ["$company.companyName", ""] },
        //             regex: searchValue,
        //           },
        //         },
        //         {
        //           $regexMatch: {
        //             input: { $ifNull: ["$jobTitle", ""] },
        //             regex: searchValue,
        //           },
        //         },
        //       ],
        //     },
        //   },
        // },
        {
          $project: {
            company: "$company.companyName",
            jobTitle: 1,
          },
        },
      ]);
      return suggestion;
    } catch (error) {
      return error;
    }
  }

  public async addApplicationService(payload: Application, attachments: any) {
    try {
      const jobDetail = await jobModel
        .findById(payload.jobId)
        .populate("company");

      let files: any = [];
      if (attachments) {
        if (Array.isArray(attachments)) {
          files = attachments.map((file: any) => ({
            filename: file.name,
            content: file.data,
          }));
        } else {
          files.push({
            filename: attachments.name,
            content: attachments.data,
          });
        }
      }
      const adminDetail = await userModel.findOne();
      /* get email content */
      const emailContent = await emailContentModel.findOne();
      const bccContent = await smtpSettingModel.find();
      const bcc: string[] = [
        "aniketshivhare92@gmail.com",
        // "karriere@azubiregional.de",
        `${bccContent[0]?.to}`,
      ];
      if (jobDetail) {
        // bcc.push(jobDetail.email);
      }
      if (adminDetail) {
        bcc.push(adminDetail.email);
      }
      const htmlContent = await ejs.renderFile(
        path.join(path.resolve(path.dirname("")), "views", "application.ejs"),
        {
          jobTitle: jobDetail?.jobTitle,
          payload,
          emailContent: emailContent?.application,
          isDesktopView: jobDetail?.isDesktopView || false,
          jobUrl: `${process.env.WEB_FRONTEND_URL}/jobs-board/${jobDetail?._id}`,
          //@ts-ignore
          companyName: jobDetail?.company.companyName,
        },
      );
      await applicationModel.create(payload);
      emailService.sendEmail({
        bcc,
        subject: `Bewerbung auf AzubiRegional.de`,
        html: htmlContent,
        attachments: files,
      });
    } catch (error) {
      throw new Error(error?.message || "");
    }
  }

  public async revertApplication(payload: any) {
    await applicationModel.deleteOne({
      deviceId: payload.deviceId,
      jobId: payload.jobId,
    });
  }

  public async getApplicationCount() {
    const count = await applicationModel.count();
    return count;
  }
}
