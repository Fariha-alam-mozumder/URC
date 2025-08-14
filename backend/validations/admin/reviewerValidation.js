import vine from "@vinejs/vine";

// Validation schema for inviting reviewers
export const inviteReviewersSchema = vine.object({
  reviewer_ids: vine
    .array(vine.number().positive())
    .minLength(1)
    .maxLength(50), // Reasonable limit
  custom_message: vine
    .string()
    .maxLength(1000) // Reasonable limit for custom message
    .optional()
});

// Validation schema for adding a reviewer manually
export const addReviewerSchema = vine.object({
  teacher_id: vine.number().positive(),
  domain_ids: vine
    .array(vine.number().positive())
    .maxLength(20) // Reasonable limit for domains
    .optional()
});

// Validation schema for updating reviewer status
export const updateReviewerStatusSchema = vine.object({
  status: vine.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'])
});

// Validation schema for reviewer preferences
export const reviewerPreferencesSchema = vine.object({
  domain_ids: vine
    .array(vine.number().positive())
    .minLength(1)
    .maxLength(20) // Reasonable limit for domains
});

// Validation schema for bulk operations
export const bulkStatusUpdateSchema = vine.object({
  reviewer_ids: vine
    .array(vine.number().positive())
    .minLength(1)
    .maxLength(100), // Reasonable limit for bulk operations
  status: vine.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'])
});

// Validation schema for workload assignment limits
export const workloadLimitsSchema = vine.object({
  reviewer_id: vine.number().positive(),
  max_assignments: vine.number().min(0).max(20), // Reasonable range
  max_weekly_assignments: vine.number().min(0).max(10) // Reasonable range
});