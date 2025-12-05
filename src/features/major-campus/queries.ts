import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createMajorCampus,
  deleteMajorCampus,
  getMajorCampusById,
  getMajorCampuses,
  updateMajorCampus,
} from './services';

import type {
  MajorCampus,
  MajorCampusFormData,
} from './types';

export const majorCampusKeys = {
  all: ['major-campus'] as const,
  list: () => [...majorCampusKeys.all, 'list'] as const,
  detail: (id: string) => [...majorCampusKeys.all, 'detail', id] as const,
};

export function useMajorCampuses() {
  return useQuery<MajorCampus[]>({
    queryKey: majorCampusKeys.list(),
    queryFn: getMajorCampuses,
    placeholderData: (prev) => prev,
  });
}

export function useMajorCampus(id: string) {
  return useQuery({
    queryKey: majorCampusKeys.detail(id),
    queryFn: () => getMajorCampusById(id),
    enabled: !!id,
  });
}

export function useCreateMajorCampus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MajorCampusFormData) => createMajorCampus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: majorCampusKeys.list() });
      toast.success('Jurusan berhasil dibuat');
    },
    onError: () => {
      toast.error('Gagal membuat jurusan');
    },
  });
}

export function useUpdateMajorCampus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MajorCampusFormData }) =>
      updateMajorCampus(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: majorCampusKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: majorCampusKeys.list() });
      toast.success('Jurusan berhasil diubah');
    },
    onError: () => {
      toast.error('Gagal mengubah jurusan');
    },
  });
}

export function useDeleteMajorCampus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMajorCampus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: majorCampusKeys.list() });
      toast.success('Jurusan berhasil dihapus');
    },
    onError: () => {
      toast.error('Gagal menghapus jurusan');
    },
  });
}
