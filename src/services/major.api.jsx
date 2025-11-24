import { ApiService } from './api.service';

export const getAllMajors = () => {
  return ApiService.get('/major-campus');
};
