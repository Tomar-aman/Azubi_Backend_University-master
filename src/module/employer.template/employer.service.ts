import ObjectIdConverter from "../../utils/objectIdConvertor";
import {
  appoinmentModel,
  cityModel,
  companyImageModel,
  emailContentModel,
  employerModel,
  industriesModel,
  jobModel,
  jobTypesModel,
  mediaModel,
  userModel,
} from "../../models";
import { type Employer } from "src/models/employer";
import { type EmployerBodyPaylaodFrontend } from "./employer.types";
import { type Appoinment } from "src/models/appoinment";
import ejs from "ejs";
import path from "path";
import emailService from "../../utils/emailService";
import { FileHandler } from "../../utils/fileHandler";
export class EmployerService {
  private readonly objectIdConverter: ObjectIdConverter;
  private readonly fileHandler: FileHandler;
  constructor() {
    this.fileHandler = new FileHandler();
    this.objectIdConverter = new ObjectIdConverter();
  }

  public async getAllEmployersService(
    searchValue,
    pageNo,
    filter,
    recordPerPage,
    creatorIdFilter = null,
  ) {
    const pipeline: any[] = [];

    const matchStage: any = { isDeleted: false };
    if (creatorIdFilter) {
      matchStage.createdBy = this.objectIdConverter.convertToObjectId(creatorIdFilter);
    }

    // Match stage
    pipeline.push({
      $match: matchStage,
    });

    // Populate industryName and city
    pipeline.push({
      $lookup: {
        from: industriesModel.collection.name, // Assuming the collection name is "industryModel"
        localField: "industryName",
        foreignField: "_id",
        as: "industryName",
      },
    });

    pipeline.push({
      $lookup: {
        from: cityModel.collection.name, // Assuming the collection name is "cityModel"
        localField: "city",
        foreignField: "_id",
        as: "city",
      },
    });

    // Unwind industryName and city arrays
    pipeline.push({
      $unwind: {
        path: "$industryName",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $unwind: {
        path: "$city",
        preserveNullAndEmptyArrays: true,
      },
    });

    // Project stage to select fields and exclude industryName and city
    pipeline.push({
      $project: {
        _id: 1,
        email: 1,
        companyName: 1,
        contactPerson: 1,
        createdAt: 1,
        industryName: "$industryName.industryName",
        status: 1,
        city: "$city.name",
      },
    });

    // Sorting stage
    if (filter) {
      const newFilter = filter === "Date" ? "createdAt" : filter;
      pipeline.push({
        $sort: {
          [newFilter]: 1,
        },
      });
    } else {
      pipeline.push({
        $sort: {
          createdAt: -1,
        },
      });
    }

    // Search stage
    if (searchValue) {
      pipeline.push({
        $match: {
          $or: [
            { email: { $regex: new RegExp(searchValue, "i") } },
            { companyName: { $regex: new RegExp(searchValue, "i") } },
            { contactPerson: { $regex: new RegExp(searchValue, "i") } },
            { industryName: { $regex: new RegExp(searchValue, "i") } },
            { city: { $regex: new RegExp(searchValue, "i") } },
          ],
        },
      });
    }

    // Pagination stages
    // Pagination stages
    // Pagination stages
    const skip = Number(pageNo - 1) * recordPerPage; // Calculate skip
    const limit = Number(recordPerPage); // Convert to number

    pipeline.push({
      $facet: {
        metadata: [
          { $count: "total" },
          { $addFields: { pageNo, recordPerPage } },
        ],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    });

    const result = await employerModel.aggregate(pipeline).exec();

    // Return the result
    return result[0] ? result[0].data : [];
  }

  public getEmployeesListService = async (creatorIdFilter: string | null = null) => {
    const matchQuery: any = { isDeleted: false };
    if (creatorIdFilter) {
      matchQuery.createdBy = this.objectIdConverter.convertToObjectId(creatorIdFilter);
    }
    const companies = await employerModel.find(matchQuery);
    if (companies)
      return companies.map((company) => ({
        id: company.id,
        label: company.companyName,
      }));
    return [];
  };

  public async getCount(creatorIdFilter = null) {
    const matchQuery: any = { isDeleted: false };
    if (creatorIdFilter) {
      matchQuery.createdBy = this.objectIdConverter.convertToObjectId(creatorIdFilter);
    }
    const employer = await employerModel
      .find(matchQuery)
      .count();
    return employer;
  }

  public async getEmployerByIdService(id: string) {
    const objectId = this.objectIdConverter.convertToObjectId(id);
    let images;
    const employerDetail: any = await employerModel
      .findById(id)
      .populate("industryName", "industryName")
      .populate("city", "name")
      .populate({
        path: "companyLogo",
        select: "_id",
      })
      .select("-industryName -city");
    const newImage: any = employerDetail?.companyLogo?._id
      ? await mediaModel.findById(employerDetail.companyLogo._id)
      : null;
    if (employerDetail) {
      images = await companyImageModel.aggregate([
        {
          $match: {
            companyId: objectId,
          },
        },
        {
          $lookup: {
            from: mediaModel.collection.name,
            let: { mediaId: "$imageId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$mediaId"],
                  },
                },
              },
            ],
            as: "mediaDetail",
          },
        },
        {
          $unwind: {
            path: "$mediaDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            path: "$mediaDetail.filepath",
            imageId: "$mediaDetail._id",
          },
        },
      ]);
    }
    return { employerDetail, images, newImage };
  }

  public async updateEmployerByIdService(
    id: string,
    updatedData: Employer,
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
      if (card.oldImage) {
        card.image = card.oldImage.toString();
      }
    }

    const updatedEmployer = await employerModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      },
    );

    /* now retrieve cards from db */
    //@ts-ignore
    const oldCards: any[] = updatedEmployer?.additionalData || [];
    /* push update frontend cards over old cards */
    /* first check transformedCardContainImage cards exists in Cards */
    let finalCardForDocument: any[] = [];
    for (let newCard of transformedCardContainImage) {
      /* this line find the newCard in oldCards */
      const oldCard = oldCards.find(
        (card) => card._id?.toString() === newCard._id.toString(),
      );
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
    const finalUpdate = await employerModel.findByIdAndUpdate(
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

  public async deleteEmployerByIdService(id: string) {
    const deletedEmployer = await employerModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true },
    );
    return deletedEmployer;
  }

  public async addEmployerService(employerData: Employer, additionalData: any) {
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
        card.image = card.oldImage?.toString();
      }
    }
    /* remove all _id */
    transformedCardContainImage = transformedCardContainImage.map(
      ({ _id, ...restData }) => restData,
    );
    if (employerData.oldTransformedCardContainImage) {
      transformedCardContainImage = employerData.oldTransformedCardContainImage;
    }
    const newEmployer = await employerModel.create({
      ...employerData,
      status: true,
      additionalData: transformedCardContainImage,
    });
    return newEmployer;
  }

  public async getCompanyByCity(cityId: string) {
    const cityIdsArray = cityId.split(",");
    const objectIdCityIds = cityIdsArray.map((id) =>
      this.objectIdConverter.convertToObjectId(id),
    );
    const employers = await employerModel
      .find({
        city: { $in: objectIdCityIds.length ? objectIdCityIds : cityId }, // Use $in to match any of the values in the array
        isDeleted: false,
      })
      .select("companyName");
    return employers;
  }

  public async getSuggesstionService(suggesstion: string) {
    suggesstion = suggesstion ?? "";
    const suggestionList = await employerModel.aggregate([
      {
        $match: {
          isDeleted: false,
          status: true,
        },
      },
      {
        $lookup: {
          from: industriesModel.collection.name, // Assuming the collection name is "industryModel"
          localField: "industryName",
          foreignField: "_id",
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
        $project: {
          _id: 1,
          companyName: 1,
          industryName: "$industryName.industryName",
        },
      },
      {
        $match: {
          $or: [
            { companyName: { $regex: suggesstion, $options: "i" } },
            { industryName: { $regex: suggesstion, $options: "i" } },
          ],
        },
      },
      {
        $limit: 10,
      },
    ]);
    return suggestionList;
  }

  public async getAllEmployersForFrontendService(
    paylaod: EmployerBodyPaylaodFrontend,
  ) {
    const filterQuery = {};
    const skip = paylaod.skip ?? 0;
    if (paylaod.slectedCity) {
      if (typeof paylaod.slectedCity === "string") {
        paylaod.slectedCity = [paylaod.slectedCity];
      }
      filterQuery["city"] = {
        $in: paylaod.slectedCity.map((data: any) =>
          this.objectIdConverter.convertToObjectId(data),
        ),
      };
    }
    if (paylaod.isFillter) {
      // start

      if (typeof paylaod.isFillter === "string") {
        paylaod.isFillter = [paylaod.isFillter];
      }
      filterQuery["industryName._id"] = {
        $in: paylaod.isFillter.map((data: any) =>
          this.objectIdConverter.convertToObjectId(data),
        ),
      };

      // End
      // filterQuery["industryName._id"] =
      //   this.objectIdConverter.convertToObjectId(paylaod.isFillter);
    }
    if (paylaod.searchValue) {
      filterQuery["$or"] = [
        { companyName: { $regex: paylaod.searchValue, $options: "i" } },
        { companyDescription: { $regex: paylaod.searchValue, $options: "i" } },
        {
          "industryName.industryName": {
            $regex: paylaod.searchValue,
            $options: "i",
          },
        },
      ];
    }
    const EmpList = await employerModel.aggregate([
      {
        $match: {
          isDeleted: false,
          status: true,
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
          ],
          as: "cityDetails",
        },
      },
      {
        $unwind: {
          path: "$cityDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: industriesModel.collection.name, // Assuming the collection name is "industryModel"
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
          let: { logoId: "$companyLogo" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$logoId"],
                },
              },
            },
            {
              $project: {
                filepath: 1,
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
        $match: {
          ...filterQuery,
        },
      },
      {
        $skip: Number(skip),
      },
      {
        $limit: 100,
      },
      {
        $group: {
          _id: "$_id",
          industryName: { $first: "$industryName.industryName" },
          companyName: { $first: "$companyName" },
          companyLogo: { $first: "$companyLogo.filepath" },
          location: { $first: "$cityDetails.name" },
          description: { $first: "$companyDescription" },
          mapUrl: { $first: "$mapUrl" },
          locationUrl: { $first: "$locationUrl" },
        },
      },
    ]);
    return EmpList;
  }

  public async getCompanyDetailService(companyId: string) {
    const [companyDetail] = await employerModel.aggregate([
      {
        $match: {
          _id: this.objectIdConverter.convertToObjectId(companyId),
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
            {
              $project: {
                filepath: 1,
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
          from: industriesModel.collection.name, // Assuming the collection name is "industryModel"
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
                _id: 0,
                name: 1,
                address: 1,
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
          let: { jobid: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$companyId", "$$jobid"],
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
        $project: {
          email: 1,
          companyName: 1,
          address: 1,
          zipCode: 1,
          industryName: "$industryName.industryName",
          contactPerson: 1,
          companyLogo: "$companyLogo.filepath",
          companyDescription: 1,
          videoLink: 1,
          website: 1,
          mapUrl: 1,
          phoneNo: 1,
          companyImages: {
            $map: {
              input: "$companyImages",
              as: "image",
              in: "$$image.companyImages.filepath",
            },
          },
        },
      },
    ]);
    return companyDetail;
  }

  public async getJobsByCompanyIdService(
    companyId: string,
    skip: number,
    selectedCity: string[],
  ) {
    try {
      let query = {}; // Define the type of query as an array of any initially
      if (selectedCity?.length) {
        if (typeof selectedCity === "string") {
          selectedCity = [selectedCity];
        }
        query = {
          city: {
            $in: selectedCity.map((data: any) =>
              this.objectIdConverter.convertToObjectId(data),
            ),
          },
        };
      }

      const companyList = await jobModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: [
                "$company",
                this.objectIdConverter.convertToObjectId(companyId),
              ],
            },
          },
        },
        { $match: { ...query } },
        {
          $match: {
            isDeleted: false,
            status: true,
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
                    $in: ["$_id", "$$cityId"],
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
                  companyId: "$_id",
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
          $skip: Number(skip),
        },
        {
          $limit: 10,
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
            _id: "$_id", // Use null to group all documents into a single group
            jobTitle: { $first: "$jobTitle" },
            startDate: { $first: "$startDate" },
            status: { $first: "$status" },
            createdAt: { $first: "$createdAt" },
            city: { $addToSet: "$city.name" },
            industryName: { $first: "$industryName.industryName" },
            company: { $first: "$company.companyName" },
            companyLogo: { $first: "$company.companyLogo" },
            companyId: { $first: "$company.companyId" },
            jobType: { $first: "$jobTypeDoc.jobTypeName" },
          },
        },
      ]);
      return companyList;
    } catch (error) {
      console.log({ error });
    }
  }

  public async getJobsListByCompanyIdService(companyId: string) {
    const companyList = await jobModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [
              "$company",
              this.objectIdConverter.convertToObjectId(companyId),
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          label: "$jobTitle",
        },
      },
    ]);
    return companyList;
  }

  public async addAppoinmentService(
    paylaod: Appoinment,
    attachments: any,
    bccContent,
  ) {
    try {
      const employerDetail = await employerModel.findById(paylaod.companyId);
      const emailContent = await emailContentModel.findOne();
      const adminDetail = await userModel.findOne();
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
      // const bcc: string[] = ["karriere@azubiregional.de"];
      const bcc: string[] = [`${bccContent[0]?.to}`];
      if (employerDetail) {
        // bcc.push(employerDetail.email as string);
      }
      if (adminDetail) {
        bcc.push(adminDetail.email);
      }
      const htmlContent = await ejs.renderFile(
        path.join(path.resolve(path.dirname("")), "views", "appoinment.ejs"),
        {
          jobTitle: employerDetail?.jobTitle,
          payload: paylaod,
          emailContent: emailContent?.appointment,
          company_url: `${
            process.env.WEB_FRONTEND_URL || ""
          }/unternehmen/${paylaod?.companyId}`,
        },
      );
      await appoinmentModel.create(paylaod);
      void emailService.sendEmail({
        bcc,
        subject: "Bewerbung auf AzubiRegional.de",
        html: htmlContent,
        attachments: files,
      });
    } catch (error) {
      throw new Error("something went wrong");
    }
  }

  public async getAppoinmentCount() {
    const count = await appoinmentModel.count();
    return count;
  }
}
