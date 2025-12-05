import { z } from 'zod';
import {
  ExternalOrganizationFormSchema,
  ExternalOrganizationListResponseSchema,
  ExternalOrganizationMutationResponseSchema,
  ExternalOrganizationSchema,
} from './schemas';

export type ExternalOrganization = z.infer<typeof ExternalOrganizationSchema>;
export type ExternalOrganizationListResponse = z.infer<typeof ExternalOrganizationListResponseSchema>;
export type ExternalOrganizationDetail = ExternalOrganization;

export type ExternalOrganizationFormData = z.infer<ReturnType<typeof ExternalOrganizationFormSchema>>;

export type ExternalOrganizationMutationResponse = z.infer<typeof ExternalOrganizationMutationResponseSchema>;
