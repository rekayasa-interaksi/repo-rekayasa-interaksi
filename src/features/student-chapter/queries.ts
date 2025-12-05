import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createStudentChapter,
  deleteStudentChapter,
  getStudentChapterById,
  getStudentChapters,
  updateStudentChapter,
} from './services';

import type {
  StudentChapter,
  StudentChapterFormData,
  StudentChapterMutationResponse,
} from './types';

interface MutationPayload {
  id: string;
  payload: FormData;
}

export const studentChapterKeys = {
  all: ['student-chapters'] as const,
  list: () => [...studentChapterKeys.all, 'list'] as const,
  detail: (id: string) => [...studentChapterKeys.all, 'detail', id] as const,
};

export function useStudentChapters() {
  return useQuery<StudentChapter[]>({
    queryKey: studentChapterKeys.list(),
    queryFn: getStudentChapters,
    placeholderData: (prev) => prev,
  });
}

export function useStudentChapter(id: string) {
  return useQuery({
    queryKey: studentChapterKeys.detail(id),
    queryFn: () => getStudentChapterById(id),
    enabled: !!id,
  });
}

export function useCreateStudentChapter() {
  const queryClient = useQueryClient();

  return useMutation<StudentChapterMutationResponse, Error, FormData>({
    mutationFn: (payload: FormData) => createStudentChapter(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentChapterKeys.list() });
      toast.success('Student chapter created successfully');
    },
    onError: () => {
      toast.error('Failed to create student chapter');
    },
  });
}

export function useUpdateStudentChapter() {
  const queryClient = useQueryClient();

  return useMutation<StudentChapterMutationResponse, Error, MutationPayload>({
    mutationFn: ({ id, payload }: MutationPayload) => updateStudentChapter(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: studentChapterKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: studentChapterKeys.list() });
      toast.success('Student chapter updated successfully');
    },
    onError: () => {
      toast.error('Failed to update student chapter');
    },
  });
}

export function useDeleteStudentChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStudentChapter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentChapterKeys.list() });
      toast.success('Student chapter berhasil dihapus');
    },
    onError: () => {
      toast.error('Gagal menghapus student chapter');
    },
  });
}
