import { Vine } from "@vinejs/vine";

const vine = new Vine();

// Schema for single reviewer assignment
export const assignReviewerSchema = vine.object({
  reviewer_id: vine.number().positive(),
  paper_id: vine.number().positive().optional(),
  proposal_id: vine.number().positive().optional(),
  deadline: vine.date().optional(),
});

// Schema for bulk reviewer assignments
export const bulkAssignmentSchema = vine.object({
  assignments: vine.array(
    vine.object({
      item_id: vine.number().positive(), // paper_id or proposal_id
      item_type: vine.enum(['paper', 'proposal']),
      reviewer_ids: vine.array(vine.number().positive()).minLength(1).maxLength(5), // Max 5 reviewers per item
    })
  ).minLength(1).maxLength(20), // Max 20 assignments at once
});

// Schema for auto-match request
export const autoMatchSchema = vine.object({
  item_id: vine.number().positive(),
  item_type: vine.enum(['paper', 'proposal']),
  max_reviewers: vine.number().positive().optional(),
});

// Schema for assignment update
export const assignmentUpdateSchema = vine.object({
  status: vine.enum(['ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).optional(),
  deadline: vine.date().optional(),
  priority: vine.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
});

// Schema for reassignment
export const reassignmentSchema = vine.object({
  old_reviewer_id: vine.number().positive(),
  new_reviewer_id: vine.number().positive(),
  reason: vine.string().maxLength(500).optional(),
});
