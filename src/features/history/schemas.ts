import { create } from 'domain';
import { z } from 'zod';

export const HistorySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  date: z.string().datetime(),
  image_path: z.string().url().nullable(),
  image_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
  created_by: z.string().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().nullable(),
});

export const HistoriesListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(HistorySchema),
  metaData: z.object({
    page: z.number(),
    limit: z.number(),
    totalData: z.number(),
    totalPage: z.number(),
  }),
});

export const HistoryMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const HistoryFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Tanggal harus dalam format YYYY-MM-DD'),
  image: z
    .instanceof(File)
    .refine((file) => file.type.startsWith('image/'), 'Hanya file gambar yang diperbolehkan'),
});

export const HistoryEditFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Tanggal harus dalam format YYYY-MM-DD'),
  image: z.instanceof(File).optional().nullable(),
});