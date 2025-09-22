// validations/proposalValidation.js
import vine from '@vinejs/vine'

export const proposalValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(5).maxLength(200),
    abstract: vine.string().trim().maxLength(1000).optional(),
    team_id: vine.number().positive(),
    status: vine.enum(["PENDING","COMPLETED","UNDER_REVIEW"]).optional(),
  })
)
