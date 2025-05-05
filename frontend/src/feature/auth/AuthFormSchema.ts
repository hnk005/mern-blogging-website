// src/schemas/authSchemas.ts
import * as Yup from "yup";
import { passwordRegex } from "@/regex";

export const SignUpSchema = Yup.object({
  fullname: Yup.string()
    .min(3, "Full Name must be at least 3 characters")
    .max(50, "Full Name must be at most 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Full Name must contain only letters and spaces")
    .required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters")
    .matches(
      passwordRegex,
      "Password must include uppercase, lowercase and number"
    )
    .required("Password is required"),
});

export const SignInSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});
