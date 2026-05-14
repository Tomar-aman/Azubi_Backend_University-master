import path from "path";
import fs from "fs/promises";
import sharp from "sharp"; // Import sharp for image processing
import { mediaModel } from "../models/index";
import { type Media } from "../models/media";
import logger from "./logger";

export class FileHandler {
  public async saveFileAndCreateMedia(fileInput: any): Promise<string | null> {
    try {
      // Handle array of files by taking the first one
      const file = Array.isArray(fileInput) ? fileInput[0] : fileInput;

      if (!file || !file.data || !Buffer.isBuffer(file.data)) {
        logger.error("Invalid file or buffer type", { file: !!file, hasData: !!file?.data });
        return null;
      }

      // Generate a unique file name
      const actualFileName = file.name;
      const fileName = Date.now() + "-" + file.name;
      
      // Use absolute path for saving — process.cwd() matches how index.ts serves static files
      const publicDir = path.resolve(process.cwd(), "public");
      const filePathAbsolute = path.join(publicDir, fileName);
      const relativePath = fileName; // We only store the filename or relative-to-public path

      await fs.mkdir(publicDir, { recursive: true });

      // Save the original file
      await fs.writeFile(filePathAbsolute, file.data);

      let finalRelativePath = relativePath;

      // Conditionally convert GIF to PNG
      if (file.mimetype === "image/gif") {
        const pngFileName = Date.now() + "-" + actualFileName.replace(/\.gif$/, ".png");
        const pngFilePathAbsolute = path.join(publicDir, pngFileName);
        
        await sharp(file.data).toFile(pngFilePathAbsolute);
        file.mimetype = "image/png";
        finalRelativePath = pngFileName;
      }

      // Create a media document
      const mediaData: Media = {
        type: file.mimetype || "image/png",
        fileName: actualFileName || "upload-" + Date.now(),
        filepath: finalRelativePath,
      };
      const createdMedia = await mediaModel.create(mediaData);
      return createdMedia._id;
    } catch (error) {
      logger.error("saveFileAndCreateMedia", error);
      return null;
    }
  }
}
