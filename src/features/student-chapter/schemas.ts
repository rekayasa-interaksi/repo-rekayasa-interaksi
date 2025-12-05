import { z } from 'zod';

export const StudentChapterSchema = z.object({
  id: z.string().uuid(),
  institute: z.string(),
  address: z.string(),
  image_url: z.string().nullable(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const StudentChapterListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(StudentChapterSchema),
});

export const StudentChapterDetailResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: StudentChapterSchema,
});

export const StudentChapterMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const StudentChapterFormSchema = (isEditing: boolean) =>
  z.object({
    institute: z
      .string({ required_error: 'Institute is required' })
      .min(1, 'Institute cannot be empty')
      .max(255, 'Institute cannot exceed 255 characters'),
    address: z
      .string({ required_error: 'Address is required' })
      .min(1, 'Address cannot be empty')
      .max(500, 'Address cannot exceed 500 characters'),
    image: isEditing
      ? z
          .instanceof(File)
          .refine((file) => file.size <= 5 * 1024 * 1024, 'Image must be less than 5MB')
          .refine(
            (file) => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type),
            'Image must be WEBP, JPG, JPEG, or PNG',
          )
          .optional()
      : z
          .instanceof(File, { message: 'Image is required' })
          .refine((file) => file.size <= 5 * 1024 * 1024, 'Image must be less than 5MB')
          .refine(
            (file) => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type),
            'Image must be WEBP, JPG, JPEG, or PNG',
          ),
  });