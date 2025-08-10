// validations/teamValidation.js
import vine from "@vinejs/vine";

export const teamSchema = vine.object({
  team_name: vine.string().trim().minLength(2).maxLength(100),
  team_description: vine.string().trim().maxLength(300).optional(),
  domain_id: vine.number().positive().optional(),
  status: vine.enum(["ACTIVE", "RECRUITING", "INACTIVE"]).optional(),
  visibility: vine.enum(["PUBLIC", "PRIVATE"]).optional(),
  max_members: vine.number().positive().optional(),
  isHiring: vine.boolean().optional(),

  members: vine
    .array(
      vine.object({
        user_id: vine.number().positive(),
        role_in_team: vine.enum(["TEAM_LEADER", "CO_LEADER", "MEMBER"]),
      })
    )
    .optional(),

  // Optional proposal fields
  proposal_title: vine.string().trim().maxLength(200).optional(),
  proposal_abstract: vine.string().trim().maxLength(2000).optional(),
});


// Export role enum separately if needed
export const RoleEnum = ["TEAM_LEADER", "CO_LEADER", "MEMBER"];

// import { Vine } from '@vinejs/vine';

// export const createTeamSchema = Vine.object({
//   team_name: Vine.string().minLength(3),
//   team_description: Vine.string(),
//   domain_id: Vine.number(),
//   status: Vine.enum(['ACTIVE', 'RECRUITING', 'INACTIVE']),
//   visibility: Vine.enum(['PUBLIC', 'PRIVATE']),
//   max_members: Vine.number().min(1),
//   members: Vine.array(
//     Vine.object({
//       user_id: Vine.number(),
//       role_in_team: Vine.string()
//     })
//   )
// });
