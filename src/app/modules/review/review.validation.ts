import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number({ invalid_type_error: 'Rating must be a number' }).int(),
    comment: z.string({ invalid_type_error: 'Comment must be a string' }),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z
      .number({ invalid_type_error: 'Rating must be a number' })
      .int()
      .optional(),
    comment: z
      .string({ invalid_type_error: 'Comment must be a string' })
      .optional(),
  }),
});

export const reviewValidations = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};
