import { ApiService } from './api.service';

export const getFaqs = (params) => {
  return ApiService.get('/faq', {params: params });
};

export const getFaqById = (id) => {
  return ApiService.get(`/faq/${id}`);
};