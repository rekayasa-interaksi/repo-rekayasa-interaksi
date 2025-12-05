import apiClient from '@/utils/apiClient';
import {
  HelpCenterListResponseSchema,
  HelpCenterDetailResponseSchema,
  HelpCenterMutationResponseSchema
} from './schemas';
import type {
  HelpCenter,
  HelpCenterDetail,
  HelpCenterFormData,
  HelpCenterListResponse,
  HelpCenterMutationResponse
} from './types';

/**
 * GET /help-centers
 */
export async function getHelpCenters(params: {
  query?: string
  page?: number;
  limit?: number;
  status?: boolean;
}): Promise<HelpCenterListResponse> {
  try {
    const res = await apiClient.get('/help-centers', { params });
    const parsed = HelpCenterListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement');
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to fetch help centers:', error);
    throw error;
  }
}

/**
 * PUT /help-centers/:id
 */
export async function updateHelpCenter(
  id: string,
  payload: Partial<HelpCenter>,
): Promise<HelpCenterMutationResponse> {
  try {
    const res = await apiClient.put(`/help-centers/${id}`, payload);
    const parsed = HelpCenterMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res?.status === 200) return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error(`Failed to update help center with ID ${id}:`, error);
    throw error;
  }
}
