import Joi from "joi";

export const editKeyValidator = Joi.object({
  hostKey: Joi.string().required(),
  portKey: Joi.string().required(),
  pushNotificationKey: Joi.string().required(),
});
