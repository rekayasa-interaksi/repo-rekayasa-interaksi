import { z } from 'zod';
import {
  DomisiliListResponseSchema,
  DomisiliSchema,
  StudentCampusListResponseSchema,
  StudentCampusSchema,
  StudentClubListResponseSchema,
  StudentClubSchema,
  StudentChapterListResponseSchema,
  StudentChapterSchema,
  UserMutationResponseSchema,
  UsersListResponseSchema,
  UserSchema,
  RoleSchema,
  RoleListResponseSchema,
} from './schemas';

export type User = z.infer<typeof UserSchema>;
export type Domisili = z.infer<typeof DomisiliSchema>;
export type StudentCampus = z.infer<typeof StudentCampusSchema>;
export type StudentClub = z.infer<typeof StudentClubSchema>;
export type StudentChapter = z.infer<typeof StudentChapterSchema>;
export type Role = z.infer<typeof RoleSchema>;

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type DomisiliListResponse = z.infer<typeof DomisiliListResponseSchema>;
export type StudentCampusListResponse = z.infer<typeof StudentCampusListResponseSchema>;
export type StudentClubListResponse = z.infer<typeof StudentClubListResponseSchema>;
export type RoleListResponse = z.infer<typeof RoleListResponseSchema>;
export type StudentChapterListResponse = z.infer<typeof StudentChapterListResponseSchema>;
export type UserMutationResponse = z.infer<typeof UserMutationResponseSchema>;