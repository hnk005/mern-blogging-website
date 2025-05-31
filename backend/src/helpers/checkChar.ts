import Joi from "joi";

const specialChar = /[<>"'`;(){}\[\]$%&]/g;

export const blockSpecialChars = (
  value: string,
  helpers: Joi.CustomHelpers
) => {
  if (specialChar.test(value)) {
    return helpers.error("string.invalidChar", { value });
  }
  return value;
};

export const sanitizeSpecialChars = (value: string) => {
  return value.replace(specialChar, "");
};
