import { z } from 'zod';

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

export const DomisiliSchema = z.object({
  id: z.string().uuid(),
  domisili: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const StudentCampusSchema = z.object({
  id: z.string().uuid(),
  institute: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const MajorCampusSchema = z.object({
  id: z.string().uuid(),
  major: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const StudentClubSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const StudentChapterSchema = z.object({
  id: z.string().uuid(),
  institute: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const RoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  menu: z.string(),
});

export const ProgramAlumniSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  unique_number: z.string(),
  email: z.string().email(),
  name: z.string(),
  program_alumni: ProgramAlumniSchema.nullable(),
  student_club: StudentClubSchema.nullable(),
  student_campus: StudentCampusSchema.nullable(),
  major_campus: MajorCampusSchema.nullable(),
  domisili: DomisiliSchema.nullable(),
  social_media: SocialMediaSchema.nullable(),
  student_chapter: StudentChapterSchema.nullable(),
  role: RoleSchema.nullable(),
  created_at: z.string().datetime(),
  is_active: z.boolean(),
  is_validate: z.boolean(),
});

export const UsersListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(UserSchema),
  metaData: z.object({
    page: z.number(),
    limit: z.number(),
    totalData: z.number(),
    totalPage: z.number(),
  }),
});

export const DomisiliListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(DomisiliSchema),
});

export const StudentCampusListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(StudentCampusSchema),
});

export const StudentClubListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(StudentClubSchema),
});

export const StudentChapterListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(StudentChapterSchema),
});

export const RoleListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(RoleSchema),
});

export const UserMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});