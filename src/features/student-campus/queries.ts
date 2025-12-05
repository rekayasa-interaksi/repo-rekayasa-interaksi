import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createStudentCampus,
  deleteStudentCampus,
  getStudentCampusById,
  getStudentCampuses,
  updateStudentCampus,
} from './services';

import type {
  StudentCampus,
  StudentCampusFormData,
} from './types';

export const studentCampusKeys = {
  all: ['student-campus'] as const,
  list: () => [...studentCampusKeys.all, 'list'] as const,
  detail: (id: string) => [...studentCampusKeys.all, 'detail', id] as const,
};

export function useStudentCampuses() {
  return useQuery<StudentCampus[]>({
    queryKey: studentCampusKeys.list(),
    queryFn: getStudentCampuses,
    placeholderData: (prev) => prev,
  });
}

export function useStudentCampus(id: string) {
  return useQuery({
    queryKey: studentCampusKeys.detail(id),
    queryFn: () => getStudentCampusById(id),
    enabled: !!id,
  });
}

export function useCreateStudentCampus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StudentCampusFormData) => createStudentCampus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentCampusKeys.list() });
      toast.success('Student campus berhasil dibuat');
    },
    onError: () => {
      toast.error('Gagal membuat student campus');
    },
  });
}

export function useUpdateStudentCampus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StudentCampusFormData }) =>
      updateStudentCampus(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: studentCampusKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: studentCampusKeys.list() });
      toast.success('Student campus berhasil diubah');
    },
    onError: () => {
      toast.error('Gagal mengubah student campus');
    },
  });
}

export function useDeleteStudentCampus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStudentCampus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentCampusKeys.list() });
      toast.success('Student campus berhasil dihapus');
    },
    onError: () => {
      toast.error('Gagal menghapus student campus');
    },
  });
}
