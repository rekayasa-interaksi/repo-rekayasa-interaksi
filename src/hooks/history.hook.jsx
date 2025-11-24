import { useQuery } from '@tanstack/react-query';
import { getAllHistory } from '../services/history.api';

// get all history
export const useAllHistory = (group = '') => {
  const queryKey = ['histories', group];

  const queryFn = async () => {
    const response = await getAllHistory(group);
    return response.data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn
  });

  return {
    histories: data || [],
    isLoading,
    error: isError ? error : null,
    refetch
  };
};
