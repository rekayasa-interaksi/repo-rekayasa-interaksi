import { z } from 'zod';
import apiClient from '@/utils/apiClient';
import {
  TeamListResponseSchema,
  TeamDetailResponseSchema,
  TeamFormSchema,
  TeamMutationResponseSchema,
  SocialMediaSchema,
  TeamSchema,
  UserSchema,
  UserListResponseSchema,
  VersionMutationResponseSchema,
  VersionListResponseSchema,
  FeatureMutationResponseSchema,
  FeatureListResponseSchema,
} from './schemas';
import type {
  Team,
  TeamDetail,
  TeamFormData,
  TeamMutationResponse,
  SocialMedia,
  User,
  VersionFormData,
  VersionMutationResponse,
  Version,
  FeatureFormData,
  FeatureMutationResponse,
  Feature,
} from './types';

/**
 * GET /teams
 * Fetches all teams.
 */
export async function getTeams(generation?: string): Promise<Team[]> {
  try {
    const res = await apiClient.get('/teams', {
      params: {
        generation,
      },
    });
    const parsed = TeamListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement', {
        errors: parsed.error.flatten(),
      });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of teams');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    throw new Error('Gagal memuat data tim. Silakan coba lagi nanti.');
  }
}

/**
 * GET /teams/version-systems
 * Fetches all teams.
 */
export async function getVersions(generation?: string): Promise<Version[]> {
  try {
    const res = await apiClient.get('/teams/version-systems', {
      params: {
        generation,
      },
    });
    const parsed = VersionListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement', {
        errors: parsed.error.flatten(),
      });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of versions');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch versions:', error);
    throw new Error('Gagal memuat data versi. Silakan coba lagi nanti.');
  }
}


/**
 * GET /teams/features
 * Fetches all features.
 */
export async function getFeatures(version_system_id?: string): Promise<Feature[]> {
  try {
    const res = await apiClient.get('/teams/features', {
      params: {
        version_system_id,
      },
    });
    const parsed = FeatureListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement', {
        errors: parsed.error.flatten(),
      });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of versions');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch features:', error);
    throw new Error('Gagal memuat data fitur. Silakan coba lagi nanti.');
  }
}

/**
 * GET /teams/generations
 * Fetches all organizational generations.
 */
export async function getGenerations(): Promise<string[]> {
  try {
    const res = await apiClient.get('/teams/generations');

    // Parse array di dalam data
    const parsed = z.array(z.string()).safeParse(res.data?.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement', {
        errors: parsed.error.flatten(),
      });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of generations');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to fetch generations:', error);
    throw new Error('Gagal memuat data generasi. Silakan coba lagi nanti.');
  }
}

/**
 * POST /teams
 * Creates a new team.
 */
export async function createTeam(
  payload: TeamFormData,
): Promise<TeamMutationResponse> {
  try {
    const formData = new FormData();
    formData.append('role', payload.role || '');
    formData.append('generation', payload.generation || '');
    if (payload.image instanceof File) {
      formData.append('image', payload.image);
    }
    if (payload.user_id) {
      formData.append('user_id', payload.user_id);
    }

    const res = await apiClient.post('/teams', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const parsed = TeamMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw create response', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success') {
        return res.data;
      }
      throw new Error('Invalid response format: Expected a success response');
    }

    return parsed.data;
  } catch (error: any) {
    console.error('Failed to create team:', error);
    const message = error.response?.data?.message || 'Gagal membuat tim. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}

/**
 * POST /teams/version-systems
 * Creates a new version systems.
 */
export async function createVersion(
  payload: VersionFormData,
): Promise<VersionMutationResponse> {
  try {
    const res = await apiClient.post(
      '/teams/version-systems',
      {
        version: payload.version,
        generation: payload.generation,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const parsed = VersionMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw create response', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success') {
        return res.data;
      }
      throw new Error('Invalid response format: Expected a success response');
    }

    return parsed.data;
  } catch (error: any) {
    console.error('Failed to create version system:', error);
    const message =
      error.response?.data?.message ||
      'Gagal membuat version system. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}

/**
 * POST /teams/features
 * Creates a new version systems.
 */
export async function createFeature(
  payload: FeatureFormData,
): Promise<FeatureMutationResponse> {
  try {
    const res = await apiClient.post(
      '/teams/features',
      {
        name: payload.name,
        content: payload.content,
        version_system_id: payload.version_system_id
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const parsed = FeatureMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw create response', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success') {
        return res.data;
      }
      throw new Error('Invalid response format: Expected a success response');
    }

    return parsed.data;
  } catch (error: any) {
    console.error('Failed to create feature:', error);
    const message =
      error.response?.data?.message ||
      'Gagal membuat feature. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}

/**
 * PUT /teams/:id
 * Updates an existing team.
 */
export async function updateTeam(
  id: string,
  payload: TeamFormData,
): Promise<TeamMutationResponse> {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID provided');
    }
    const formData = new FormData();
    if (payload.role) {
      formData.append('role', payload.role);
    }
    if (payload.image instanceof File) {
      formData.append('image', payload.image);
    }
    if (payload.user_id) {
      formData.append('user_id', payload.user_id);
    }
    if (payload.generation) {
      formData.append('generation', payload.generation);
    }

    const res = await apiClient.put(`/teams/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const parsed = TeamMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw update response', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success') {
        return res.data;
      }
      throw new Error('Invalid response format: Expected a success response');
    }

    return parsed.data;
  } catch (error: any) {
    console.error(`Failed to update team with ID ${id}:`, error);
    const message = error.response?.data?.message || `Gagal memperbarui tim dengan ID ${id}. Silakan coba lagi nanti.`;
    throw new Error(message);
  }
}

/**
 * PUT /teams/version-systems/:id
 * Updates an existing team.
 */
export async function updateVersion(
  id: string,
  payload: VersionFormData,
): Promise<VersionMutationResponse> {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID provided');
    }

    const body = {
      version: payload.version ?? undefined,
      generation: payload.generation ?? undefined,
    };

    const res = await apiClient.put(
      `/teams/version-systems/${id}`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const parsed = VersionMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw update response', {
        errors: parsed.error.flatten(),
      });

      if (res.data?.status === 'success') {
        return res.data;
      }

      throw new Error('Invalid response format: Expected a success response');
    }

    return parsed.data;
  } catch (error: any) {
    console.error(`Failed to update version system with ID ${id}:`, error);

    const message =
      error.response?.data?.message ||
      `Gagal memperbarui versi sistem dengan ID ${id}. Silakan coba lagi nanti.`;

    throw new Error(message);
  }
}

/**
 * PUT /teams/features/:id
 * Updates an existing team.
 */
export async function updateFeature(
  id: string,
  payload: FeatureFormData,
): Promise<FeatureMutationResponse> {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID provided');
    }

    const body = {
      name: payload.name ?? undefined,
      content: payload.content ?? undefined,
      version_system_id: payload.version_system_id ?? undefined,
    };

    const res = await apiClient.put(
      `/teams/features/${id}`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const parsed = FeatureMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw update response', {
        errors: parsed.error.flatten(),
      });

      if (res.data?.status === 'success') {
        return res.data;
      }

      throw new Error('Invalid response format: Expected a success response');
    }

    return parsed.data;
  } catch (error: any) {
    console.error(`Failed to update features with ID ${id}:`, error);

    const message =
      error.response?.data?.message ||
      `Gagal memperbarui fitur dengan ID ${id}. Silakan coba lagi nanti.`;

    throw new Error(message);
  }
}

/**
 * DELETE /teams/:id
 * Deletes a team by ID.
 */
export async function deleteTeam(id: string): Promise<void> {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID provided');
    }
    await apiClient.delete(`/teams/${id}`);
  } catch (error: any) {
    console.error(`Failed to delete team with ID ${id}:`, error);
    const message = error.response?.data?.message || `Gagal menghapus tim dengan ID ${id}. Silakan coba lagi nanti.`;
    throw new Error(message);
  }
}

/**
 * DELETE /teams/version-systems/:id
 * Deletes a team by ID.
 */
export async function deleteVersion(id: string): Promise<void> {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID provided');
    }
    await apiClient.delete(`/teams/version-systems/${id}`);
  } catch (error: any) {
    console.error(`Failed to delete version system with ID ${id}:`, error);
    const message = error.response?.data?.message || `Gagal menghapus versi sistem dengan ID ${id}. Silakan coba lagi nanti.`;
    throw new Error(message);
  }
}

/**
 * DELETE /teams/features/:id
 * Deletes a team by ID.
 */
export async function deleteFeature(id: string): Promise<void> {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID provided');
    }
    await apiClient.delete(`/teams/features/${id}`);
  } catch (error: any) {
    console.error(`Failed to delete features with ID ${id}:`, error);
    const message = error.response?.data?.message || `Gagal menghapus fitur dengan ID ${id}. Silakan coba lagi nanti.`;
    throw new Error(message);
  }
}

/**
 * GET /users
 * Fetches users with optional search query.
 */
export async function getUsers(search?: string): Promise<User[]> {
  try {
    const url = search ? `/users?query=${encodeURIComponent(search)}` : '/users';
    const res = await apiClient.get(url);
    const parsed = UserListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw user data', { errors: parsed.error.flatten() });
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format: Expected an array of users');
    }

    return parsed.data.data;
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    const message = error.response?.data?.message || 'Gagal memuat data pengguna. Silakan coba lagi nanti.';
    throw new Error(message);
  }
}