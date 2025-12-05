import { z } from 'zod';
import {
  StudentChapterFormSchema,
  StudentChapterMutationResponseSchema,
  StudentChapterSchema,
} from './schemas';

export type StudentChapter = z.infer<typeof StudentChapterSchema>;
export type StudentChapterDetail = StudentChapter;

export type StudentChapterFormData = z.infer<ReturnType<typeof StudentChapterFormSchema>>;

export type StudentChapterMutationResponse = z.infer<typeof StudentChapterMutationResponseSchema>;
