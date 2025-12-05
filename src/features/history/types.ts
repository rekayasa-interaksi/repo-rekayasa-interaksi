import { z } from 'zod';
import {
  HistoriesListResponseSchema,
  HistoryEditFormSchema,
  HistoryFormSchema,
  HistoryMutationResponseSchema,
  HistorySchema,
} from './schemas';

export type HistoriesListResponse = z.infer<typeof HistoriesListResponseSchema>;
export type HistoryMutationResponse = z.infer<typeof HistoryMutationResponseSchema>;

type HistoryFormSchemaType = typeof HistoryFormSchema | typeof HistoryEditFormSchema;
export type HistoryFormData = z.infer<HistoryFormSchemaType>;
export type History = z.infer<typeof HistorySchema>;