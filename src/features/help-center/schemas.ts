import { z } from 'zod';

export const HelpCenterSchema = z.object({
  id: z.string().uuid(),
  question: z.string(),
  email: z.string(),
  status: z.boolean(),
  answer: z.string().nullable(),
  created_at: z.string().datetime(),
});

export const HelpCenterListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(HelpCenterSchema),
  metaData: z.object({
    page: z.number(),
    limit: z.number(),
    totalData: z.number(),
    totalPage: z.number(),
  }),
});

export const HelpCenterDetailResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: HelpCenterSchema,
});

export const HelpCenterMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});