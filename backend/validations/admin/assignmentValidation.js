
import vine from "@vinejs/vine";

// Validation for assigning reviewers
const assignReviewersSchema = vine.object({
    assignments: vine.array(
        vine.object({
            item_id: vine.number().positive(),
            item_type: vine.enum(['paper', 'proposal']),
            reviewer_ids: vine.array(vine.number().positive()).minLength(1).maxLength(5)
        })
    ).minLength(1)
});

// Validation for auto-match request
const autoMatchSchema = vine.object({
    item_id: vine.number().positive(),
    item_type: vine.enum(['paper', 'proposal'])
});

export { assignReviewersSchema, autoMatchSchema };