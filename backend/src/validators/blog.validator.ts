import Joi from "joi";

export const BlogSchema = Joi.object({
  blog_id: Joi.string(),
  title: Joi.string().required().messages({
    "string.empty": "You must provide a title to publish the blog",
  }),

  draft: Joi.boolean().required(),

  des: Joi.when("draft", {
    is: false,
    then: Joi.string().max(200).required().messages({
      "string.empty": "You must provide a description",
      "string.max":
        "You must provide a description with less than 200 characters",
    }),
    otherwise: Joi.any().strip(), // Xoá luôn nếu là draft
  }),

  banner: Joi.when("draft", {
    is: false,
    then: Joi.string().required().messages({
      "string.empty": "You must provide blog banner to publish it",
      "any.required": "You must provide blog banner to publish it",
    }),
    otherwise: Joi.any().strip(),
  }),

  content: Joi.when("draft", {
    is: false,
    then: Joi.object({
      blocks: Joi.array().min(1).required().messages({
        "array.base": "Content must be an array of blocks",
        "array.min": "There must be some blog content to publish it",
      }),
      time: Joi.number(),
      version: Joi.string(),
    })
      .required()
      .messages({
        "object.base": "Content must be an object",
      }),
    otherwise: Joi.any().strip(),
  }),

  tags: Joi.when("draft", {
    is: false,
    then: Joi.array()
      .items(Joi.string().min(1).lowercase())
      .min(1)
      .max(10)
      .required()
      .messages({
        "array.base": "Tags must be an array",
        "array.empty": "You must provide tags",
        "array.min": "At least 1 tag is required",
        "array.max": "Maximum 10 tags allowed",
        "any.required": "You must provide tags",
      }),
    otherwise: Joi.any().strip(),
  }),
});
