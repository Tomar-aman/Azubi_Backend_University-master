/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable prefer-const */
import { type ManageContent } from "../../models/manageContent";
import {
  manageContentModel,
  manageHomeContentModel,
  mediaModel,
  jobMarketContentModel,
  applyFormContentModel,
  companyContentModel,
  sideBarContentModel,
  faqContentModel,
  aboutContentModel,
  jobMagazineContentModel,
  contactUsContentModel,
  jobWallContentModel,
  homePageContentModel,
  emailContentModel,
} from "../../models/index";
import mongoose, { type Schema } from "mongoose";
import { FileHandler } from "../../utils/fileHandler";
import { type JobMarketContent } from "../../models/jobMarketContent";
import { type ApplyFormContent } from "../../models/applyFormContent";
import { type CompanyContent } from "../../models/companyContent";
import { type SideBarContent } from "../../models/sideBarContent";
import {
  type AboutContentOperationField,
  type ContactUsOperationField,
  type EmailContentOperationField,
  type HomePageOperationField,
  type JobMagazineContentOperationField,
  type JobWallOperationField,
} from ".";

export class ManageContentService {
  private readonly fileHandler: FileHandler;
  constructor() {
    this.fileHandler = new FileHandler();
  }

  public async getAllContentService() {
    const result = await manageContentModel.findOne();
    if (result) {
      result.id = result._id;
    }
    return result;
  }

  public async editContentService(updatedData: Schema<ManageContent>) {
    return await manageContentModel.findOneAndUpdate({}, updatedData, {
      new: true,
      upsert: true,
    });
  }

  public async editHomeContent(textData: any, fileData: any) {
    const mediaDataObject: any = {};
    if (fileData.mailChimpLogo) {
      const mailChimpLogo = await this.fileHandler.saveFileAndCreateMedia(
        fileData.mailChimpLogo,
      );
      mediaDataObject.mailChimpLogo = mailChimpLogo;
    }
    if (fileData.oldMailChimpLogo && fileData.oldMailChimpLogo !== "null") {
      console.log("fileData.oldMailChimpLogo", fileData.oldMailChimpLogo);
      mediaDataObject.mailChimpLogo = new mongoose.Types.ObjectId(
        fileData.oldMailChimpLogo,
      );
    }
    if (fileData.tips_1) {
      const tips_1 = await this.fileHandler.saveFileAndCreateMedia(
        fileData.tips_1,
      );
      mediaDataObject.tips_1 = tips_1;
    }
    if (fileData.oldtips_1 && fileData.oldtips_1 !== "null") {
      mediaDataObject.mailChimpLogo = new mongoose.Types.ObjectId(
        fileData.oldtips_1,
      );
      mediaDataObject.tips_1 = fileData.oldtips_1;
    }
    if (fileData.tips_2) {
      const tips_2 = await this.fileHandler.saveFileAndCreateMedia(
        fileData.tips_2,
      );
      mediaDataObject.tips_2 = tips_2;
    }
    if (fileData.oldtips_2 && fileData.oldtips_2 !== "null") {
      mediaDataObject.tips_2 = new mongoose.Types.ObjectId(fileData.oldtips_2);
      mediaDataObject.tips_2 = fileData.oldtips_2;
    }
    if (fileData.tips_3) {
      const tips_3 = await this.fileHandler.saveFileAndCreateMedia(
        fileData.tips_3,
      );
      mediaDataObject.tips_3 = tips_3;
    }
    if (fileData.oldtips_3 && fileData.oldtips_3 !== "null") {
      mediaDataObject.tips_3 = new mongoose.Types.ObjectId(fileData.oldtips_3);
    }

    await manageHomeContentModel.findOneAndUpdate(
      {},
      { ...textData, ...mediaDataObject },
      {
        new: true,
        upsert: true,
      },
    );
  }

  public async getHomeContent() {
    const data = await manageHomeContentModel.aggregate([
      {
        $lookup: {
          from: mediaModel.collection.name,
          let: { mediaId: "$mailChimpLogo" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$_id" }, "$$mediaId"],
                },
              },
            },
          ],
          as: "mailChimpLogo",
        },
      },
      {
        $unwind: {
          path: "$mailChimpLogo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: mediaModel.collection.name,
          let: { mediaId: "$tips_1" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$_id" }, "$$mediaId"],
                },
              },
            },
          ],
          as: "tips_1",
        },
      },
      {
        $unwind: {
          path: "$tips_1",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: mediaModel.collection.name,
          let: { mediaId: "$tips_2" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$_id" }, "$$mediaId"],
                },
              },
            },
          ],
          as: "tips_2",
        },
      },
      {
        $unwind: {
          path: "$tips_2",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: mediaModel.collection.name,
          let: { mediaId: "$tips_3" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$_id" }, "$$mediaId"],
                },
              },
            },
          ],
          as: "tips_3",
        },
      },
      {
        $unwind: {
          path: "$tips_3",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return data;
  }

  // job market
  public async getAllJobMarketContentService() {
    const result = await jobMarketContentModel.findOne();
    if (result) {
      result.id = result._id;
    }
    return result;
  }

  public async editJobMarketContentService(
    updatedData: Schema<JobMarketContent>,
  ) {
    return await jobMarketContentModel.findOneAndUpdate({}, updatedData, {
      new: true,
      upsert: true,
    });
  }

  // apply form content
  public async getAllApplyFormContentService() {
    const result = await applyFormContentModel.findOne();
    if (result) {
      result.id = result._id;
    }
    return result;
  }

  public async editApplyFormContentService(
    updatedData: Schema<ApplyFormContent>,
  ) {
    return await applyFormContentModel.findOneAndUpdate({}, updatedData, {
      new: true,
      upsert: true,
    });
  }

  // company content
  public async getAllCompanyContentService() {
    const result = await companyContentModel
      .findOne()
      .populate("ownerImage")
      .populate("industryImage");
    if (result) {
      result.id = result._id;
    }
    return result;
  }

  public async editCompanyContentService(updatedData: Schema<CompanyContent>) {
    return await companyContentModel.findOneAndUpdate({}, updatedData, {
      new: true,
      upsert: true,
    });
  }

  // side bar content for app
  public async getAllSideBarContentService() {
    const result = await sideBarContentModel.findOne();
    if (result) {
      result.id = result._id;
    }
    return result;
  }

  public async editSideBarContentService(updatedData: Schema<SideBarContent>) {
    return await sideBarContentModel.findOneAndUpdate({}, updatedData, {
      new: true,
      upsert: true,
    });
  }

  // FAQ content
  public async getAllFAQContentService() {
    const result = await faqContentModel.findOne().populate([
      {
        path: "header.image",
      },
      {
        path: "cards.image",
      },
      {
        path: "iconSection.image",
      },
    ]);
    return result;
  }

  public async editFaqContent(
    updatedData: any,
    operation: "accordion" | "header" | "cards" | "iconSection",
  ) {
    if (operation === "accordion") {
      await faqContentModel.findOneAndUpdate({}, { $set: { accordion: [] } });
      return await faqContentModel.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true,
      });
    }

    if (operation === "iconSection") {
      let finalData: any = {};
      if (updatedData?.media?.image) {
        const image = await this.fileHandler.saveFileAndCreateMedia(
          updatedData.media.image,
        );
        finalData.image = new mongoose.Types.ObjectId(image as string);
      }
      if (updatedData.oldImage) {
        finalData.image = new mongoose.Types.ObjectId(
          updatedData.oldImage as string,
        );
      }
      finalData = { ...finalData, ...updatedData.data };
      return await faqContentModel.findOneAndUpdate(
        {},
        { iconSection: finalData },
        { new: true, upsert: true },
      );
    }
    if (operation === "header") {
      const { image, ...restData } = updatedData;
      if (restData.oldImage && restData.oldImage !== "null") {
        restData.image = new mongoose.Types.ObjectId(restData.oldImage);
      }
      if (image && image !== "null") {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
        restData.image = mediaId;
      } else {
        const document = await faqContentModel.findOne();
        if (document && document.header?.image) {
          restData.image = document.header.image.toString();
        }
      }
      return await faqContentModel.findOneAndUpdate(
        {},
        {
          header: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "cards") {
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (let _reqData in updatedData) {
        console.log({ _reqData });
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          title: updatedData[`objects[${idx}][title]`],
          link: updatedData[`objects[${idx}][link]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          oldImage: updatedData[`objects[${idx}][oldImage]`] ?? null,
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (let card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImage) {
          card.image = new mongoose.Types.ObjectId(card.oldImage);
        }
      }
      /* now retrieve cards from db */
      const document = await faqContentModel.findOne().lean();
      const oldCards: any[] = document?.cards || [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (let newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
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
      return await faqContentModel.findOneAndUpdate(
        {},
        { cards: finalCardForDocument },
        { new: true, upsert: true },
      );
    }
    return null;
  }

  // about content service
  public async editAboutContent(
    updatedData: any,
    operation: keyof AboutContentOperationField,
  ) {
    if (operation === "banner") {
      const { text, image, oldImage } = updatedData;
      let media: string | null | any = null;
      if (image) {
        media = await this.fileHandler.saveFileAndCreateMedia(image);
      }
      if (oldImage && oldImage !== "null") {
        media = new mongoose.Types.ObjectId(oldImage as string);
      }
      // create payload
      const payload: any = {
        text,
      };
      if (media) {
        payload.image = media;
      } else {
        const doc = await aboutContentModel.findOne();
        if (doc && doc.banner?.image) {
          media = doc.banner.image.toString();
          payload.image = media;
        }
      }
      // insert document
      return await aboutContentModel.findOneAndUpdate(
        {},
        { banner: payload },
        { new: true, upsert: true },
      );
    }
    if (operation === "textBlock") {
      return await aboutContentModel.findOneAndUpdate(
        {},
        { textBlock: updatedData },
        { new: true, upsert: true },
      );
    }
    if (operation === "aboutFeature") {
      let documentPayload: any = {};
      const {
        aboutFeaturesHeadingFirst,
        aboutFeaturesHeadingSecond,
        aboutFeaturesImage,
        features,
        oldImage,
      } = updatedData;
      if (aboutFeaturesImage) {
        const media =
          await this.fileHandler.saveFileAndCreateMedia(aboutFeaturesImage);
        documentPayload.aboutFeaturesImage = media;
      }
      if (oldImage) {
        documentPayload.aboutFeaturesImage = new mongoose.Types.ObjectId(
          oldImage,
        );
      }
      documentPayload = {
        ...documentPayload,
        aboutFeaturesHeadingFirst,
        aboutFeaturesHeadingSecond,
        features: features.map((item: any) => ({ text: item })),
      };

      return await aboutContentModel.findOneAndUpdate({}, documentPayload, {
        new: true,
        upsert: true,
      });
    }
    if (operation == "marketing") {
      return await aboutContentModel.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true,
      });
    }
    if (operation == "youTube") {
      return await aboutContentModel.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true,
      });
    }
    if (operation === "mediaData") {
      return await aboutContentModel.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true,
      });
    }
    if (operation === "calender") {
      const { sideImage, ...restData } = updatedData;
      if (restData.oldImages) {
        restData.sideImage = new mongoose.Types.ObjectId(
          restData.oldImages as string,
        );
      }
      if (sideImage) {
        const media = await this.fileHandler.saveFileAndCreateMedia(sideImage);
        restData.sideImage = media;
      } else {
        if (!restData.oldImages && restData.oldImages !== "null") {
          const previousData = await aboutContentModel.findOne();
          restData.sideImage = previousData?.calender.sideImage || null;
        }
      }
      return await aboutContentModel.findOneAndUpdate(
        {},
        { calender: restData },
        {
          new: true,
          upsert: true,
        },
      );
    }

    if (operation === "offerCard") {
      let updatedCard: any;
      // transform card data
      let transformedCard: any[] = [];
      let idx = 0;
      for (let _reqData in updatedData) {
        transformedCard.push({
          _id: updatedData[`objects[${idx}][_id]`],
          heading: updatedData[`objects[${idx}][heading]`],
          text: updatedData[`objects[${idx}][text]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          url: updatedData[`objects[${idx}][url]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      // filter the actual object
      transformedCard = transformedCard.filter((itm: any) => itm._id);

      const document = await aboutContentModel.findOne().lean();
      const cardsWithMediaId: any[] = [];
      if (document) {
        if (document.OfferCards.length > 0) {
          for (let card of transformedCard) {
            if (card.image) {
              const media = await this.fileHandler.saveFileAndCreateMedia(
                card.image,
              );
              card.image = media;
              card._id = new mongoose.Types.ObjectId(card._id);
            }
            if (card.oldImages) {
              card.image = new mongoose.Types.ObjectId(
                card.oldImages as string,
              );
              card._id = new mongoose.Types.ObjectId(card._id);
            }
            cardsWithMediaId.push(card);
          }

          const card = cardsWithMediaId.map((itm) => {
            if (itm.image) {
              return itm;
            } else {
              const img = document.OfferCards.find(
                (crd) => itm._id.toString() === crd._id?.toString(),
              );
              itm.image = img?.image;
              return itm;
            }
          });
          updatedCard = await aboutContentModel.findOneAndUpdate(
            {},
            { OfferCards: card },
            { new: true, upsert: true },
          );
          return updatedCard;
        } else {
          // inserting cards in empty
          for (let card of transformedCard) {
            if (card.image) {
              const media = await this.fileHandler.saveFileAndCreateMedia(
                card.image,
              );
              card.image = media;
            }
            const { _id, ...rest } = card;
            cardsWithMediaId.push(rest);
          }
          updatedCard = await aboutContentModel.findOneAndUpdate(
            {},
            { OfferCards: cardsWithMediaId },
            { new: true, upsert: true },
          );
          return updatedCard;
        }
      } else {
        // inserting cards in empty
        for (let card of transformedCard) {
          if (card.image) {
            const media = await this.fileHandler.saveFileAndCreateMedia(
              card.image,
            );
            card.image = media;
          }
          const { _id, ...rest } = card;
          cardsWithMediaId.push(rest);
        }
        updatedCard = await aboutContentModel.findOneAndUpdate(
          {},
          { OfferCards: cardsWithMediaId },
          { new: true, upsert: true },
        );
        return updatedCard;
      }
    }
    if (operation === "customer") {
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (let _reqData in updatedData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          url: updatedData[`objects[${idx}][url]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (let card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages as string);
        }
      }
      /* now retrieve cards from db */
      const document = await aboutContentModel.findOne().lean();
      const oldCards: any[] = document?.ourCustomers || [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (let newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
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
      return await aboutContentModel.findOneAndUpdate(
        {},
        { ourCustomers: finalCardForDocument },
        { new: true, upsert: true },
      );
    }
    if (operation === "slider") {
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (let _reqData in updatedData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (let card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages as string);
        }
      }
      /* now retrieve cards from db */
      const document = await aboutContentModel.findOne().lean();
      const oldCards: any[] = document?.slider || [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (let newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
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
      return await aboutContentModel.findOneAndUpdate(
        {},
        { slider: finalCardForDocument },
        { new: true, upsert: true },
      );
    }
    if (operation === "exhibitor") {
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (let _reqData in updatedData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (let card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages as string);
        }
      }
      /* now retrieve cards from db */
      const document = await aboutContentModel.findOne().lean();
      const oldCards: any[] = document?.exhibitors || [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (let newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
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
      return await aboutContentModel.findOneAndUpdate(
        {},
        { exhibitors: finalCardForDocument },
        { new: true, upsert: true },
      );
    }
    if (operation === "careerFair") {
      const {
        careerFairFirstHeading,
        careerFairSecondHeading,
        ...restCardData
      } = updatedData;
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (let _reqData in restCardData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          heading: updatedData[`objects[${idx}][heading]`],
          text: updatedData[`objects[${idx}][text]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (let card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages as string);
        }
      }
      /* now retrieve cards from db */
      const document = await aboutContentModel.findOne().lean();
      const oldCards: any[] = document?.careerFairCards || [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (let newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
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
      return await aboutContentModel.findOneAndUpdate(
        {},
        {
          careerFairCards: finalCardForDocument,
          careerFairFirstHeading,
          careerFairSecondHeading,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "contact") {
      const { contactHeadingFirst, contactHeadingSecond, ...restCardData } =
        updatedData;
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (let _reqData in restCardData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          heading: updatedData[`objects[${idx}][heading]`],
          text: updatedData[`objects[${idx}][text]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (let card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages as string);
        }
      }
      /* now retrieve cards from db */
      const document = await aboutContentModel.findOne().lean();
      const oldCards: any[] = document?.contactCard || [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (let newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
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
      return await aboutContentModel.findOneAndUpdate(
        {},
        {
          contactCard: finalCardForDocument,
          contactHeadingFirst,
          contactHeadingSecond,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "twoCards") {
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (let _reqData in updatedData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          heading: updatedData[`objects[${idx}][heading]`],
          text: updatedData[`objects[${idx}][text]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          buttonUrl: updatedData[`objects[${idx}][buttonUrl]`],
          buttonText: updatedData[`objects[${idx}][buttonText]`],
          buttonColor: updatedData[`objects[${idx}][buttonColor]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (let card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages as string);
        }
      }
      /* now retrieve cards from db */
      const document = await aboutContentModel.findOne().lean();
      const oldCards: any[] = document?.twoCards || [];
      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (let newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
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
      return await aboutContentModel.findOneAndUpdate(
        {},
        {
          twoCards: finalCardForDocument,
        },
        { new: true, upsert: true },
      );
    }
    return null;
  }

  public async getAllAboutContent() {
    return await aboutContentModel
      .findOne()
      .populate([
        { path: "aboutFeaturesImage" },
        { path: "banner.image" },
        { path: "ourCustomers.image" },
        { path: "slider.image" },
        { path: "careerFairCards.image" },
        { path: "exhibitors.image" },
        { path: "contactCard.image" },
        { path: "calender.sideImage" },
        { path: "OfferCards.image" },
        { path: "twoCards.image" },
      ]);
  }

  /** job magazine order content */
  public async getAllJobMagazineContent() {
    return await jobMagazineContentModel.findOne().populate([
      {
        path: "jobMagazineCards.image",
      },
      {
        path: "jobMagazinePointSideImage",
      },
    ]);
  }

  public async editJobMagazineContent(
    updatedData: any,
    operation: keyof JobMagazineContentOperationField,
  ) {
    if (operation === "header") {
      return await jobMagazineContentModel.findOneAndUpdate(
        {},
        {
          header: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "jobMagazineCard") {
      const { jobMagazineHeading, ...restCardData } = updatedData;
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (let _reqData in restCardData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          cardHeading: updatedData[`objects[${idx}][cardHeading]`],
          textFirst: updatedData[`objects[${idx}][textFirst]`],
          textSecond: updatedData[`objects[${idx}][textSecond]`],
          additionalText: updatedData[`objects[${idx}][additionalText]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (let card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImage) {
          card.image = new mongoose.Types.ObjectId(card.oldImage);
        }
      }
      /* now retrieve cards from db */
      const document = await jobMagazineContentModel.findOne().lean();
      const oldCards: any[] = document?.jobMagazineCards || [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (let newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard?.oldImages) {
          oldCard.image = oldCard.oldImages;
        }
        if (newCard?.oldImages) {
          newCard.image = newCard.oldImages;
        }
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
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
      return await jobMagazineContentModel.findOneAndUpdate(
        {},
        {
          jobMagazineCards: finalCardForDocument,
          jobMagazineHeading,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "jobMagazinePoints") {
      const {
        jobMagazinePointSideImage,
        jobMagazinePointHeading,
        jobMagazinePointText,
        jobMagazinePoints,
        oldImages,
      } = updatedData;
      const payload: any = {};
      if (jobMagazinePointSideImage) {
        const mediaID = await this.fileHandler.saveFileAndCreateMedia(
          jobMagazinePointSideImage,
        );
        if (mediaID) {
          payload.jobMagazinePointSideImage = mediaID;
        }
      }
      if (oldImages && oldImages !== "null") {
        payload.jobMagazinePointSideImage = new mongoose.Types.ObjectId(
          oldImages,
        );
      }
      return await jobMagazineContentModel.findOneAndUpdate(
        {},
        {
          ...payload,
          jobMagazinePointHeading,
          jobMagazinePointText,
          jobMagazinePoints: jobMagazinePoints.map((point: any) => ({
            text: point,
          })),
        },
        {
          new: true,
          upsert: true,
        },
      );
    }
    if (operation === "aboutService") {
      return await jobMagazineContentModel.findOneAndUpdate(
        {},
        {
          aboutService: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    return null;
  }

  /* contact us content */
  public async getAllContactUsContent() {
    return await contactUsContentModel.findOne().populate([
      {
        path: "aboutUs.sideImage",
      },
      {
        path: "contactCardFirstWithPoints.image",
      },
      {
        path: "ContactCardSecond.image",
      },
      {
        path: "aboutTeamCard.image",
      },
    ]);
  }

  public async editContactUsContent(
    updatedData: any,
    operation: keyof ContactUsOperationField,
  ) {
    if (operation === "pageHeading") {
      return await contactUsContentModel.findOneAndUpdate(
        {},
        {
          pageHeadingInGermany: updatedData.pageHeadingInGermany,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "addressSection") {
      return await contactUsContentModel.findOneAndUpdate(
        {},
        {
          address: { ...updatedData },
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "aboutUs") {
      let { sideImage, ...restData } = updatedData;
      if (restData.oldImages && restData.oldImages !== "null") {
        restData.sideImage = new mongoose.Types.ObjectId(restData.oldImages);
      }
      if (sideImage) {
        const mediaId =
          await this.fileHandler.saveFileAndCreateMedia(sideImage);
        restData.sideImage = mediaId;
      } else {
        if (!restData.oldImages && restData.oldImages === "null") {
          const document = await contactUsContentModel.findOne();
          if (document && document.aboutUs?.sideImage) {
            restData.sideImage = document.aboutUs.sideImage.toString();
          }
        }
      }
      return await contactUsContentModel.findOneAndUpdate(
        {},
        {
          aboutUs: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "counter") {
      const { counterHeading, counters } = updatedData;
      return await contactUsContentModel.findOneAndUpdate(
        {},
        { counterHeading, counters },
        { new: true, upsert: true },
      );
    }
    if (operation === "contactCardFirstWithPoints") {
      let { image, ...restData } = updatedData;
      if (restData.oldImages) {
        restData.image = new mongoose.Types.ObjectId(restData.oldImages);
      }
      if (image) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
        restData.image = mediaId;
      } else {
        if (!restData.oldImages && restData.oldImages === "null") {
          const document = await contactUsContentModel.findOne();
          if (document && document.contactCardFirstWithPoints?.image) {
            restData.image =
              document?.contactCardFirstWithPoints?.image?.toString();
          }
        }
      }
      return await contactUsContentModel.findOneAndUpdate(
        {},
        {
          contactCardFirstWithPoints: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "ContactCardSecond") {
      const { image, ...restData } = updatedData;
      if (restData.oldImages) {
        restData.image = new mongoose.Types.ObjectId(restData.oldImages);
      }
      if (image) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
        restData.image = mediaId;
      } else {
        if (!restData.oldImages && restData.oldImages === "null") {
          const document = await contactUsContentModel.findOne();
          if (document && document.ContactCardSecond?.image) {
            restData.image = document.ContactCardSecond.image.toString();
          }
        }
      }
      return await contactUsContentModel.findOneAndUpdate(
        {},
        {
          ContactCardSecond: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "aboutTeam") {
      const { aboutTeamHeading, aboutTeamSubHeading, ...restCardData } =
        updatedData;
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (let _reqData in restCardData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          heading: updatedData[`objects[${idx}][heading]`],
          subHeading: updatedData[`objects[${idx}][subHeading]`],
          buttonText: updatedData[`objects[${idx}][buttonText]`],
          buttonUrl: updatedData[`objects[${idx}][buttonUrl]`],
          buttonColor: updatedData[`objects[${idx}][buttonColor]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (let card of transformedCardContainImage) {
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages);
        }
        if (card.image && !card.oldImages) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
      }
      /* now retrieve cards from db */
      const document = await contactUsContentModel.findOne().lean();
      const oldCards: any[] = document?.aboutTeamCard || [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (let newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
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
      return await contactUsContentModel.findOneAndUpdate(
        {},
        {
          aboutTeamCard: finalCardForDocument,
          aboutTeamHeading,
          aboutTeamSubHeading,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "contactForm") {
      return await contactUsContentModel.findOneAndUpdate(
        {},
        {
          contactForm: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    return null;
  }

  /* job wall Content */
  public async getAllJobWallContent() {
    return await jobWallContentModel.findOne().populate([
      {
        path: "banner.image",
      },
      {
        path: "industryIcon",
      },
      {
        path: "locationIcon",
      },
      {
        path: "contactPersonIcon",
      },
    ]);
  }

  public async editJobWallContent(
    updatedData: any,
    operation: keyof JobWallOperationField,
  ) {
    if (operation === "banner") {
      const { image, ...restData } = updatedData;
      if (restData.oldImages) {
        restData.image = new mongoose.Types.ObjectId(restData.oldImages);
      }
      if (image) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
        restData.image = mediaId;
      } else {
        if (!restData.oldImages && restData.oldImages !== "null") {
          const document = await jobWallContentModel.findOne();
          if (document && document.banner?.image) {
            restData.image = document.banner.image.toString();
          }
        }
      }
      return await jobWallContentModel.findOneAndUpdate(
        {},
        {
          banner: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "industryIcon") {
      const { industryIcon, ...restData } = updatedData;
      if (restData?.ioldImage) {
        restData.image = new mongoose.Types.ObjectId(restData.ioldImage);
        return await jobWallContentModel.findOneAndUpdate(
          {},
          {
            industryIcon: restData.image?.toString(),
          },
          { new: true, upsert: true },
        );
      }
      if (industryIcon) {
        const mediaId =
          await this.fileHandler.saveFileAndCreateMedia(industryIcon);
        return await jobWallContentModel.findOneAndUpdate(
          {},
          {
            industryIcon: mediaId?.toString(),
          },
          { new: true, upsert: true },
        );
      }
    }

    if (operation === "locationIcon") {
      const { locationIcon, ...restData } = updatedData;
      if (restData.loldImage) {
        restData.image = new mongoose.Types.ObjectId(restData.loldImage);
        return await jobWallContentModel.findOneAndUpdate(
          {},
          {
            locationIcon: restData?.image?.toString(),
          },
          { new: true, upsert: true },
        );
      }
      if (locationIcon) {
        const mediaId =
          await this.fileHandler.saveFileAndCreateMedia(locationIcon);
        return await jobWallContentModel.findOneAndUpdate(
          {},
          {
            locationIcon: mediaId?.toString(),
          },
          { new: true, upsert: true },
        );
      }
    }

    if (operation === "contactPersonIcon") {
      const { contactPersonIcon, restData, coldImage } = updatedData;

      if (coldImage) {
        return await jobWallContentModel.findOneAndUpdate(
          {},
          {
            contactPersonIcon: coldImage
              ? coldImage?.toString()
              : restData.image?.toString(),
          },
          { new: true, upsert: true },
        );
      }
      if (contactPersonIcon) {
        const mediaId =
          await this.fileHandler.saveFileAndCreateMedia(contactPersonIcon);
        return await jobWallContentModel.findOneAndUpdate(
          {},
          {
            contactPersonIcon: mediaId?.toString(),
          },
          { new: true, upsert: true },
        );
      }
    }

    return null;
  }

  /* Home page content v2 */
  public async editHomePageV2Content(
    updatedData: any,
    operation: keyof HomePageOperationField,
  ) {
    if (operation === "cardSection") {
      const { cardHeading, cardText, CardBackgroundColor, ...restData } =
        updatedData;

      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (let _reqData in restData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          link: updatedData[`objects[${idx}][link]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (let card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages);
        }
      }
      /* now retrieve cards from db */
      const document = await homePageContentModel.findOne().lean();
      const oldCards: any[] = document?.cards || [];
      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (let newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard?.oldImages) {
          oldCard.image = oldCard?.oldImages;
        }
        if (newCard?.oldImages) {
          newCard.image = oldCard?.oldImages;
        }
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
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
        ({ _id, oldImages, ...restData }) => {
          if (oldImages) {
            restData.image = new mongoose.Types.ObjectId(oldImages);
          }
          return restData;
        },
      );
      return await homePageContentModel.findOneAndUpdate(
        {},
        {
          cards: finalCardForDocument,
          cardHeading,
          cardText,
          CardBackgroundColor,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "youtubeSection") {
      const { image, ...restData } = updatedData;
      if (restData.oldImages) {
        restData.image = new mongoose.Types.ObjectId(restData.oldImages);
      }
      if (image) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
        restData.image = mediaId;
      } else {
        if (!restData.oldImages) {
          const document = await homePageContentModel.findOne();
          if (document && document.youtubeSection?.image) {
            restData.image = document.youtubeSection.image.toString();
          }
        }
      }

      return await homePageContentModel.findOneAndUpdate(
        {},
        {
          youtubeSection: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "searchBar") {
      return await homePageContentModel.findOneAndUpdate(
        {},
        {
          searchBar: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "topState") {
      return await homePageContentModel.findOneAndUpdate(
        {},
        {
          topState: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "federalState") {
      return await homePageContentModel.findOneAndUpdate(
        {},
        {
          federalState: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "gallery") {
      return await homePageContentModel.findOneAndUpdate(
        {},
        {
          gallery: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "textContainer") {
      const { image, ...restData } = updatedData;
      if (restData.oldImages) {
        restData.image = new mongoose.Types.ObjectId(restData.oldImages);
      }
      if (image) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
        restData.image = mediaId;
      } else {
        if (!restData.oldImages) {
          const document = await homePageContentModel.findOne();
          if (document && document.textContainer?.image) {
            restData.image = document.textContainer.image.toString();
          }
        }
      }
      return await homePageContentModel.findOneAndUpdate(
        {},
        {
          textContainer: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "emailSection") {
      const { image, ...restData } = updatedData;
      if (restData.oldImages) {
        restData.image = new mongoose.Types.ObjectId(restData.oldImages);
      }
      if (image) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
        restData.image = mediaId;
      } else {
        if (!restData?.oldImages) {
          const document = await homePageContentModel.findOne();
          if (document && document.mailChimpSection?.image) {
            restData.image = document.mailChimpSection.image.toString();
          }
        }
      }
      return await homePageContentModel.findOneAndUpdate(
        {},
        {
          mailChimpSection: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "companiesLogo") {
      return await homePageContentModel.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true,
      });
    }
    if (operation === "headerLogoSideImage") {
      const {
        headerLogoSideImage,
        sideImage,
        oldImageHeaderLogoSideImage,
        oldSideImage,
      } = updatedData;

      let updateFields: any = {};
      if (oldImageHeaderLogoSideImage) {
        updateFields.headerLogoSideImage = new mongoose.Types.ObjectId(oldImageHeaderLogoSideImage);
      }

      if (oldSideImage) {
        updateFields.logoSideImage = new mongoose.Types.ObjectId(oldSideImage);
      }

      if (sideImage) {
        const imageId =
          await this.fileHandler.saveFileAndCreateMedia(sideImage);
        updateFields.logoSideImage = imageId;
      }
      if (headerLogoSideImage) {
        const mediaId =
          await this.fileHandler.saveFileAndCreateMedia(headerLogoSideImage);
        updateFields.headerLogoSideImage = mediaId;
      }

      const updatedDocument = await homePageContentModel.findOneAndUpdate(
        {},
        updateFields,
        { new: true, upsert: true },
      );

      return updatedDocument; // Ensure the updated document is returned
    }
    if (operation === "welcomeMessageForApp") {
      await homePageContentModel.findOneAndUpdate(
        {},
        {
          welcomeMessageForApp: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    return null;
  }

  public async getAllHomePageV2Content() {
    return await homePageContentModel.findOne().populate([
      {
        path: "youtubeSection.image",
      },
      {
        path: "cards.image",
      },
      {
        path: "textContainer.image",
      },
      {
        path: "mailChimpSection.image",
      },
      {
        path: "headerLogoSideImage",
      },
      {
        path: "logoSideImage",
      },
    ]);
  }

  /* email dynamic content */
  public async editEmailContent(
    updatedData: any,
    operation: keyof EmailContentOperationField,
  ) {
    if (operation === "application") {
      return await emailContentModel.findOneAndUpdate(
        {},
        {
          application: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "appointment") {
      return await emailContentModel.findOneAndUpdate(
        {},
        {
          appointment: updatedData,
        },
        { new: true, upsert: true },
      );
    }

    return null;
  }

  public async getAllEmailContent() {
    return await emailContentModel.findOne();
  }
}
