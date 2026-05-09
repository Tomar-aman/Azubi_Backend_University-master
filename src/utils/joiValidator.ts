import { type Request, type Response, type NextFunction } from "express";
import type Joi from "joi";

class JoiValidator {
  validate(schema: Joi.ObjectSchema<any>, source: "body" | "params" | "query") {
    return (req: Request, res: Response, next: NextFunction) => {
      // response the all validation errors and convert them to key value pairs and remove the fields that are not in joi schema from the body
      const { error } = schema.validate(req[source], {
        abortEarly: false,
        allowUnknown: true,
      });
      if (!!error) {
        const errors: Record<string, string> = {};
        error.details.forEach((err) => {
          errors[err.path.join(".")] = err.message;
        });
        res.sendBadRequest400Response("Validation Error", errors);
        return;
      }
      next();
    };
  }
}

export default JoiValidator;
