import apiClient from '@/utils/apiClient';
import {
  StudentChapterDetailResponseSchema,
  StudentChapterListResponseSchema,
  StudentChapterMutationResponseSchema,
} from './schemas';
import type {
  StudentChapter,
  StudentChapterDetail,
  StudentChapterFormData,
  StudentChapterMutationResponse,
} from './types';

/**
 * GET /student-chapters
 */
export async function getStudentChapters(): Promise<StudentChapter[]> {
  try {
    const res = await apiClient.get('/student-chapters');
    const parsed = StudentChapterListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement');
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch student chapters:', error);
    throw error;
  }
}

/**
 * GET /student-chapters/:id
 */
export async function getStudentChapterById(id: string): Promise<StudentChapterDetail> {
  try {
    const res = await apiClient.get(`/student-chapters/${id}`);
    const parsed = StudentChapterDetailResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw detail data');
      if (res.data?.status === 'success' && res.data?.data?.id) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error(`Failed to fetch student chapter with ID ${id}:`, error);
    throw error;
  }
}

/**
 * POST /student-chapters
 */
export async function createStudentChapter(
  payload: FormData,
): Promise<StudentChapterMutationResponse> {
  try {
    const res = await apiClient.post('/student-chapters', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const parsed = StudentChapterMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.data?.status === 'success') return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to create student chapter:', error);
    throw error;
  }
}

/**
 * PUT /student-chapters/:id
 */
export async function updateStudentChapter(
  id: string,
  payload: FormData,
): Promise<StudentChapterMutationResponse> {
  try {
    const res = await apiClient.put(`/student-chapters/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const parsed = StudentChapterMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.data?.status === 'success') return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error(`Failed to update student chapter with ID ${id}:`, error);
    throw error;
  }
}

/**
 * DELETE /student-chapters/:id
 */
export async function deleteStudentChapter(id: string): Promise<void> {
  try {
    await apiClient.delete(`/student-chapters/${id}`);
  } catch (error) {
    console.error(`Failed to delete student chapter with ID ${id}:`, error);
    throw error;
  }
}
