import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createOrganizationalStructure,
  deleteOrganizationalStructure,
  getOrganizationalStructureById,
  getOrganizationalStructures,
  updateOrganizationalStructure,
  getStudentClubs,
  getStudentChapters,
  getUsers,
  getGenerations,
} from './services';
import type {
  OrganizationalStructure,
  OrganizationalStructureFormData,
  StudentClub,
  StudentChapter,
} from './types';
import { list } from 'postcss';

export const organizationalStructureKeys = {
  all: ['organizational-structure'] as const,
  list: () => [...organizationalStructureKeys.all, 'list'] as const,
  detail: (id: string) => [...organizationalStructureKeys.all, 'detail', id] as const,
};

export const studentClubKeys = {
  all: ['student-clubs'] as const,
  list: (search?: string) => [...studentClubKeys.all, 'list', search || ''] as const,
};

export const generationKeys = {
  all: ['generations'] as const,
  list: () => [...generationKeys.all, 'list'] as const,
};

export const userKeys = {
  all: ['users'] as const,
  list: (search?: string) => [...userKeys.all, 'list', search || ''] as const,
};

export const studentChapterKeys = {
  all: ['student-chapters'] as const,
  list: (search?: string) => [...studentChapterKeys.all, 'list', search || ''] as const,
};

export function useOrganizationalStructures(generation?: string) {
  return useQuery<OrganizationalStructure[]>({
    queryKey: ['organizational-structures', generation ?? 'all'],
    queryFn: () => getOrganizationalStructures(generation),
    placeholderData: (prev) => prev,
  });
}

export function useGenerations() {
  return useQuery<string[], Error>({
    queryKey: generationKeys.list(),
    queryFn: getGenerations,
    placeholderData: (prev) => prev,
  });
}

export function useOrganizationalStructure(id: string) {
  return useQuery({
    queryKey: organizationalStructureKeys.detail(id),
    queryFn: () => getOrganizationalStructureById(id),
    enabled: !!id,
  });
}

export function useCreateOrganizationalStructure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OrganizationalStructureFormData) => createOrganizationalStructure(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationalStructureKeys.list() });
      toast.success('Struktur organisasi berhasil dibuat');
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast.error('Gagal membuat struktur organisasi');
    },
  });
}

export function useUpdateOrganizationalStructure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: OrganizationalStructureFormData }) =>
      updateOrganizationalStructure(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: organizationalStructureKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: organizationalStructureKeys.list() });
      toast.success('Struktur organisasi berhasil diubah');
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Gagal mengubah struktur organisasi');
    },
  });
}

export function useDeleteOrganizationalStructure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrganizationalStructure(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationalStructureKeys.list() });
      toast.success('Struktur organisasi berhasil dihapus');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus struktur organisasi');
    },
  });
}

export function useStudentClubs(search?: string) {
  return useQuery<StudentClub[]>({
    queryKey: studentClubKeys.list(search),
    queryFn: () => getStudentClubs(search),
    placeholderData: (prev) => prev,
  });
}

export function useMembers(search?: string) {
  return useQuery<{ id: string; name: string }[]>({
    queryKey: userKeys.list(search),
    queryFn: async () => getUsers(search),
    placeholderData: (prev) => prev,
  });
}

export function useStudentChapters(search?: string) {
  return useQuery<StudentChapter[]>({
    queryKey: studentChapterKeys.list(search),
    queryFn: () => getStudentChapters(search),
    placeholderData: (prev) => prev,
  });
}