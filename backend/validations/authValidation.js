import { Vine } from "@vinejs/vine";
import { CustomErrorReporter } from "./CustomErrorReporter.js";
//! CustomErrorReporter can be used in either authValidation.js (where we declare the schema) -- globally
//! or in AuthController.js

const vine = new Vine();
vine.errorReporter = new CustomErrorReporter(); //* Global declaration of the custom error reporter

export const registerSchema = vine.object({
  name: vine.string().minLength(2).maxLength(150),
  email: vine.string().email(),
  password: vine.string().minLength(2).maxLength(100).confirmed(),
  password_confirmation: vine.string(),
  role: vine.enum(["GENERALUSER", "TEACHER", "STUDENT"]),
  department_name: vine.string().optional(),
  roll_number: vine.string().optional(),
  designation: vine.string().optional(),
});


export const loginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string(),
});