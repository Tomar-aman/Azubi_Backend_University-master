import { companyImageModel } from "../models/index";
import logger from "./logger";
import { FileHandler } from "./fileHandler";

export class CompanyImageHandler {
  private readonly fileHandler: FileHandler;
  constructor() {
    this.fileHandler = new FileHandler();
  }

  public async saveFileAndCreateMedia(
    files: any[],
    removeFile: any,
    companyId: string,
  ) {
    try {
      if (removeFile) {
        try {
          for (let i = 0; i < removeFile.length; i++) {
            await companyImageModel.deleteMany({
              imageId: removeFile[i],
            });
          }
        } catch (error) {
          await companyImageModel.deleteMany({
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
            await companyImageModel.create({
              imageId: mediaId,
              companyId,
            });
          }
        } catch (error) {
          const mediaId = await this.fileHandler.saveFileAndCreateMedia(files);
          await companyImageModel.create({
            imageId: mediaId,
            companyId,
          });
        }
      }
    } catch (error) {
      logger.error("saveFileAndCreateMedia", error);
    }
  }
}
