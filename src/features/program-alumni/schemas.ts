import { z } from 'zod';

export const ProgramAlumniSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const ProgramAlumniListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(ProgramAlumniSchema),
});

export const ProgramAlumniDetailResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: ProgramAlumniSchema,
});

export const ProgramAlumniMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const ProgramAlumniFormSchema = z.object({
  name: z
    .string({ required_error: 'Program Alumni Name is required' })
    .min(1, 'Program Alumni Name cannot be empty')
    .max(255, 'Program Alumni Name cannot exceed 255 characters'),
});
