// validations/reviewer/reviewValidation.js
import { Vine } from "@vinejs/vine";
import { errors } from "@vinejs/vine";
import {CustomErrorReporter} from "../CustomErrorReporter.js";

const vine = new Vine();
vine.errorReporter = () => new CustomErrorReporter();

export const reviewSchema = 
  vine.object({
    originality: vine.number().min(0).max(10),
    methodology: vine.number().min(0).max(10),
    clarity: vine.number().min(0).max(10),
    relevance: vine.number().min(0).max(10),
    presentation: vine.number().min(0).max(10),
    feedback: vine.string().trim().minLength(5),
    decision: vine.enum([
      "ACCEPT",
      "MINOR_REVISIONS",
      "MAJOR_REVISIONS",
      "REJECT",
    ]),
  });
