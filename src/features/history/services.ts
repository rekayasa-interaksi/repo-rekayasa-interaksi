import apiClient from '@/utils/apiClient';
import {
  HistoriesListResponseSchema,
  HistoryMutationResponseSchema,
  HistorySchema
} from './schemas';
import type {
  HistoriesListResponse,
  HistoryFormData,
  HistoryMutationResponse
} from './types';

/**
 * GET /histories
 */
export async function getHistories(params: {
  page?: number;
  limit?: number;
  year?: string;
}): Promise<HistoriesListResponse> {
  try {
    const res = await apiClient.get('/histories', { params });
    const parsed = HistoriesListResponseSchema.safeParse(res.data);

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
    console.error('Failed to fetch histories:', error);
    throw new Error('Gagal memuat data history. Silakan coba lagi nanti.');
  }
}

/**
 * POST /histories
 */
export async function createHistory(payload: FormData): Promise<HistoryMutationResponse> {
  try {
    const res = await apiClient.post(`/histories`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const parsed = HistoryMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw validate response', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success') {
        return res.data;
      }
      throw new Error('Invalid response format: Expected a success response');
    }

    return parsed.data;
  } catch (error: any) {
    console.error(`Failed to create history:`, error);
    const message = error.response?.data?.message || 'Gagal membuat history. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}

/**
 * PUT /histories/:id
 */
export async function updateHistory(id: string, payload: FormData): Promise<HistoryMutationResponse> {
  try {
    const res = await apiClient.put(`/histories/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const parsed = HistoryMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw validate response', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success') {
        return res.data;
      }
      throw new Error('Invalid response format: Expected a success response');
    }

    return parsed.data;
  } catch (error: any) {
    console.error(`Failed to update history:`, error);
    const message = error.response?.data?.message || 'Gagal memperbarui history. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}

/**
 * DELETE /histories/:id
 */

export async function deleteHistory(id: string): Promise<HistoryMutationResponse> {
  try {
    const res = await apiClient.delete(`/histories/${id}`);
    const parsed = HistoryMutationResponseSchema.safeParse(res.data);
    
    if (!parsed.success) {
      console.warn('Fallback: returning raw delete response', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success') {
        return res.data;
      }
      throw new Error('Invalid response format: Expected a success response');
    }
      
    return parsed.data;
  }
  catch (error: any) {
    console.error(`Failed to delete history:`, error);
    const message = error.response?.data?.message || 'Gagal menghapus history. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}
