import { z } from 'zod';
import apiClient from '@/utils/apiClient';
import {
  OrganizationalStructureDetailResponseSchema,
  OrganizationalStructureListResponseSchema,
  OrganizationalStructureMutationResponseSchema,
  StudentClubListResponseSchema,
  StudentChapterListResponseSchema,
  UserListResponseSchema,
} from './schemas';
import type {
  OrganizationalStructure,
  OrganizationalStructureDetail,
  OrganizationalStructureFormData,
  OrganizationalStructureMutationResponse,
  StudentClub,
  StudentChapter,
  User,
} from './types';

/**
 * GET /organizational-structure
 * Fetches all organizational structures.
 */
export async function getOrganizationalStructures(generation?: string): Promise<OrganizationalStructure[]> {
  try {
    const res = await apiClient.get('/organizational-structure', {
      params: {
        generation,
      },
    });
    const parsed = OrganizationalStructureListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement', {
        errors: parsed.error.flatten(),
      });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of organizational structures');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch organizational structures:', error);
    throw new Error('Gagal memuat data struktur organisasi. Silakan coba lagi nanti.');
  }
}

/**
 * GET /organizational-structure/generations
 * Fetches all organizational generations.
 */
export async function getGenerations(): Promise<string[]> {
  try {
    const res = await apiClient.get('/organizational-structure/generations');

    // Parse array di dalam data
    const parsed = z.array(z.string()).safeParse(res.data?.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement', {
        errors: parsed.error.flatten(),
      });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of generations');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to fetch generations:', error);
    throw new Error('Gagal memuat data generasi. Silakan coba lagi nanti.');
  }
}

/**
 * GET /organizational-structure/:id
 * Fetches a single organizational structure by ID.
 */
export async function getOrganizationalStructureById(id: string): Promise<OrganizationalStructureDetail> {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID provided');
    }
    const res = await apiClient.get(`/organizational-structure/${id}`);
    const parsed = OrganizationalStructureDetailResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw detail data', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success' && res.data?.data?.id) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected a single organizational structure');
    }

    return parsed.data.data;
  } catch (error) {
    console.error(`Failed to fetch organizational structure with ID ${id}:`, error);
    throw new Error(`Gagal memuat struktur organisasi dengan ID ${id}. Silakan coba lagi nanti.`);
  }
}

/**
 * POST /organizational-structure
 * Creates a new organizational structure.
 */
export async function createOrganizationalStructure(
  payload: OrganizationalStructureFormData,
): Promise<OrganizationalStructureMutationResponse> {
  try {
    const formData = new FormData();
    formData.append('type', payload.type || 'digistar_club');
    formData.append('position', payload.position || '');
    formData.append('generation', payload.generation || '');
    if (payload.image instanceof File) {
      formData.append('image', payload.image);
    }
    if (payload.student_club_id) {
      formData.append('student_club_id', payload.student_club_id);
    }
    if (payload.student_chapter_id) {
      formData.append('student_chapter_id', payload.student_chapter_id);
    }
    if (payload.user_id) {
      formData.append('user_id', payload.user_id);
    }

    const res = await apiClient.post('/organizational-structure', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const parsed = OrganizationalStructureMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw create response', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success') {
        return res.data;
      }
      throw new Error('Invalid response format: Expected a success response');
    }

    return parsed.data;
  } catch (error: any) {
    console.error('Failed to create organizational structure:', error);
    const message = error.response?.data?.message || 'Gagal membuat struktur organisasi. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}

/**
 * PUT /organizational-structure/:id
 * Updates an existing organizational structure.
 */
export async function updateOrganizationalStructure(
  id: string,
  payload: OrganizationalStructureFormData,
): Promise<OrganizationalStructureMutationResponse> {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID provided');
    }
    const formData = new FormData();
    if (payload.type) {
      formData.append('type', payload.type);
    }
    if (payload.position) {
      formData.append('position', payload.position);
    }
    if (payload.image instanceof File) {
      formData.append('image', payload.image);
    }
    if (payload.student_club_id) {
      formData.append('student_club_id', payload.student_club_id);
    }
    if (payload.student_chapter_id) {
      formData.append('student_chapter_id', payload.student_chapter_id);
    }
    if (payload.user_id) {
      formData.append('user_id', payload.user_id);
    }
    if (payload.generation) {
      formData.append('generation', payload.generation);
    }

    const res = await apiClient.put(`/organizational-structure/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const parsed = OrganizationalStructureMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw update response', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success') {
        return res.data;
      }
      throw new Error('Invalid response format: Expected a success response');
    }

    return parsed.data;
  } catch (error: any) {
    console.error(`Failed to update organizational structure with ID ${id}:`, error);
    const message = error.response?.data?.message || `Gagal memperbarui struktur organisasi dengan ID ${id}. Silakan coba lagi nanti.`;
    throw new Error(message);
  }
}

/**
 * DELETE /organizational-structure/:id
 * Deletes an organizational structure by ID.
 */
export async function deleteOrganizationalStructure(id: string): Promise<void> {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID provided');
    }
    await apiClient.delete(`/organizational-structure/${id}`);
  } catch (error: any) {
    console.error(`Failed to delete organizational structure with ID ${id}:`, error);
    const message = error.response?.data?.message || `Gagal menghapus struktur organisasi dengan ID ${id}. Silakan coba lagi nanti.`;
    throw new Error(message);
  }
}

/**
 * GET /student-clubs
 * Fetches student clubs with optional search query.
 */
export async function getStudentClubs(search?: string): Promise<StudentClub[]> {
  try {
    const url = search ? `/student-clubs?query=${encodeURIComponent(search)}` : '/student-clubs';
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
  } catch (error: any) {
    console.error('Failed to fetch student clubs:', error);
    const message = error.response?.data?.message || 'Gagal memuat data klub mahasiswa. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}

/**
 * GET /users
 * Fetches users with optional search query.
 */
export async function getUsers(search?: string): Promise<User[]> {
  try {
    const url = search ? `/users?query=${encodeURIComponent(search)}` : '/users';
    const res = await apiClient.get(url);
    const parsed = UserListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw user data', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of users');
    }

    return parsed.data.data;
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    const message = error.response?.data?.message || 'Gagal memuat data pengguna. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}

/**
 * GET /student-chapters
 * Fetches student chapters with optional search query.
 */
export async function getStudentChapters(search?: string): Promise<StudentChapter[]> {
  try {
    const url = search ? `/student-chapters?query=${encodeURIComponent(search)}` : '/student-chapters';
    const res = await apiClient.get(url);
    const rawData = res.data?.data ?? res.data
    const parsed = StudentChapterListResponseSchema.safeParse(rawData);

    if (!parsed.success) {
      console.warn('Fallback: returning raw student chapters data', { errors: parsed.error.flatten() });
      if (Array.isArray(rawData)) {
        return rawData.map((item) => ({
          ...item,
          name: item.institute
        }));
      }
      throw new Error('Invalid response format: Expected an array of student chapters');
    }

    return parsed.data.data.map((item) => ({
      ...item,
      name: item.institute,
    }));
  } catch (error: any) {
    console.error('Failed to fetch student chapters:', error);
    const message = error.response?.data?.message || 'Gagal memuat data chapter mahasiswa. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}