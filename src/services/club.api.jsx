import { ApiService } from './api.service'; 

export const getAllStudentClubs = () => {
  return ApiService.get(`/student-clubs`);
};

export const getStudentClubById = (id) => {
  return ApiService.get(`/student-clubs/${id}`);
};