import { z } from 'zod';

export const StudentCampusSchema = z.object({
  id: z.string().uuid(),
  institute: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const StudentCampusListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(StudentCampusSchema),
});

export const StudentCampusDetailResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: StudentCampusSchema,
});

export const StudentCampusMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const StudentCampusFormSchema = z.object({
  institute: z
    .string({ required_error: 'Institute is required' })
    .min(1, 'Institute cannot be empty')
    .max(255, 'Institute cannot exceed 255 characters'),
});
