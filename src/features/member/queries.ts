import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getUsers,
  getDomisili,
  getStudentCampuses,
  getStudentChapters,
  getStudentClubs,
  validateMember,
  sendDefaultPassword,
  getRoles,
} from './services';
import type {
  UsersListResponse,
  Domisili,
  StudentCampus,
  StudentClub,
  StudentChapter,
  UserMutationResponse,
  Role,
} from './types';

interface UsersQueryParams {
  page?: number;
  limit?: number;
  query?: string;
  domisili_id?: string;
  campus_id?: string;
  student_chapter_id?: string;
  student_club_id?: string;
  role_id?: string;
  sort?: string;
}

export const userKeys = {
  all: ['users'] as const,
  list: (params: UsersQueryParams) => [...userKeys.all, 'list', params] as const,
  domisili: (search?: string) => [...userKeys.all, 'domisili', search] as const,
  campuses: (search?: string) => [...userKeys.all, 'campuses', search] as const,
  chapters: (search?: string) => [...userKeys.all, 'chapters', search] as const,
  clubs: (search?: string) => [...userKeys.all, 'clubs', search] as const,
  roles: (search?: string) => [...userKeys.all, 'roles', search] as const,
};

export function useUsers(params: UsersQueryParams) {
  return useQuery<UsersListResponse, Error>({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useDomisili(search?: string) {
  return useQuery<Domisili[], Error>({
    queryKey: userKeys.domisili(search),
    queryFn: () => getDomisili(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (prev) => prev,
  });
}

export function useStudentCampuses(search?: string) {
  return useQuery<StudentCampus[], Error>({
    queryKey: userKeys.campuses(search),
    queryFn: () => getStudentCampuses(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (prev) => prev,
  });
}

export function useStudentChapters(search?: string) {
  return useQuery<StudentChapter[], Error>({
    queryKey: userKeys.chapters(search),
    queryFn: () => getStudentChapters(search),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useRoles(search?: string) {
  return useQuery<Role[], Error>({
    queryKey: userKeys.roles(search),
    queryFn: () => getRoles(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (prev) => prev,
  });
}

export function useStudentClubs(search?: string) {
  return useQuery<StudentClub[], Error>({
    queryKey: userKeys.clubs(search),
    queryFn: () => getStudentClubs(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (prev) => prev,
  });
}

export function useValidateMember() {
  const queryClient = useQueryClient();

  return useMutation<UserMutationResponse, Error, string[]>({
    mutationFn: (uniqueNumbers: string[]) => validateMember(uniqueNumbers as any), 
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(`${variables.length} Anggota berhasil divalidasi`);
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal memvalidasi anggota secara massal');
    },
  });
}

export function useSendDefaultPassword() {
  const queryClient = useQueryClient();

  return useMutation<UserMutationResponse, Error, string[]>({
    mutationFn: (users_id: string[]) => sendDefaultPassword(users_id as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('Password default berhasil dikirim');
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mengirim password default');
    },
  });
}