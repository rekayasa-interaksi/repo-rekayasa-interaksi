import { ApiService } from './api.service';

export const getAllOrganizations = () => {
  return ApiService.get(`/organizational-structure`);
};

export const getOrganizationById = (id) => {
  return ApiService.get(`/organizational-structure/${id}`);
};
