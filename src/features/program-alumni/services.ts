import apiClient from '@/utils/apiClient';
import {
  ProgramAlumniDetailResponseSchema,
  ProgramAlumniListResponseSchema,
  ProgramAlumniMutationResponseSchema,
} from './schemas';
import type {
  ProgramAlumni,
  ProgramAlumniDetail,
  ProgramAlumniFormData,
  ProgramAlumniMutationResponse,
} from './types';

/**
 * GET /programs-alumni
 */
export async function getProgramsAlumni(): Promise<ProgramAlumni[]> {
  try {
    const res = await apiClient.get('/programs-alumni');
    const parsed = ProgramAlumniListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement');
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch programs-alumni:', error);
    throw error;
  }
}

/**
 * GET /programs-alumni/:id
 */
export async function getProgramAlumniById(id: string): Promise<ProgramAlumniDetail> {
  try {
    const res = await apiClient.get(`/programs-alumni/${id}`);
    const parsed = ProgramAlumniDetailResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw detail data');
      if (res.data?.status === 'success' && res.data?.data?.id) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error(`Failed to fetch programAlumni with ID ${id}:`, error);
    throw error;
  }
}

/**
 * POST /programs-alumni
 */
export async function createProgramAlumni(
  payload: ProgramAlumniFormData,
): Promise<ProgramAlumniMutationResponse> {
  try {
    const res = await apiClient.post('/programs-alumni', payload);
    const parsed = ProgramAlumniMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.data?.status === 'success') return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to create programAlumni:', error);
    throw error;
  }
}

/**
 * PUT /programs-alumni/:id
 */
export async function updateProgramAlumni(
  id: string,
  payload: ProgramAlumniFormData,
): Promise<ProgramAlumniMutationResponse> {
  try {
    const res = await apiClient.put(`/programs-alumni/${id}`, payload);
    const parsed = ProgramAlumniMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.data?.status === 'success') return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error(`Failed to update programAlumni with ID ${id}:`, error);
    throw error;
  }
}

/**
 * DELETE /programs-alumni/:id
 */
export async function deleteProgramAlumni(id: string): Promise<void> {
  try {
    await apiClient.delete(`/programs-alumni/${id}`);
  } catch (error) {
    console.error(`Failed to delete programAlumni with ID ${id}:`, error);
    throw error;
  }
}
