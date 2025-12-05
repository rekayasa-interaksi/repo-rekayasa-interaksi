import { z } from 'zod';
import {
  MajorCampusFormSchema,
  MajorCampusMutationResponseSchema,
  MajorCampusSchema,
} from './schemas';

export type MajorCampus = z.infer<typeof MajorCampusSchema>;
export type MajorCampusDetail = MajorCampus;

export type MajorCampusFormData = z.infer<typeof MajorCampusFormSchema>;

export type MajorCampusMutationResponse = z.infer<typeof MajorCampusMutationResponseSchema>;
