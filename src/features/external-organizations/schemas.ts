import { z } from 'zod';

export const ExternalOrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  image_url: z.string().nullable(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const ExternalOrganizationListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(ExternalOrganizationSchema),
  metaData: z.object({
    page: z.number(),
    limit: z.number(),
    totalData: z.number(),
    totalPage: z.number(),
  }),
});

export const ExternalOrganizationDetailResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: ExternalOrganizationSchema,
});

export const ExternalOrganizationMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const ExternalOrganizationFormSchema = (isEditing: boolean) =>
  z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name cannot be empty')
      .max(255, 'Name cannot exceed 255 characters'),
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
