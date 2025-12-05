import { z } from 'zod';

export const ProgramSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const ProgramListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(ProgramSchema),
});

export const ProgramDetailResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: ProgramSchema,
});

export const ProgramMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const ProgramFormSchema = z.object({
  name: z
    .string({ required_error: 'Program Name is required' })
    .min(1, 'Program Name cannot be empty')
    .max(255, 'Program Name cannot exceed 255 characters'),
});
