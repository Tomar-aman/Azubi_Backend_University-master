import path from "path";
import fs from "fs/promises";
import sharp from "sharp"; // Import sharp for image processing
import { mediaModel } from "../models/index";
import { type Media } from "../models/media";
import logger from "./logger";

export class FileHandler {
  public async saveFileAndCreateMedia(file: any): Promise<string | null> {
    try {
      // Ensure file.data is a Buffer
      if (!Buffer.isBuffer(file.data)) {
        throw new Error("Invalid buffer type");
      }

      // Generate a unique file name using the current timestamp
      const actualFileName = file.name;
      const fileName = Date.now() + "-" + file.name;
      let filePath = path.join("public", fileName).replace(/\\/g, "/");
      await fs.mkdir(path.join(__dirname, "../../public"), { recursive: true });

      // Save the original file to the 'public' folder
      await fs.writeFile(filePath, file.data);

      // Conditionally convert GIF to PNG using sharp
      if (file.mimetype === "image/gif") {
        const pngFilePath = path
          .join(
            "public",
            Date.now() + "-" + actualFileName.replace(/\.gif$/, ".png"),
          )
          .replace(/\\/g, "/");
        await sharp(file.data).toFile(pngFilePath);
        file.mimetype = "image/png"; // Update the mimetype to PNG
        filePath = pngFilePath;
      }

      // Create a media document in your MongoDB collection
      const fileType = file.mimetype;
      const mediaData: Media = {
        type: fileType,
        fileName: actualFileName,
        filepath: filePath.replace(/^public\//, ""),
      };
      const createdMedia = await mediaModel.create(mediaData);

      // Return the ID of the created media document
      return createdMedia._id;
    } catch (error) {
      logger.error("saveFileAndCreateMedia", error);
      return null;
    }
  }
}
