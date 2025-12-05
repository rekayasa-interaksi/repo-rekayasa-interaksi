import { z } from 'zod';
import {
  StudentClubFormSchema,
  StudentClubMutationResponseSchema,
  StudentClubSchema,
} from './schemas';

export type StudentClub = z.infer<typeof StudentClubSchema>;
export type StudentClubDetail = StudentClub;

export type StudentClubFormData = z.infer<ReturnType<typeof StudentClubFormSchema>>;

export type StudentClubMutationResponse = z.infer<typeof StudentClubMutationResponseSchema>;
