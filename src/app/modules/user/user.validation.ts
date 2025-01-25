import { z } from 'zod';

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ invalid_type_error: 'Name must be a string' }).optional(),
    profileImg: z.string().optional(),
    phone: z
      .string({ invalid_type_error: 'Phone number must be a string' })
      .optional(),
    address: z
      .string({ invalid_type_error: 'Address must be a string' })
      .optional(),
    city: z.string({ invalid_type_error: 'City must be a string' }).optional(),
  }),
});

export const userValidations = {
  updateUserValidationSchema,
};
