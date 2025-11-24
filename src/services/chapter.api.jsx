import { ApiService } from './api.service'; 

export const getAllStudentChapters = () => {
  return ApiService.get(`/student-chapters`);
};

export const getStudentChapterById = (id) => {
  return ApiService.get(`/student-chapters/${id}`);
};