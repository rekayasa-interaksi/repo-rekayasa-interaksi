import axios from 'axios';
// import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_BASE_URL;

const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true
});

apiService.interceptors.request.use(
  (config) => {
    // const userCookie = Cookies.get('user_data');

    // if (userCookie) {
    //   try {
    //     const userData = JSON.parse(userCookie);
    //     if (userData && userData.access_token) {
    //       config.headers.Authorization = `Bearer ${userData.access_token}`;
    //     }
    //   } catch (error) {
    //     console.error('Error parsing user data cookie:', error);
    //   }
    // }

    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorResponse = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    };

    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.dispatchEvent(new Event('logout-event'));
          console.error('Unauthorized...');
          break;
        case 403:
          console.error("Forbidden: You don't have permission");
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API error occurred');
      }
    } else if (error.request) {
      console.error('Network error - no response received');
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(errorResponse);
  }
);

export const ApiService = {
  get: (endpoint, config) => apiService.get(endpoint, config),
  post: (endpoint, data, config) => apiService.post(endpoint, data, config),
  put: (endpoint, data, config) => apiService.put(endpoint, data, config),
  patch: (endpoint, data, config) => apiService.patch(endpoint, data, config),
  delete: (endpoint, config) => apiService.delete(endpoint, config)
};

export default apiService;
