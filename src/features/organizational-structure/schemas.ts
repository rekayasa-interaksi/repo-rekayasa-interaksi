import { z } from 'zod';

export const StudentClubSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.string().datetime(),
});

export const StudentChapterSchema = z.object({
  id: z.string().uuid(),
  institute: z.string(),
  address: z.string().optional(),
  image_path: z.string().optional(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
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

export const OrganizationalStructureSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.enum(['digistar_club', 'student_club', 'campus_chapter']),
  position: z.string(),
  generation: z.string(),
  image_path: z.string().optional(),
  image_url: z.string().optional(),
  student_club: StudentClubSchema.nullable(),
  student_chapter: StudentChapterSchema.nullable(),
  social_media: SocialMediaSchema.nullable(),
  user: UserSchema.nullable(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const OrganizationalStructureListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(OrganizationalStructureSchema),
});

export const OrganizationalStructureDetailResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: OrganizationalStructureSchema,
});

export const OrganizationalStructureMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});

export const OrganizationalStructureFormSchema = z.object({
  generation: z
    .string({ required_error: 'Generation is required' })
    .min(1, 'Generation cannot be empty')
    .max(255, 'Generation cannot exceed 255 characters'),
  type: z
    .enum(['digistar_club', 'student_club', 'campus_chapter'], {
      required_error: 'Type is required',
    }),
  position: z
    .string({ required_error: 'Position is required' })
    .min(1, 'Position cannot be empty')
    .max(255, 'Position cannot exceed 255 characters'),
  image: z.instanceof(File).optional(),
  student_club_id: z.string().optional(),
  student_chapter_id: z.string().optional(),
  user_id: z.string(),
});

export const StudentClubListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(StudentClubSchema),
});

export const UserListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(UserSchema),
});

export const StudentChapterListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(StudentChapterSchema),
});