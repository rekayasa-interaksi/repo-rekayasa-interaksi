import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createStudentClub,
  deleteStudentClub,
  getStudentClubById,
  getStudentClubs,
  updateStudentClub,
} from './services';

import type {
  StudentClub,
  StudentClubFormData,
  StudentClubMutationResponse
} from './types';

interface MutationPayload {
  id: string;
  payload: FormData;
}

export const studentClubKeys = {
  all: ['student-clubs'] as const,
  list: () => [...studentClubKeys.all, 'list'] as const,
  detail: (id: string) => [...studentClubKeys.all, 'detail', id] as const,
};

export function useStudentClubs() {
  return useQuery<StudentClub[]>({
    queryKey: studentClubKeys.list(),
    queryFn: getStudentClubs,
    placeholderData: (prev) => prev,
  });
}

export function useStudentClub(id: string) {
  return useQuery({
    queryKey: studentClubKeys.detail(id),
    queryFn: () => getStudentClubById(id),
    enabled: !!id,
  });
}

export function useCreateStudentClub() {
  const queryClient = useQueryClient();

  return useMutation<StudentClubMutationResponse, Error, FormData>({
    mutationFn: (payload: FormData) => createStudentClub(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentClubKeys.list() });
      toast.success('Student club created successfully');
    },
    onError: () => {
      toast.error('Failed to create student club');
    },
  });
}

export function useUpdateStudentClub() {
  const queryClient = useQueryClient();

  return useMutation<StudentClubMutationResponse, Error, MutationPayload>({
    mutationFn: ({ id, payload }: MutationPayload) => updateStudentClub(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: studentClubKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: studentClubKeys.list() });
      toast.success('Student club updated successfully');
    },
    onError: () => {
      toast.error('Failed to update student club');
    },
  });
}

export function useDeleteStudentClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStudentClub(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentClubKeys.list() });
      toast.success('Student club berhasil dihapus');
    },
    onError: () => {
      toast.error('Gagal menghapus student club');
    },
  });
}
