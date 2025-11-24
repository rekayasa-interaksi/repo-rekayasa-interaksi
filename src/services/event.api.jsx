import { ApiService } from './api.service';

export const getAllEvents = (page = 1, limit = 10, query = '', status = 'all') => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);

  if (query) {
    params.append('query', query);
  }

  if (status && status !== 'all') {
    params.append('status', status);
  }
  return ApiService.get(`/events?${params.toString()}`);
};

export const getEventById = (id) => {
  return ApiService.get(`/events/${id}`);
};

export const registerEvent = (data) => {
  return ApiService.post(`/events/register`, data);
};

export const feedbackEvent = (data) => {
  return ApiService.post(`/events/feedback`, data);
};

export const getAllEventDoc = (params) => {
  const searchParams = new URLSearchParams();

  if (params.isBig !== undefined) {
    searchParams.append('isBig', params.isBig);
  }
  if (params.is_active !== undefined) {
    searchParams.append('is_active', params.is_active);
  }

  const queryString = searchParams.toString();

  return ApiService.get(`/events/public/documentations${queryString ? `?${queryString}` : ''}`);
};
