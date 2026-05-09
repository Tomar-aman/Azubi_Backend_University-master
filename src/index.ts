import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // Fix: Node v18+ defaults to IPv6, breaking Atlas SRV
import express from "express";
import dotenv from "dotenv";
import router from "./router";
import path from "path";
import emailService from "./utils/emailService";
import fileUpload from "express-fileupload";
import logger from "./utils/logger";
import setupGlobalCustomMiddleware from "./middleware";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const PORT = process.env.PORT ?? 4000;

const handleMongo = async () => {
  const mongoUri = process.env.mongoURI;
  if (mongoUri == null || mongoUri.trim() === "") {
    throw new Error("Missing mongoURI in environment variables");
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // Force IPv4 — fixes DNS SRV resolution on Node v18+
    });
    logger.info("Database is connected successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("MongoDB connection error:", message);
    throw error;
  }
};

const app = express();

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

setupGlobalCustomMiddleware(app);

app.use(fileUpload());

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  );
  next();
});

app.get("/", (_req, res) => {
  res.sendSuccess200Response("Yay!", null);
});

router.forEach((route) => {
  app.use(`/api/v1${route.prefix}`, route.router);
});

const bootstrap = async () => {
  try {
    await handleMongo();
    await emailService.init();
    await emailService.verifyConnection();

    app.listen(PORT, () => {
      logger.info(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Application startup failed:", message);
    process.exit(1);
  }
};

void bootstrap();
