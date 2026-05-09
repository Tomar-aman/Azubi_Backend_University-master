import Joi from "joi";

export const updateProfileValidator = Joi.object({
  newPassword: Joi.string().min(6).optional(),
  oldPassword: Joi.string().min(6).optional(),
  email: Joi.string().email().optional(),
  username: Joi.string().min(3).optional(),
});
