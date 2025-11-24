import { ApiService } from './api.service';

export const getAllHistory = (group = '') => {
  const params = new URLSearchParams();

  if (group) {
    params.append('group', group);
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/histories?${queryString}` : '/histories';

  return ApiService.get(endpoint);
};
