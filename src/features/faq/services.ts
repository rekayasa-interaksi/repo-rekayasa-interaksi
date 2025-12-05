import apiClient from '@/utils/apiClient';
import {
  FaqDetailResponseSchema,
  FaqListResponseSchema,
  FaqMutationResponseSchema,
} from './schemas';
import type {
  Faq,
  FaqAnswerFormData,
  FaqDetail,
  FaqFormData,
  FaqMutationResponse,
} from './types';

/**
 * GET /faq
 */
export async function getFaq(): Promise<Faq[]> {
  try {
    const res = await apiClient.get('/faq');
    const parsed = FaqListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement');
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch faqes:', error);
    throw error;
  }
}

/**
 * GET /faq/:id
 */
export async function getFaqById(id: string): Promise<FaqDetail> {
  try {
    const res = await apiClient.get(`/faq/${id}`);
    const parsed = FaqDetailResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw detail data');
      if (res.data?.status === 'success' && res.data?.data?.id) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error(`Failed to fetch faq with ID ${id}:`, error);
    throw error;
  }
}

/**
 * POST /faq
 */
export async function createFaq(
  payload: FaqFormData,
): Promise<FaqMutationResponse> {
  try {
    const res = await apiClient.post('/faq', payload);
    const parsed = FaqMutationResponseSchema.safeParse(res.data);
    
    if (!parsed.success) {
      if (res.status === 201) return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to create faq:', error);
    throw error;
  }
}

/**
 * PATCH /faq/:id
 */
export async function updateFaq(
  id: string,
  payload: FaqFormData,
): Promise<FaqMutationResponse> {
  try {
    const res = await apiClient.patch(`/faq/${id}`, payload);
    const parsed = FaqMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res?.status === 200) return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error(`Failed to update faq with ID ${id}:`, error);
    throw error;
  }
}

/**
 * PATCH /faq/answer/:id
 */
export async function updateFaqAnswer(
  id: string, 
  payload: FaqAnswerFormData
): Promise<FaqMutationResponse> {
  try {
    const response = await apiClient.patch(`/faq/answer/${id}`, payload);
    const parsed = FaqMutationResponseSchema.safeParse(response.data);
    if (!parsed.success) {
      if (response?.status === 200) return response.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error(`Failed to update faq answer with ID ${id}:`, error);
    throw error;
  }
  
}

/**
 * DELETE /faq/:id
 */
export async function deleteFaq(id: string): Promise<void> {
  try {
    await apiClient.delete(`/faq/${id}`);
  } catch (error) {
    console.error(`Failed to delete faq with ID ${id}:`, error);
    throw error;
  }
}
