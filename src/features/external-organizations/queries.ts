import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createExternalOrganization,
  deleteExternalOrganization,
  getExternalOrganizationById,
  getExternalOrganizations,
  updateExternalOrganization,
} from './services';

import type {
  ExternalOrganization,
  ExternalOrganizationFormData,
  ExternalOrganizationListResponse,
  ExternalOrganizationMutationResponse
} from './types';

interface ExternalOrganizationQueryParams {
  page?: number;
  limit?: number;
  query?: string;
}

interface MutationPayload {
  id: string;
  payload: FormData;
}

export const externalOrganizationKeys = {
  all: ['external-organizations'] as const,
  list: (params: ExternalOrganizationQueryParams) => [...externalOrganizationKeys.all, 'list', params] as const,
  detail: (id: string) => [...externalOrganizationKeys.all, 'detail', id] as const,
};

export function useExternalOrganizations(params: ExternalOrganizationQueryParams) {
  return useQuery<ExternalOrganizationListResponse, Error>({
    queryKey: externalOrganizationKeys.list(params),
    queryFn: () => getExternalOrganizations(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useExternalOrganization(id: string) {
  return useQuery({
    queryKey: externalOrganizationKeys.detail(id),
    queryFn: () => getExternalOrganizationById(id),
    enabled: !!id,
  });
}

export function useCreateExternalOrganization() {
  const queryClient = useQueryClient();

  return useMutation<ExternalOrganizationMutationResponse, Error, FormData>({
    mutationFn: (payload: FormData) => createExternalOrganization(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: externalOrganizationKeys.all });
      toast.success('external organization created successfully');
    },
    onError: () => {
      toast.error('Failed to create external organization');
    },
  });
}

export function useUpdateExternalOrganization() {
  const queryClient = useQueryClient();

  return useMutation<ExternalOrganizationMutationResponse, Error, MutationPayload>({
    mutationFn: ({ id, payload }: MutationPayload) => updateExternalOrganization(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: externalOrganizationKeys.all });
      toast.success('external organization updated successfully');
    },
    onError: () => {
      toast.error('Failed to update external organization');
    },
  });
}

export function useDeleteExternalOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExternalOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: externalOrganizationKeys.all });
      toast.success('external organization berhasil dihapus');
    },
    onError: () => {
      toast.error('Gagal menghapus external organization');
    },
  });
}
