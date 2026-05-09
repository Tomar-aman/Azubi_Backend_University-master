import Joi from "joi";

export const createEmployerBodyValidator = Joi.object({
  industryName: Joi.string().required(),
  contactPerson: Joi.string().required(),
  jobTitle: Joi.string().required(),
  companyName: Joi.string().required(),
  email: Joi.string().email().required(),
  website: Joi.string().required(),
  phoneNo: Joi.string().required(),
  address: Joi.string().required(),
  zipCode: Joi.string().required(),
  companyDescription: Joi.string().required(),
  videoLink: Joi.any().optional(),
  city: Joi.string().required(),
  status: Joi.boolean(),
});

export const updateEmployerSchema = Joi.object({
  industryName: Joi.string().optional(),
  jobTitle: Joi.string().optional(),
  companyName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  website: Joi.string().optional(),
  phoneNo: Joi.string().optional(),
  address: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  companyLogo: Joi.any().optional(),
  companyDescription: Joi.string().optional(),
  videoLink: Joi.any().optional(),
  city: Joi.string().optional(),
  status: Joi.boolean().optional(),
  contactPerson: Joi.string().optional(),
  id: Joi.string(),
});
