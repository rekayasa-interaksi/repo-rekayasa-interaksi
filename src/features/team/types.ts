import { z } from 'zod';
import {
  TeamSchema,
  UserListResponseSchema,
  TeamDetailResponseSchema, 
  TeamListResponseSchema,
  TeamMutationResponseSchema,
  SocialMediaSchema,
  UserSchema,
  TeamFormSchema,
  VersionSchema,
  VersionFormSchema,
  VersionMutationResponseSchema,
  FeatureSchema,
  FeatureFormSchema,
  FeatureMutationResponseSchema,
} from './schemas';

export type Team = z.infer<typeof TeamSchema>;
export type Version = z.infer<typeof VersionSchema>;
export type Feature = z.infer<typeof FeatureSchema>;
export type TeamDetail = Team;
export type TeamFormData = z.infer<typeof TeamFormSchema>;
export type VersionFormData = z.infer<typeof VersionFormSchema>;
export type FeatureFormData = z.infer<typeof FeatureFormSchema>;
export type TeamMutationResponse = z.infer<
  typeof TeamMutationResponseSchema
>;
export type VersionMutationResponse = z.infer<
  typeof VersionMutationResponseSchema
>;
export type FeatureMutationResponse = z.infer<
  typeof FeatureMutationResponseSchema
>;

export type SocialMedia = z.infer<typeof SocialMediaSchema>;
export type User = z.infer<typeof UserSchema>;