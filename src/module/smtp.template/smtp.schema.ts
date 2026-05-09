import Joi from "joi";

export const smtpUpdateValidator = Joi.object({
  host: Joi.string().required(),
  port: Joi.number().required(),
  userName: Joi.string().email().required(),
  password: Joi.string().required(),
  encryption: Joi.string().required(),
}).options({ abortEarly: false });
