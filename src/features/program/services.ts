import apiClient from '@/utils/apiClient';
import {
  ProgramDetailResponseSchema,
  ProgramListResponseSchema,
  ProgramMutationResponseSchema,
} from './schemas';
import type {
  Program,
  ProgramDetail,
  ProgramFormData,
  ProgramMutationResponse,
} from './types';

/**
 * GET /programs
 */
export async function getPrograms(): Promise<Program[]> {
  try {
    const res = await apiClient.get('/programs');
    const parsed = ProgramListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement');
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch programs:', error);
    throw error;
  }
}

/**
 * GET /programs/:id
 */
export async function getProgramById(id: string): Promise<ProgramDetail> {
  try {
    const res = await apiClient.get(`/programs/${id}`);
    const parsed = ProgramDetailResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw detail data');
      if (res.data?.status === 'success' && res.data?.data?.id) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error(`Failed to fetch program with ID ${id}:`, error);
    throw error;
  }
}

/**
 * POST /programs
 */
export async function createProgram(
  payload: ProgramFormData,
): Promise<ProgramMutationResponse> {
  try {
    const res = await apiClient.post('/programs', payload);
    const parsed = ProgramMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.data?.status === 'success') return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to create program:', error);
    throw error;
  }
}

/**
 * PUT /programs/:id
 */
export async function updateProgram(
  id: string,
  payload: ProgramFormData,
): Promise<ProgramMutationResponse> {
  try {
    const res = await apiClient.put(`/programs/${id}`, payload);
    const parsed = ProgramMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.data?.status === 'success') return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error(`Failed to update program with ID ${id}:`, error);
    throw error;
  }
}

/**
 * DELETE /programs/:id
 */
export async function deleteProgram(id: string): Promise<void> {
  try {
    await apiClient.delete(`/programs/${id}`);
  } catch (error) {
    console.error(`Failed to delete program with ID ${id}:`, error);
    throw error;
  }
}
