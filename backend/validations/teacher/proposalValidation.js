// validations/proposalValidation.js
import vine from '@vinejs/vine'

export const proposalValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(5).maxLength(200),
    abstract: vine.string().trim().maxLength(1000).optional(),
    team_id: vine.number().positive(),
<<<<<<< HEAD:backend/validations/proposalValidation.js
    domain_id: vine.number().positive().optional(),
=======
>>>>>>> origin/trisha-feature-BE-fix:backend/validations/teacher/proposalValidation.js
    status: vine.enum(["PENDING","ACCEPTED","REJECTED","UNDER_REVIEW"]).optional(),
  })
)
