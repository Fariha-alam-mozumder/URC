import { Vine } from "@vinejs/vine";

const vine = new Vine();

export const recentSubmissionSchema = vine.object({
  type: vine.enum(["PAPER", "PROPOSAL"]).optional(), // filter by type
  startDate: vine.string().optional(), // optional date filter (ISO format)
  endDate: vine.string().optional(),
  teamId: vine.number().optional(), // optional filter by team
});
