import apiClient from '@/utils/apiClient';
import {
  StudentCampusDetailResponseSchema,
  StudentCampusListResponseSchema,
  StudentCampusMutationResponseSchema,
} from './schemas';
import type {
  StudentCampus,
  StudentCampusDetail,
  StudentCampusFormData,
  StudentCampusMutationResponse,
} from './types';

/**
 * GET /student-campus
 */
export async function getStudentCampuses(): Promise<StudentCampus[]> {
  try {
    const res = await apiClient.get('/student-campus');
    const parsed = StudentCampusListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement');
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch student campuses:', error);
    throw error;
  }
}

/**
 * GET /student-campus/:id
 */
export async function getStudentCampusById(id: string): Promise<StudentCampusDetail> {
  try {
    const res = await apiClient.get(`/student-campus/${id}`);
    const parsed = StudentCampusDetailResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw detail data');
      if (res.data?.status === 'success' && res.data?.data?.id) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error(`Failed to fetch student campus with ID ${id}:`, error);
    throw error;
  }
}

/**
 * POST /student-campus
 */
export async function createStudentCampus(
  payload: StudentCampusFormData,
): Promise<StudentCampusMutationResponse> {
  try {
    const res = await apiClient.post('/student-campus', payload);
    const parsed = StudentCampusMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.data?.status === 'success') return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to create student campus:', error);
    throw error;
  }
}

/**
 * PUT /student-campus/:id
 */
export async function updateStudentCampus(
  id: string,
  payload: StudentCampusFormData,
): Promise<StudentCampusMutationResponse> {
  try {
    const res = await apiClient.put(`/student-campus/${id}`, payload);
    const parsed = StudentCampusMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.data?.status === 'success') return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error(`Failed to update student campus with ID ${id}:`, error);
    throw error;
  }
}

/**
 * DELETE /student-campus/:id
 */
export async function deleteStudentCampus(id: string): Promise<void> {
  try {
    await apiClient.delete(`/student-campus/${id}`);
  } catch (error) {
    console.error(`Failed to delete student campus with ID ${id}:`, error);
    throw error;
  }
}
