import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createHistory, 
  getHistories, 
  deleteHistory, 
  updateHistory
} from './services';
import type {
  HistoriesListResponse,
  HistoryFormData, 
  HistoryMutationResponse
} from './types';

interface HistoryQueryParams {
  page?: number;
  limit?: number;
  query?: string;
  year?: string;
}

interface MutationPayload {
  id: string;
  payload: FormData,
}

export const historyKeys = {
  all: ['histories'] as const,
  list: (params: HistoryQueryParams) => [...historyKeys.all, 'list', params] as const,
  create: () => [...historyKeys.all, 'create'] as const,
  update: (id: string) => [...historyKeys.all, 'update', id] as const,
  delete: (id: string) => [...historyKeys.all, 'delete', id] as const,
};

export function useHistories(params: HistoryQueryParams) {
  return useQuery<HistoriesListResponse, Error>({
    queryKey: historyKeys.list(params),
    queryFn: () => getHistories(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useStoreHistory() {
  const queryClient = useQueryClient();
  
  return useMutation<HistoryMutationResponse, Error, FormData>({
    mutationFn: (payload: FormData) => createHistory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
      toast.success('History berhasil ditambahkan');
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menambahkan history');
    },
  });
}

export function useUpdateHistory() {
  const queryClient = useQueryClient();
  
  return useMutation<HistoryMutationResponse, Error, MutationPayload>({
    mutationFn: ({ id, payload }: MutationPayload) => updateHistory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
      toast.success('History berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal memperbarui history');
    },
  });
}

export function useDeleteHistory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
      toast.success('History berhasil dihapus');
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menghapus history');
    },
  });
}