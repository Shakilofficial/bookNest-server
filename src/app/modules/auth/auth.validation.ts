import { z } from 'zod';

// Validation schemas for register and login operations
// Register validation schema for registering a new user
const registerValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email'),
    password: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    }),
  }),
});

// Login validation schema for logging in a registered user
const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email'),
    password: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    }),
  }),
});

export const authValidations = {
  registerValidationSchema,
  loginValidationSchema,
};
