import { z } from 'zod';

export const FaqSchema = z.object({
  id: z.string().uuid(),
  question: z.string(),
  answer: z.string(),
  show: z.boolean(),
  menu: z.string(),
  created_at: z.string().datetime(),
});

export const FaqListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(FaqSchema),
});

export const FaqDetailResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: FaqSchema,
});

export const FaqMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const FaqFormSchema = z.object({
  question: z
    .string({ required_error: 'Pertanyaan wajib diisi' })
    .min(1, 'Pertanyaan tidak boleh kosong'),
  answer: z
    .string({ required_error: 'Jawaban wajib diisi' })
    .min(1, 'Jawaban tidak boleh kosong'),
  show: z.boolean().default(false),
  menu: z.string().min(1, 'Menu tidak boleh kosong'),
});

export const FaqAnswerFormSchema = z.object({
  answer: z
    .string({ required_error: 'Jawaban wajib diisi' })
    .min(1, 'Jawaban tidak boleh kosong'),
});