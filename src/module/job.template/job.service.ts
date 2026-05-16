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
import { type Application } from "../../models/jobApplication";
import ejs from "ejs";
import path from "path";
import emailService from "../../utils/emailService";
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
    _slectedCity: any,
    _industry: any,
    isFrontend: string,
    _jobType: string[],
    _date: any,
    _deviceId: string,
    creatorIdFilter: string[] | null = null,
  ) {
    recordPerPage = recordPerPage ? Number(recordPerPage) : 10;
    pageNo = pageNo ? Number(pageNo) : 1;

    const matchStage: any = { isDeleted: false };
    if (creatorIdFilter) {
      matchStage.createdBy = { $in: creatorIdFilter.map(id => this.objectIdConverter.convertToObjectId(id)) };
    }

    if (isFrontend === "true") {
      matchStage.status = true;
    }

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: employerModel.collection.name,
          localField: "company",
          foreignField: "_id",
          as: "companyInfo",
        },
      },
      { $unwind: { path: "$companyInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: mediaModel.collection.name,
          localField: "companyInfo.companyLogo",
          foreignField: "_id",
          as: "logoInfo",
        },
      },
      { $unwind: { path: "$logoInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: industriesModel.collection.name,
          localField: "industryName",
          foreignField: "_id",
          as: "industryInfo",
        },
      },
      { $unwind: { path: "$industryInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: cityModel.collection.name,
          localField: "city",
          foreignField: "_id",
          as: "cityDetails",
        },
      },
      {
        $lookup: {
          from: jobTypesModel.collection.name,
          localField: "jobType",
          foreignField: "_id",
          as: "jobTypeInfo",
        },
      },
      { $unwind: { path: "$jobTypeInfo", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          companyName: "$companyInfo.companyName",
          companyLogo: "$logoInfo.filepath",
          industryName: "$industryInfo.industryName",
          jobTypeName: "$jobTypeInfo.jobTypeName",
          cityNames: "$cityDetails.name",
          company: {
            name: "$companyInfo.companyName",
            logo: "$logoInfo.filepath",
            id: "$companyInfo._id",
            address: "$companyInfo.address",
            industry: "$industryInfo.industryName",
          },
        },
      },
    ];

    if (searchValue) {
      pipeline.push({
        $match: {
          $or: [
            { jobTitle: { $regex: searchValue, $options: "i" } },
            { companyName: { $regex: searchValue, $options: "i" } },
            { industryName: { $regex: searchValue, $options: "i" } },
            { cityNames: { $regex: searchValue, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push({
      $sort: {
        [filter === "startDate" ? "startDate" : "createdAt"]: filter === "DSC" ? 1 : -1,
      },
    });

    pipeline.push({
      $skip: isFrontend === "true" ? 0 : (pageNo - 1) * recordPerPage || 0,
    });

    pipeline.push({
      $limit: isFrontend === "true" ? pageNo * recordPerPage : recordPerPage || 0,
    });

    try {
      const result = await jobModel.aggregate(pipeline).allowDiskUse(true).exec();
      
      // Map to old structure for compatibility
      const formattedData = result.map(job => ({
        ...job,
        city: job.cityNames || [], // Maintain array for frontend loop
        jobType: job.jobTypeName,
      }));

      return formattedData;
    } catch (error) {
      console.log("Aggregation error:", error);
      throw error;
    }
  }

  public async getCount(creatorIdFilter: string[] | null = null) {
    const matchQuery: any = { isDeleted: false };
    if (creatorIdFilter) {
      matchQuery.createdBy = { $in: creatorIdFilter.map(id => this.objectIdConverter.convertToObjectId(id)) };
    }
    const jobCount = await jobModel.countDocuments(matchQuery);
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
                address: 1,
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
          from: jobTypesModel.collection.name,
          let: { typeId: "$jobType" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$typeId"] },
              },
            },
            {
              $project: {
                name: "$jobTypeName",
                jobTypeName: 1,
                _id: 1,
              },
            },
          ],
          as: "jobType",
        },
      },
      {
        $unwind: {
          path: "$jobType",
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
                beginningName: "$name",
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
                trainingName: "$name",
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
                federalStateName: "$name",
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
          localField: "city",
          foreignField: "_id",
          as: "cityDetail",
        },
      },
      {
        $lookup: {
          from: regionModel.collection.name,
          localField: "region",
          foreignField: "_id",
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
                as: "jobImages",
              },
            },
            {
              $unwind: {
                path: "$jobImages",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                jobImages: 1,
              },
            },
          ],
          as: "jobImages",
        },
      },
      {
        $project: {
          _id: 1,
          jobType: 1,
          videoLink: 1,
          city: 1,
          cityDetail: 1,
          industryName: 1,
          company: 1,
          jobTitle: 1,
          embeddedCode: 1,
          startDate: 1,
          email: 1,
          additionalEmail: 1,
          address: 1,
          mapUrl: 1,
          zipCode: 1,
          locationField: 1,
          locationUrl: 1,
          jobDescription: 1,
          isDesktopView: 1,
          training: 1,
          federalState: 1,
          beginning: 1,
          additionalData: 1,
          status: 1,
          isDeleted: 1,
          region: 1,
          regionDetail: 1,
          createdBy: 1,
          createdAt: 1,
          updatedAt: 1,
          attachments: 1,
          companyImages: 1,
          jobImages: 1,
        },
      },
    ]);
    return job;
  }

  public async updateJobByIdService(id: string, updatedData: any, additionalData: any) {
    for (const itm in additionalData) {
      if (!itm.startsWith("objects")) {
        delete additionalData[itm];
      }
    }
    let transformedCardContainImage: any[] = [];
    let idx = 0;
    for (const _reqData in additionalData) {
      transformedCardContainImage.push({
        _id: additionalData[`objects[${idx}][_id]`],
        image: additionalData[`objects[${idx}][image]`] ?? null,
        text: additionalData[`objects[${idx}][text]`],
        oldImage: additionalData[`objects[${idx}][oldImage]`],
      });
      idx = idx + 1;
    }
    transformedCardContainImage = transformedCardContainImage.filter((itm) => itm._id);
    for (const card of transformedCardContainImage) {
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

    const updatedJob = await jobModel.findByIdAndUpdate(id, { $set: { ...updatedData } }, {
      new: true,
    });

    const oldCards = updatedJob?.additionalData || [];
    let finalCardForDocument: any[] = [];
    for (const newCard of transformedCardContainImage) {
      const oldCard = oldCards.find((card) => card._id?.toString() === newCard._id.toString());
      if (newCard?.oldImage) {
        newCard.image = newCard.oldImage;
      }
      if (oldCard?.oldImage) {
        newCard.image = oldCard.oldImage;
      }
      if (oldCard) {
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
    finalCardForDocument = finalCardForDocument.map(({ _id, ...restData }) => restData);
    if (updatedData.oldtransformedCardContainImage) {
      finalCardForDocument = updatedData.oldtransformedCardContainImage;
    }
    const finalUpdate = await jobModel.findByIdAndUpdate(id, {
      additionalData: finalCardForDocument,
    }, {
      new: true,
    });
    return finalUpdate;
  }

  public async deleteJobByIdService(id: string) {
    const deletedJob = await jobModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
    return deletedJob;
  }

  public async addJobService(jobData: any, additionalData: any) {
    const desktopViewPayload: any = {};
    if (jobData.isDesktopView) {
      desktopViewPayload.training = jobData.training;
      desktopViewPayload.beginning = jobData.beginning;
      desktopViewPayload.federalState = jobData.federalState;
    }
    const { training, beginning, federalState, ...rest } = jobData;
    for (const itm in additionalData) {
      if (!itm.startsWith("objects")) {
        delete additionalData[itm];
      }
    }
    let transformedCardContainImage: any[] = [];
    let idx = 0;
    for (const _reqData in additionalData) {
      transformedCardContainImage.push({
        _id: additionalData[`objects[${idx}][_id]`],
        image: additionalData[`objects[${idx}][image]`] ?? null,
        text: additionalData[`objects[${idx}][text]`],
        oldImage: additionalData[`objects[${idx}][oldImage]`],
      });
      idx = idx + 1;
    }
    transformedCardContainImage = transformedCardContainImage.filter((itm) => itm._id);
    for (const card of transformedCardContainImage) {
      if (card.image) {
        const media = await this.fileHandler.saveFileAndCreateMedia(card.image);
        card.image = media?.toString();
      }
      if (card.oldImage) {
        card.image = card.oldImage.oldImage?.toString();
      }
    }
    transformedCardContainImage = transformedCardContainImage.map(({ _id, ...restData }) => restData);
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
      let files: any[] = [];
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
      const emailContent = await emailContentModel.findOne();
      const bccContent = await smtpSettingModel.find();
      const bcc = [
        "aniketshivhare92@gmail.com",
        `${bccContent[0]?.to}`,
      ];
      if (jobDetail) {
      }
      if (adminDetail) {
        bcc.push(adminDetail.email);
      }
      const htmlContent = await ejs.renderFile(path.join(path.resolve(path.dirname("")), "views", "application.ejs"), {
        jobTitle: jobDetail?.jobTitle,
        payload,
        emailContent: emailContent?.application,
        isDesktopView: jobDetail?.isDesktopView || false,
        jobUrl: `${process.env.WEB_FRONTEND_URL}/jobs-board/${jobDetail?._id}`,
        companyName: (jobDetail?.company as any)?.companyName,
      });
      await applicationModel.create(payload);
      emailService.sendEmail({
        bcc,
        subject: `Bewerbung auf AzubiRegional.de`,
        html: htmlContent,
        attachments: files,
      });
    } catch (error: any) {
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
    const count = await applicationModel.countDocuments();
    return count;
  }
}
