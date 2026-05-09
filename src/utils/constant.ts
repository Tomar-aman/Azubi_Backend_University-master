import fs from 'fs';
import path from 'path';
import mime from 'mime-types';


export const filePathToObject = (filePath: string) => {
  try {
    // Resolve the file path relative to the `public` directory in the root
    const newFilePath = path.resolve(`public/${filePath}`);
    // Check if the file exists and get metadata
    const fileStat = fs.statSync(newFilePath);

    // Read the file content into a buffer
    const fileBuffer = fs.readFileSync(newFilePath);

    // Extract the file name
    const fileName = path.basename(newFilePath);
    
    // Detect the MIME type dynamically
    const mimeType = mime.lookup(newFilePath) || 'application/octet-stream';

    // Create a file-like object
    const file = {
      name: fileName,                 // File name
      size: fileStat.size,            // File size in bytes
      type: mimeType,                 // MIME type
      lastModified: fileStat.mtimeMs, // Last modified timestamp in milliseconds
      buffer: fileBuffer              // File content as Buffer
    };

    // Return the file-like object
    return file;

  } catch (error) {
    console.error("Error processing file:", error);
    throw new Error("File not found or cannot be read.");
  }
};
