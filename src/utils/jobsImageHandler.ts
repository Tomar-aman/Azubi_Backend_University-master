import { jobImagesModel } from "../models/index";
import logger from "./logger";
import { FileHandler } from "./fileHandler";

export class JobImageHandler {
  private readonly fileHandler: FileHandler;
  constructor() {
    this.fileHandler = new FileHandler();
  }

  public async saveFileAndCreateMedia(
    files: any[],
    removeFile: any,
    jobId: string,
  ) {
    try {
      if (removeFile) {
        try {
          for (let i = 0; i < removeFile.length; i++) {
            await jobImagesModel.deleteMany({
              imageId: removeFile[i],
            });
          }
        } catch (error) {
          await jobImagesModel.deleteMany({
            imageId: removeFile,
          });
        }
      }

      if (files) {
        try {
          let newFiles: any = [];
          if (!files.length) {
            newFiles.push(files);
          } else {
            newFiles = files;
          }
          for (let i = 0; i < newFiles.length; i++) {
            const mediaId = await this.fileHandler.saveFileAndCreateMedia(
              newFiles[i],
            );
            await jobImagesModel.create({
              imageId: mediaId,
              jobId,
            });
          }
        } catch (error) {
          const mediaId = await this.fileHandler.saveFileAndCreateMedia(files);
          await jobImagesModel.create({
            imageId: mediaId,
            jobId,
          });
        }
      }
    } catch (error) {
      logger.error("saveFileAndCreateMedia", error);
    }
  }
}
