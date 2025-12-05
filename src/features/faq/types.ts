import { z } from 'zod';
import {
  FaqAnswerFormSchema,
  FaqFormSchema,
  FaqMutationResponseSchema,
  FaqSchema,
} from './schemas';

export type Faq = z.infer<typeof FaqSchema>;
export type FaqDetail = Faq;

export type FaqFormData = z.infer<typeof FaqFormSchema>;

export type FaqMutationResponse = z.infer<typeof FaqMutationResponseSchema>;

export type FaqAnswerFormData = z.infer<typeof FaqAnswerFormSchema>;