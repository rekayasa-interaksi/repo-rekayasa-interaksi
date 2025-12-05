import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createProgramAlumni,
  deleteProgramAlumni,
  getProgramAlumniById,
  getProgramsAlumni,
  updateProgramAlumni,
} from './services';

import type {
  ProgramAlumni,
  ProgramAlumniFormData,
} from './types';

export const programAlumniKeys = {
  all: ['program-alumni'] as const,
  list: () => [...programAlumniKeys.all, 'list'] as const,
  detail: (id: string) => [...programAlumniKeys.all, 'detail', id] as const,
};

export function useProgramsAlumni() {
  return useQuery<ProgramAlumni[]>({
    queryKey: programAlumniKeys.list(),
    queryFn: getProgramsAlumni,
    placeholderData: (prev) => prev,
  });
}

export function useProgramAlumni(id: string) {
  return useQuery({
    queryKey: programAlumniKeys.detail(id),
    queryFn: () => getProgramAlumniById(id),
    enabled: !!id,
  });
}

export function useCreateProgramAlumni() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProgramAlumniFormData) => createProgramAlumni(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programAlumniKeys.list() });
      toast.success('ProgramAlumni berhasil dibuat');
    },
    onError: () => {
      toast.error('Gagal membuat programAlumni');
    },
  });
}

export function useUpdateProgramAlumni() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProgramAlumniFormData }) =>
      updateProgramAlumni(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: programAlumniKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: programAlumniKeys.list() });
      toast.success('ProgramAlumni berhasil diubah');
    },
    onError: () => {
      toast.error('Gagal mengubah programAlumni');
    },
  });
}

export function useDeleteProgramAlumni() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProgramAlumni(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programAlumniKeys.list() });
      toast.success('ProgramAlumni berhasil dihapus');
    },
    onError: () => {
      toast.error('Gagal menghapus programAlumni');
    },
  });
}
