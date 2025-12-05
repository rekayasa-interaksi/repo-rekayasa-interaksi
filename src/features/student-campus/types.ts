import { z } from 'zod';
import {
  StudentCampusFormSchema,
  StudentCampusMutationResponseSchema,
  StudentCampusSchema,
} from './schemas';

export type StudentCampus = z.infer<typeof StudentCampusSchema>;
export type StudentCampusDetail = StudentCampus;

export type StudentCampusFormData = z.infer<typeof StudentCampusFormSchema>;

export type StudentCampusMutationResponse = z.infer<typeof StudentCampusMutationResponseSchema>;
