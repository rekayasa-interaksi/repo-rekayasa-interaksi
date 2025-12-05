import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createProgram,
  deleteProgram,
  getProgramById,
  getPrograms,
  updateProgram,
} from './services';

import type {
  Program,
  ProgramFormData,
} from './types';

export const programKeys = {
  all: ['program'] as const,
  list: () => [...programKeys.all, 'list'] as const,
  detail: (id: string) => [...programKeys.all, 'detail', id] as const,
};

export function usePrograms() {
  return useQuery<Program[]>({
    queryKey: programKeys.list(),
    queryFn: getPrograms,
    placeholderData: (prev) => prev,
  });
}

export function useProgram(id: string) {
  return useQuery({
    queryKey: programKeys.detail(id),
    queryFn: () => getProgramById(id),
    enabled: !!id,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProgramFormData) => createProgram(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.list() });
      toast.success('Program berhasil dibuat');
    },
    onError: () => {
      toast.error('Gagal membuat program');
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProgramFormData }) =>
      updateProgram(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: programKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: programKeys.list() });
      toast.success('Program berhasil diubah');
    },
    onError: () => {
      toast.error('Gagal mengubah program');
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProgram(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.list() });
      toast.success('Program berhasil dihapus');
    },
    onError: () => {
      toast.error('Gagal menghapus program');
    },
  });
}
