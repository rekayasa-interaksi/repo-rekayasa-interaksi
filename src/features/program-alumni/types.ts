import { z } from 'zod';
import {
  ProgramAlumniFormSchema,
  ProgramAlumniMutationResponseSchema,
  ProgramAlumniSchema,
} from './schemas';

export type ProgramAlumni = z.infer<typeof ProgramAlumniSchema>;
export type ProgramAlumniDetail = ProgramAlumni;

export type ProgramAlumniFormData = z.infer<typeof ProgramAlumniFormSchema>;

export type ProgramAlumniMutationResponse = z.infer<typeof ProgramAlumniMutationResponseSchema>;
