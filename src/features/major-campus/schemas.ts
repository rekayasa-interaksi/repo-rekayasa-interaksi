import { z } from 'zod';

export const MajorCampusSchema = z.object({
  id: z.string().uuid(),
  major: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const MajorCampusListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(MajorCampusSchema),
});

export const MajorCampusDetailResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: MajorCampusSchema,
});

export const MajorCampusMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const MajorCampusFormSchema = z.object({
  major: z
    .string({ required_error: 'Major is required' })
    .min(1, 'Major cannot be empty')
    .max(255, 'Major cannot exceed 255 characters'),
});
