import { z } from 'zod';

export const StudentClubSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  image_url: z.string().nullable(),
  logo_url: z.string().nullable(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const StudentClubListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(StudentClubSchema),
});

export const StudentClubDetailResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: StudentClubSchema,
});

export const StudentClubMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const StudentClubFormSchema = (isEditing: boolean) =>
  z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name cannot be empty')
      .max(255, 'Name cannot exceed 255 characters'),
    description: z
      .string({ required_error: 'Description is required' })
      .min(1, 'Description cannot be empty')
      .max(500, 'Description cannot exceed 500 characters'),
    logo: isEditing
      ? z
          .instanceof(File)
          .refine((file) => file.size <= 1 * 1024 * 1024, 'Logo must be less than 1MB')
          .refine(
            (file) => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type),
            'Logo must be WEBP, JPG, JPEG, or PNG',
          )
          .optional()
      : z
          .instanceof(File, { message: 'Logo is required' })
          .refine((file) => file.size <= 1 * 1024 * 1024, 'Logo must be less than 1MB')
          .refine(
            (file) => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type),
            'Logo must be WEBP, JPG, JPEG, or PNG',
          ),
    image: isEditing
      ? z
          .instanceof(File)
          .refine((file) => file.size <= 1 * 1024 * 1024, 'Image must be less than 1MB')
          .refine(
            (file) => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type),
            'Image must be WEBP, JPG, JPEG, or PNG',
          )
          .optional()
      : z
          .instanceof(File, { message: 'Image is required' })
          .refine((file) => file.size <= 1 * 1024 * 1024, 'Image must be less than 1MB')
          .refine(
            (file) => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type),
            'Image must be WEBP, JPG, JPEG, or PNG',
          ),
  });
