import { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query'; 
import { emailOtp, verifyOtp } from '../services/auth.api';
import toast from 'react-hot-toast';

// OTP Timer Hook
export function useOtpTimer(initial = 300) {
  const [time, setTime] = useState(0);

  const start = useCallback(() => {
    setTime(initial);
  }, [initial]);

  const reset = useCallback(() => {
    setTime(0);
  }, []);

  useEffect(() => {
    if (time <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return { time, start, reset };
}

// OTP Sending
export const useSendOtp = () => {
  const { mutateAsync, isPending, error, data } = useMutation({
    mutationFn: async ({ email, type }) => {
      const response = await emailOtp({ email, type });
      return response.data;
    },
    onError: (err) => {
      toast.error(err.message || 'Error sending OTP');
    },
  });

  return {
    executeVerification: mutateAsync,
    isLoading: isPending,
    error,
    data,
  };
};

//  OTP Verification
export const useVerifyOtp = () => {
  const { mutateAsync, isPending, error, data } = useMutation({
    mutationFn: async ({ email, token, type }) => {
      const response = await verifyOtp({ email, token, type });
      return response.data;
    },
    onError: (err) => {
      toast.error(err.message || 'Error verifying OTP');
    },
  });

  return {
    executeVerification: mutateAsync,
    isLoading: isPending,
    error,
    data,
  };
};