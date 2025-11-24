import { ApiService } from './api.service';

export const getAllMembers = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      !(typeof value === 'object' && Object.keys(value).length === 0)
    ) {
      if (typeof value === 'object') {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, value);
      }
    }
  });

  return ApiService.get(`/users/public-information?${params.toString()}`);
};

export const getAllProgramAlumni = () => {
  return ApiService.get(`/programs-alumni`);
};

export const getAllDomiciles = () => {
  return ApiService.get(`/users/domisili`);
};

export const getUserProfile = () => {
  return ApiService.get(`/users/profile`);
};

export const updateUserProfile = (data) => {
  return ApiService.put(`/users/update-profile`, data);
}

export const deleteUserProfileImage = (type) => {
  return ApiService.patch(`/users/image/delete`, { type });
}

export const getAchievements = () => {
  return ApiService.get(`/events/achievement-user`);
};

export const getHistoryUser = () => {
  return ApiService.get(`/events/history-user`);
}
  
export const getRegisteredUser = () => {
  return ApiService.get(`/events/registered-user`);
}