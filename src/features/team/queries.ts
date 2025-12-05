import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createTeam,
  deleteTeam,
  getTeams,
  updateTeam,
  getUsers,
  getGenerations,
  updateVersion,
  createVersion,
  deleteVersion,
  getVersions,
  createFeature,
  updateFeature,
  deleteFeature,
  getFeatures,
} from './services';
import {
  type SocialMedia,
  type Team,
  type TeamFormData,
  type TeamDetail,
  type TeamMutationResponse,
  type User,
  type VersionFormData,
  Version,
  FeatureFormData
} from './types';
import { list } from 'postcss';

export const teamKeys = {
  all: ['teams'] as const,
  list: () => [...teamKeys.all, 'list'] as const,
};

export const versionKeys = {
  all: ['versions'] as const,
  list: () => [...teamKeys.all, 'list'] as const,
};

export const featureKeys = {
  all: ['features'] as const,
  list: () => [...teamKeys.all, 'list'] as const,
};

export const generationKeys = {
  all: ['generations'] as const,
  list: () => [...generationKeys.all, 'list'] as const,
};

export const userKeys = {
  all: ['users'] as const,
  list: (search?: string) => [...userKeys.all, 'list', search || ''] as const,
};

export function useTeams(generation?: string) {
  return useQuery<Team[]>({
    queryKey: ['teams', generation ?? 'all'],
    queryFn: () => getTeams(generation),
    placeholderData: (prev) => prev,
  });
}

export function useVersions(params: { generation?: string | null }) {
  return useQuery<Version[]>({
    queryKey: ["versions", params.generation ?? 'all'],
    queryFn: () => getVersions(params.generation ?? undefined),
  });
}

export function useFeatures(versionId: string) {
  return useQuery({
    queryKey: ['features', versionId ?? 'all'],
    queryFn: () => getFeatures(versionId),
  });
}

export function useGenerations() {
  return useQuery<string[], Error>({
    queryKey: generationKeys.list(),
    queryFn: getGenerations,
    placeholderData: (prev) => prev,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TeamFormData) => createTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Tim berhasil dibuat');
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast.error('Gagal membuat tim');
    },
  });
}

export function useCreateVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VersionFormData) => createVersion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions'] });
      toast.success('Versi sistem berhasil dibuat');
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast.error('Gagal membuat versi sistem');
    },
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FeatureFormData) => createFeature(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Fitur sistem berhasil dibuat');
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast.error('Gagal membuat fitur sistem');
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TeamFormData }) =>
      updateTeam(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Tim berhasil diubah');
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Gagal mengubah tim');
    },
  });
}

export function useUpdateVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VersionFormData }) =>
      updateVersion(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['versions'] });
      toast.success('Versi sistem berhasil diubah');
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Gagal mengubah Versi sistem');
    },
  });
}

export function useUpdateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FeatureFormData }) =>
      updateFeature(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Fitur sistem berhasil diubah');
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Gagal mengubah fitur sistem');
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Tim berhasil dihapus');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus tim');
    },
  });
}

export function useDeleteVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVersion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions'] });
      toast.success('Versi sistem berhasil dihapus');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus Versi sistem');
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFeature(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Features sistem berhasil dihapus');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus fitur sistem');
    },
  });
}

export function useMembers(search?: string) {
  return useQuery<{ id: string; name: string }[]>({
    queryKey: userKeys.list(search),
    queryFn: async () => getUsers(search),
    placeholderData: (prev) => prev,
  });
}