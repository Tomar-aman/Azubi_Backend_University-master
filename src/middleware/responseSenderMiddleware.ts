import { type Response } from "express";
import logger from "../utils/logger";
export interface ResponseType {
  status: number;
  message: string;
  data: any | null;
}
class ResponseSenderMiddleware {
  private readonly res: Response;

  constructor(res: Response) {
    this.res = res;
  }

  private sendResponse(
    status: number,
    message: string,
    data: any | null = null,
  ) {
    const response = {
      status,
      message,
      data,
    };
    this.res.status(status).json(response);
  }

  public sendSuccess200Response(message: string, data: any | null = null) {
    logger.info({ url: this.res.req.url, status: 200, message, data });
    this.sendResponse(200, message, data);
  }

  public sendCreated201Response(message: string, data: any | null = null) {
    logger.info({ url: this.res.req.url, status: 201, message, data });
    this.sendResponse(201, message, data);
  }

  public sendNoContent204Response() {
    logger.info({ url: this.res.req.url, status: 204 });
    this.res.status(204).end();
  }

  public sendNotFound404Response(
    message: string = "Not Found",
    data: any | null = null,
  ) {
    logger.error({ url: this.res.req.url, status: 404, message, data });
    this.sendResponse(404, message, data);
  }

  public sendForbidden403Response(
    message: string = "Forbidden",
    data: any | null = null,
  ) {
    logger.error({ url: this.res.req.url, status: 403, message, data });
    this.sendResponse(403, message, data);
  }

  public sendUnauthorized401Response(
    message: string = "Unauthorized",
    data: any | null = null,
  ) {
    logger.error({ url: this.res.req.url, status: 401, message, data });
    this.sendResponse(401, message, data);
  }

  public sendBadRequest400Response(
    message: string = "Bad Request",
    data: any | null = null,
  ) {
    logger.error({ url: this.res.req.url, status: 400, message, data });
    this.sendResponse(400, message, data);
  }

  public sendErrorResponse(message: string, data: any | null = null) {
    logger.error({ url: this.res.req.url, status: 500, message, data });
    this.sendResponse(500, message, data);
  }

  public sendCustomSuccessResponse(
    status: number,
    message: string,
    data: any | null = null,
  ) {
    logger.info({ url: this.res.req.url, status, message, data });
    this.sendResponse(status, message, data);
  }

  public sendCustomErrorResponse(
    status: number,
    message: string,
    data: any | null = null,
  ) {
    logger.error({ url: this.res.req.url, status, message, data });
    this.sendResponse(status, message, data);
  }
}

export default ResponseSenderMiddleware;
