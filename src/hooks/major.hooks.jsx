import { useQuery } from '@tanstack/react-query';
import { getAllMajors } from '../services/major.api';

// get all majors
export const useAllMajors = () => {
  const queryKey = ['majors'];

  const queryFn = async () => {
    const response = await getAllMajors();
    return response.data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
  });

  return {
    majors: data || [],
    isLoading,
    error: isError ? error : null,
    refetch,
  };
};