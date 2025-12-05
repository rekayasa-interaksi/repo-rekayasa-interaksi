import { z } from 'zod';
import {
  OrganizationalStructureFormSchema,
  OrganizationalStructureMutationResponseSchema,
  OrganizationalStructureSchema,
  StudentClubSchema,
  StudentChapterSchema,
  SocialMediaSchema,
  UserSchema,
} from './schemas';

export type OrganizationalStructure = z.infer<typeof OrganizationalStructureSchema>;
export type OrganizationalStructureDetail = OrganizationalStructure;
export type OrganizationalStructureFormData = z.infer<typeof OrganizationalStructureFormSchema>;
export type OrganizationalStructureMutationResponse = z.infer<
  typeof OrganizationalStructureMutationResponseSchema
>;
export type StudentClub = z.infer<typeof StudentClubSchema>;
export type StudentChapter = z.infer<typeof StudentChapterSchema>;
export type SocialMedia = z.infer<typeof SocialMediaSchema>;
export type User = z.infer<typeof UserSchema>;