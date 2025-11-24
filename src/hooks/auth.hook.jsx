import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/authContext';
import { login as apiLogin, forgotPassword, resetPassword } from '../services/auth.api';

export const useLogin = () => {
  const { login } = useAuth();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (payload) => {
      const response = await apiLogin(payload);

      if (!response.data || !response.data.data) {
        throw new Error('Invalid login response structure.');
      }

      const { name, unique_number } = response.data.data;

      if (name && unique_number ) {
        const userData = { name, unique_number, rememberMe: payload.remember_me };

        return { userData, rememberMe: payload.remember_me };
      } else {
        throw new Error('Login response did not include all required user data.');
      }
    },

    onSuccess: ({ userData, rememberMe }) => {
      login(userData, rememberMe);
    },

    onError: (err) => {
      console.error('Login mutation failed:', err.message);
    }
  });

  return {
    executeLogin: mutateAsync,
    isLoading: isPending,
    error
  };
};

export const useForgotPassword = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data) => {
      const response = await forgotPassword(data);

      if (!response.data || !response.data.message) {
        throw new Error('Invalid forgot password response structure.');
      }

      return response.data.message;
    },

    onError: (err) => {
      console.error('Forgot password mutation failed:', err.message);
    }
  });

  return {
    executeForgotPassword: mutateAsync,
    isLoading: isPending,
    error
  };
};

export const useResetPassword = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data) => {
      const response = await resetPassword(data);

      if (!response.data || !response.data.message) {
        throw new Error('Invalid reset password response structure.');
      }

      return response.data.message;
    },

    onError: (err) => {
      console.error('Reset password mutation failed:', err.message);
    }
  });

  return {
    executeResetPassword: mutateAsync,
    isLoading: isPending,
    error
  };
};
