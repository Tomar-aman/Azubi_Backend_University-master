import mongoose from "mongoose";
import logger from "./logger";

export class Database {
  private readonly mongoURI: string;
  constructor(uri: string) {
    this.mongoURI = uri;
  }

  async connect() {
    await mongoose
      .connect(this.mongoURI, {
        connectTimeoutMS: 30000,
      })
      .then(() => {
        logger.info("Database connection successful");
      })
      .catch((err) => {
        logger.error("Database connection error", err);
      });
  }
}
