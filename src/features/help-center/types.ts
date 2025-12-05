import { z } from 'zod';
import {
  HelpCenterSchema,
  HelpCenterMutationResponseSchema,
  HelpCenterDetailResponseSchema,
  HelpCenterListResponseSchema,
} from './schemas';

export type HelpCenter = z.infer<typeof HelpCenterSchema>;
export type HelpCenterListResponse = z.infer<typeof HelpCenterListResponseSchema>;
export type HelpCenterDetail = HelpCenter;
export type HelpCenterFormData = z.infer<typeof HelpCenterSchema>;

export type HelpCenterMutationResponse = z.infer<typeof HelpCenterMutationResponseSchema>;