import apiClient from '@/utils/apiClient';
import {
  DomisiliListResponseSchema,
  StudentCampusListResponseSchema,
  StudentClubListResponseSchema,
  StudentChapterListResponseSchema,
  UsersListResponseSchema,
  UserMutationResponseSchema,
  RoleListResponseSchema,
} from './schemas';
import type {
  Domisili,
  StudentCampus,
  StudentClub,
  StudentChapter,
  UsersListResponse,
  UserMutationResponse,
  Role,
} from './types';

/**
 * GET /users
 */
export async function getUsers(params: {
  page?: number;
  limit?: number;
  query?: string;
  domisili_id?: string;
  campus_id?: string;
  student_chapter_id?: string;
  student_club_id?: string;
  sort?: string;
}): Promise<UsersListResponse> {
  try {
    const res = await apiClient.get('/users', { params });
    const parsed = UsersListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement', {
        errors: parsed.error.flatten(),
      });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data;
      }
      throw new Error('Invalid response format: Expected an array of users');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error('Gagal memuat data pengguna. Silakan coba lagi nanti.');
  }
}

/**
 * GET /users/domisili
 */
export async function getDomisili(search?: string): Promise<Domisili[]> {
  try {
    const url = search ? `/users/domisili?search=${encodeURIComponent(search)}` : '/users/domisili';
    const res = await apiClient.get(url);
    const parsed = DomisiliListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw domisili data', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of domisili');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch domisili:', error);
    throw new Error('Gagal memuat data domisili. Silakan coba lagi nanti.');
  }
}

/**
 * GET /student-campus
 */
export async function getStudentCampuses(search?: string): Promise<StudentCampus[]> {
  try {
    const url = search ? `/student-campus?search=${encodeURIComponent(search)}` : '/student-campus';
    const res = await apiClient.get(url);
    const parsed = StudentCampusListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw student campus data', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of student campuses');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch student campuses:', error);
    throw new Error('Gagal memuat data kampus. Silakan coba lagi nanti.');
  }
}

/**
 * GET /student-chapters
 */
export async function getStudentChapters(search?: string): Promise<StudentChapter[]> {
  try {
    const url = search ? `/student-chapters?search=${encodeURIComponent(search)}` : '/student-chapters';
    const res = await apiClient.get(url);
    const parsed = StudentChapterListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw student chapters data', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        console.log(res.data.data)
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of student chapters');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch student chapters:', error);
    throw new Error('Gagal memuat data chapter mahasiswa. Silakan coba lagi nanti.');
  }
}

/**
 * GET /student-clubs
 */
export async function getStudentClubs(search?: string): Promise<StudentClub[]> {
  try {
    const url = search ? `/student-clubs?search=${encodeURIComponent(search)}` : '/student-clubs';
    const res = await apiClient.get(url);
    const parsed = StudentClubListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw student clubs data', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of student clubs');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch student clubs:', error);
    throw new Error('Gagal memuat data klub mahasiswa. Silakan coba lagi nanti.');
  }
}

/**
 * GET /users/roles
 */
export async function getRoles(search?: string): Promise<Role[]> {
  try {
    const url = search ? `/roles?search=${encodeURIComponent(search)}` : '/roles';
    const res = await apiClient.get(url);
    const parsed = RoleListResponseSchema.safeParse(res.data);
    
    if (!parsed.success) {
      console.warn('Fallback: returning raw roles data', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of roles');
    }
    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch roles:', error);
    throw new Error('Gagal memuat data peran. Silakan coba lagi nanti.');
  }
}

/**
 * PUT /users/validate-member/:unique-member
 */
export async function validateMember(uniqueNumber: string): Promise<UserMutationResponse> {
  try {
    const res = await apiClient.put(`/users/validate-member/${uniqueNumber}`);
    const parsed = UserMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw validate response', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success') {
        return res.data;
      }
      throw new Error('Invalid response format: Expected a success response');
    }

    return parsed.data;
  } catch (error: any) {
    console.error(`Failed to validate member with unique number ${uniqueNumber}:`, error);
    const message = error.response?.data?.message || 'Gagal memvalidasi anggota. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}

/**
 * PUT /users/default-password
 */
export async function sendDefaultPassword(users_id: string): Promise<UserMutationResponse> {
  try {
    const res = await apiClient.put(`/users/default-password`, { users_id });
    const parsed = UserMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw default password response', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success') {
        return res.data;
      }
      throw new Error('Invalid response format: Expected a success response');
    }

    return parsed.data;
  } catch (error: any) {
    console.error(`Failed to send default password to user_id ${users_id}:`, error);
    const message = error.response?.data?.message || 'Gagal mengirim password default. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}