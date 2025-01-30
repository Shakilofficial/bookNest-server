import { z } from 'zod';

// Create Product Validation Schema
const createProductValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    price: z.number().nonnegative().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    coverImage: z.string().optional(),
    quantity: z.number().int().optional(),
  }),
});

// Update Product Validation Schema
const updateProductValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    price: z.number().nonnegative().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    coverImage: z.string().optional(),
    quantity: z.number().int().optional(),
  }),
});

export const productValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
