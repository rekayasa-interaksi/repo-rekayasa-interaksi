import apiClient from '@/utils/apiClient';
import {
  MajorCampusDetailResponseSchema,
  MajorCampusListResponseSchema,
  MajorCampusMutationResponseSchema,
} from './schemas';
import type {
  MajorCampus,
  MajorCampusDetail,
  MajorCampusFormData,
  MajorCampusMutationResponse,
} from './types';

/**
 * GET /major-campus
 */
export async function getMajorCampuses(): Promise<MajorCampus[]> {
  try {
    const res = await apiClient.get('/major-campus');
    const parsed = MajorCampusListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement');
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch major campuses:', error);
    throw error;
  }
}

/**
 * GET /major-campus/:id
 */
export async function getMajorCampusById(id: string): Promise<MajorCampusDetail> {
  try {
    const res = await apiClient.get(`/major-campus/${id}`);
    const parsed = MajorCampusDetailResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw detail data');
      if (res.data?.status === 'success' && res.data?.data?.id) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error(`Failed to fetch major campus with ID ${id}:`, error);
    throw error;
  }
}

/**
 * POST /major-campus
 */
export async function createMajorCampus(
  payload: MajorCampusFormData,
): Promise<MajorCampusMutationResponse> {
  try {
    const res = await apiClient.post('/major-campus', payload);
    const parsed = MajorCampusMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.data?.status === 'success') return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to create major campus:', error);
    throw error;
  }
}

/**
 * PUT /major-campus/:id
 */
export async function updateMajorCampus(
  id: string,
  payload: MajorCampusFormData,
): Promise<MajorCampusMutationResponse> {
  try {
    const res = await apiClient.put(`/major-campus/${id}`, payload);
    const parsed = MajorCampusMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.data?.status === 'success') return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error(`Failed to update major campus with ID ${id}:`, error);
    throw error;
  }
}

/**
 * DELETE /major-campus/:id
 */
export async function deleteMajorCampus(id: string): Promise<void> {
  try {
    await apiClient.delete(`/major-campus/${id}`);
  } catch (error) {
    console.error(`Failed to delete major campus with ID ${id}:`, error);
    throw error;
  }
}
