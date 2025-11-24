import { ApiService } from './api.service';

// login member
export const login = (credentials) => {
  return ApiService.post('/auth/login', credentials);
};

// logout member
export const logout = () => {
  return ApiService.delete('/auth/logout');
};

// register member
export const registerMember = (data) => {
  return ApiService.post(`/users/register`, data);
};

// check auth status
export const checkAuthStatus = () => {
  return ApiService.get('/auth/check-status');
};

// send email otp
export const emailOtp = (data) => {
  return ApiService.post(`/users/send-otp`, data);
};

// verify otp
export const verifyOtp = (data) => {
  return ApiService.post(`/users/verify-otp`, data);
};

// forgot password
export const forgotPassword = (data) => {
  return ApiService.post('/users/forgot-password', data);
};

// reset password
export const resetPassword = (data) => {
  return ApiService.put('/users/reset-password', data);
};
