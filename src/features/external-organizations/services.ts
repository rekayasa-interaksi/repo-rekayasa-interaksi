import apiClient from '@/utils/apiClient';
import {
  ExternalOrganizationDetailResponseSchema,
  ExternalOrganizationListResponseSchema,
  ExternalOrganizationMutationResponseSchema,
} from './schemas';
import type {
  ExternalOrganization,
  ExternalOrganizationDetail,
  ExternalOrganizationFormData,
  ExternalOrganizationListResponse,
  ExternalOrganizationMutationResponse,
} from './types';

/**
 * GET /external-organization
 */
export async function getExternalOrganizations(params: {
  query?: string
  page?: number;
  limit?: number;
}): Promise<ExternalOrganizationListResponse> {
  try {
    const res = await apiClient.get('/external-organization', {params});
    const parsed = ExternalOrganizationListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement');
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to fetch student clubs:', error);
    throw error;
  }
}

/**
 * GET /external-organization/:id
 */
export async function getExternalOrganizationById(id: string): Promise<ExternalOrganizationDetail> {
  try {
    const res = await apiClient.get(`/external-organization/${id}`);
    const parsed = ExternalOrganizationDetailResponseSchema.safeParse(res.data);

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
 * POST /external-organization
 */
export async function createExternalOrganization(
  payload: FormData,
): Promise<ExternalOrganizationMutationResponse> {
  try {
    const res = await apiClient.post('/external-organization', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const parsed = ExternalOrganizationMutationResponseSchema.safeParse(res.data);

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
 * PUT /external-organization/:id
 */
export async function updateExternalOrganization(
  id: string,
  payload: FormData,
): Promise<ExternalOrganizationMutationResponse> {
  try {
    const res = await apiClient.put(`/external-organization/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const parsed = ExternalOrganizationMutationResponseSchema.safeParse(res.data);

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
 * DELETE /external-organization/:id
 */
export async function deleteExternalOrganization(id: string): Promise<void> {
  try {
    await apiClient.delete(`/external-organization/${id}`);
  } catch (error) {
    console.error(`Failed to delete student club with ID ${id}:`, error);
    throw error;
  }
}
