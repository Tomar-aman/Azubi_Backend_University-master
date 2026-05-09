import Joi from "joi";

export const createUserBodyValidator = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
export const loginUserBodyValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const generateAccessTokenFromRefreshTokenValidator = Joi.object({
  token: Joi.string().required(),
});
