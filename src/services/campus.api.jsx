import { ApiService } from './api.service';

export const getAllCampuses = () => {
  return ApiService.get('/student-campus');
};

export const getCampusById = (id) => {
  return ApiService.get(`/student-campus/${id}`);
};
