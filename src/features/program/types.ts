import { z } from 'zod';
import {
  ProgramFormSchema,
  ProgramMutationResponseSchema,
  ProgramSchema,
} from './schemas';

export type Program = z.infer<typeof ProgramSchema>;
export type ProgramDetail = Program;

export type ProgramFormData = z.infer<typeof ProgramFormSchema>;

export type ProgramMutationResponse = z.infer<typeof ProgramMutationResponseSchema>;
