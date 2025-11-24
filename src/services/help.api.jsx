import { ApiService } from './api.service'; 

export const submitHelpRequest = (data) => {
  return ApiService.post(`/help-centers`, data);
};
