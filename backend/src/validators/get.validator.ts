import { blockSpecialChars, sanitizeSpecialChars } from "@/helpers/checkChar";
import Joi from "joi";

// validate params
export const ParamsBlogsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const ParamsUsersSchema = Joi.object({
  username: Joi.string().custom(sanitizeSpecialChars).required(),
});

// validate query
export const QueryBlogsSchema = Joi.object({
  tag: Joi.string().custom(blockSpecialChars).optional(),
  search: Joi.string().custom(blockSpecialChars).optional(),
  author: Joi.string().custom(blockSpecialChars).optional(),
  eliminate_blog: Joi.string().optional(),
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1).required(),
});

export const QueryUsersShema = Joi.object({
  usename: Joi.string().custom(sanitizeSpecialChars).required(),
  limit: Joi.number().integer().min(1).required(),
});
