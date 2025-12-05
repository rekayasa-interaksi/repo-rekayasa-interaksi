import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createFaq,
  deleteFaq,
  getFaqById,
  getFaq,
  updateFaq,
  updateFaqAnswer,
} from './services';

import type {
  Faq,
  FaqAnswerFormData,
  FaqFormData,
} from './types';

export const FaqKeys = {
  all: ['faq'] as const,
  list: () => [...FaqKeys.all, 'list'] as const,
  detail: (id: string) => [...FaqKeys.all, 'detail', id] as const,
};

export function useFaqes() {
  return useQuery<Faq[]>({
    queryKey: FaqKeys.list(),
    queryFn: getFaq,
    placeholderData: (prev) => prev,
  });
}

export function useFaq(id: string) {
  return useQuery({
    queryKey: FaqKeys.detail(id),
    queryFn: () => getFaqById(id),
    enabled: !!id,
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FaqFormData) => createFaq(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FaqKeys.list() });
      toast.success('Faq berhasil dibuat');
    },
    onError: () => {
      toast.error('Gagal membuat Faq');
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FaqFormData }) =>
      updateFaq(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: FaqKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: FaqKeys.list() });
      toast.success('Faq berhasil diubah');
    },
    onError: () => {
      toast.error('Gagal mengubah Faq');
    },
  });
}

export function useUpdateFaqAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FaqAnswerFormData }) => {
      console.log('Updating FAQ answer:', id, payload);
      return updateFaqAnswer(id, payload);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: FaqKeys.list() });
      queryClient.invalidateQueries({ queryKey: FaqKeys.detail(id) });
      toast.success('Jawaban FAQ berhasil diperbarui');
    },
    onError: (error) => {
      console.error('Update FAQ answer error:', error);
      toast.error('Gagal memperbarui jawaban FAQ');
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FaqKeys.list() });
      toast.success('Faq berhasil dihapus');
    },
    onError: () => {
      toast.error('Gagal menghapus Faq');
    },
  });
}
