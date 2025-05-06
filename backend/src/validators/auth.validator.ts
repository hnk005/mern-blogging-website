import Joi from "joi";

const fullnameRegex = /^[a-zA-Z\s]+$/;

export const SignUpSchema = Joi.object({
  fullname: Joi.string()
    .min(3)
    .max(50)
    .pattern(fullnameRegex)
    .required()
    .messages({
      "string.base": "Full Name must be a string",
      "string.empty": "Full Name is required",
      "string.min": "Full Name must be at least 3 characters",
      "string.max": "Full Name must be at most 50 characters",
      "string.pattern.base": "Full Name must contain only letters and spaces",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(6).max(32).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must be at most 32 characters",
  }),
});

export const SignInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});
