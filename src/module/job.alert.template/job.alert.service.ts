import { type JobAlertContent } from "../../models/jobAlertContent";
import { jobAlertContentModel, mediaModel } from "../../models/index";
import emailService from "../../utils/emailService";
export class JobAlertContentService {
  public async getAllJobAlertContentsService() {
    const aggregationPipeline = [
      {
        $lookup: {
          from: mediaModel.collection.name,
          localField: "image",
          foreignField: "_id",
          as: "media",
        },
      },
      {
        $unwind: {
          path: "$media",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          image: { $ifNull: ["$media.filepath", ""] },
        },
      },
    ];

    const [jobAlertContents] = await jobAlertContentModel
      .aggregate(aggregationPipeline)
      .exec();

    return jobAlertContents;
  }

  public async getJobAlertContentByIdService(id: string) {
    const jobAlertContent = await jobAlertContentModel.aggregate([
      {
        $match: { $eq: ["$_id", id] },
      },
      {
        $lookup: {
          from: mediaModel.collection.name,
          let: { mediaId: "$image" },
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
          _id: 1,
          heading: 1,
          subheading: 1,
          image: "$mediaDetail.filepath",
        },
      },
    ]);
    return jobAlertContent;
  }

  public async addJobAlertContentService(jobAlertContentData: JobAlertContent) {
    const newJobAlertContent = await jobAlertContentModel.create({
      image: jobAlertContentData.image,
      heading: jobAlertContentData.heading,
      subheading: jobAlertContentData.subheading,
    });
    return newJobAlertContent;
  }

  public async updateJobAlertContentByIdService(
    id: string,
    jobAlertContentData: JobAlertContent,
  ) {
    const updatedJobAlertContent = await jobAlertContentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          image: jobAlertContentData.image,
          heading: jobAlertContentData.heading,
          subheading: jobAlertContentData.subheading,
        },
      },
      { new: true },
    );
    return updatedJobAlertContent;
  }

  public async deleteJobAlertContentByIdService(id: string) {
    const deletedJobAlertContent = await jobAlertContentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
        },
      },
    );
    return deletedJobAlertContent;
  }

  public async jobAlarmMailService({ email, location, industry, bccContent }) {
    void emailService.sendEmail({
      // bcc: ["karriere@azubiregional.de"],
      bcc: [`${bccContent[0]?.to}`],
      subject: "JOB ALARM fur E-mail",
      html: `
      <p><b>E-MAIL of user:</b> ${email}</p>
      
      <p><b>Region Selection(s):</b> ${location}</p>
    
      <p><b>Industry types selection(s):</b> ${industry}</p>      
      `,
    });
    return { email, location, industry };
  }
}
