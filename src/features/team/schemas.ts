import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.string().datetime(),
});

export const SocialMediaSchema = z.object({
  id: z.string().uuid(),
  instagram: z.string().nullable(),
  linkedin: z.string().nullable(),
  telegram: z.string().nullable(),
  whatsapp: z.string().nullable(),
  mail: z.string().email().nullable(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const TeamSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  role: z.string(),
  generation: z.string(),
  user_id: z.string().nullable(),
  image_path: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  social_media: SocialMediaSchema.nullable().optional(),
  user: UserSchema.nullable().optional(),
});

export const VersionSchema = z.object({
  id: z.string().uuid(),
  version: z.string(),
  generation: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const FeatureSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  content: z.string().nullable().optional(),
  version_system_id: z.string().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const FeatureListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(FeatureSchema),
});

export const VersionListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(VersionSchema),
});

export const TeamListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(TeamSchema),
});

export const TeamDetailResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: TeamSchema,
});

export const TeamMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const VersionMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const FeatureMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const TeamFormSchema = z.object({
  generation: z
    .string({ required_error: 'Generation is required' })
    .min(1, 'Generation cannot be empty')
    .max(255, 'Generation cannot exceed 255 characters'),
  role: z
    .string({ required_error: 'Role is required' })
    .min(1, 'Role cannot be empty')
    .max(255, 'Role cannot exceed 255 characters'),
  image: z.instanceof(File).optional(),
  user_id: z.string(),
});

export const VersionFormSchema = z.object({
  generation: z
    .string({ required_error: 'Generation is required' })
    .min(1, 'Generation cannot be empty')
    .max(255, 'Generation cannot exceed 255 characters'),
  version: z
    .string({ required_error: 'Version is required' })
    .min(1, 'Version cannot be empty')
    .max(255, 'Version cannot exceed 255 characters'),
});

export const FeatureFormSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name cannot be empty')
    .max(255, 'Name cannot exceed 255 characters'),
  content: z
    .string({ required_error: 'Content is required' }),
  version_system_id: z.string({ required_error: 'Versi is required' }),
});

export const UserListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(UserSchema),
});
