import { submitHelpRequest } from '../services/help.api.jsx';
import { useMutation } from '@tanstack/react-query';

export const useSubmitHelpRequest = () => {
  const { mutateAsync, isPending, error, data } = useMutation({
    mutationFn: async (helpData) => {
      const response = await submitHelpRequest(helpData);
      return response.data;
    }
  });
  return {
    executeSubmitHelpRequest: mutateAsync,
    isLoading: isPending,
    error,
    data
  };
};
