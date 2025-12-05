import apiClient from '@/utils/apiClient';
import {
  StudentClubDetailResponseSchema,
  StudentClubListResponseSchema,
  StudentClubMutationResponseSchema,
} from './schemas';
import type {
  StudentClub,
  StudentClubDetail,
  StudentClubFormData,
  StudentClubMutationResponse,
} from './types';

/**
 * GET /student-clubs
 */
export async function getStudentClubs(): Promise<StudentClub[]> {
  try {
    const res = await apiClient.get('/student-clubs');
    const parsed = StudentClubListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement');
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch student clubs:', error);
    throw error;
  }
}

/**
 * GET /student-clubs/:id
 */
export async function getStudentClubById(id: string): Promise<StudentClubDetail> {
  try {
    const res = await apiClient.get(`/student-clubs/${id}`);
    const parsed = StudentClubDetailResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw detail data');
      if (res.data?.status === 'success' && res.data?.data?.id) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error(`Failed to fetch student club with ID ${id}:`, error);
    throw error;
  }
}

/**
 * POST /student-clubs
 */
export async function createStudentClub(
  payload: FormData,
): Promise<StudentClubMutationResponse> {
  try {
    const res = await apiClient.post('/student-clubs', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const parsed = StudentClubMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.data?.status === 'success') return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to create student club:', error);
    throw error;
  }
}

/**
 * PUT /student-clubs/:id
 */
export async function updateStudentClub(
  id: string,
  payload: FormData,
): Promise<StudentClubMutationResponse> {
  try {
    const res = await apiClient.put(`/student-clubs/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const parsed = StudentClubMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.data?.status === 'success') return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error(`Failed to update student club with ID ${id}:`, error);
    throw error;
  }
}

/**
 * DELETE /student-clubs/:id
 */
export async function deleteStudentClub(id: string): Promise<void> {
  try {
    await apiClient.delete(`/student-clubs/${id}`);
  } catch (error) {
    console.error(`Failed to delete student club with ID ${id}:`, error);
    throw error;
  }
}
