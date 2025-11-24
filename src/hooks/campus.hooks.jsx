import { useQuery } from '@tanstack/react-query';
import { getAllCampuses, getCampusById } from '../services/campus.api';

// get all campuses
export const useAllCampuses = () => {
  const queryKey = ['campuses'];

  const queryFn = async () => {
    const response = await getAllCampuses();
    return response.data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
  });

  return {
    campuses: data || [],
    isLoading,
    error: isError ? error : null,
    refetch,
  };
};

// get campus by id
export const useCampusById = (id) => {
  const queryKey = ['campus', id];

  const queryFn = async () => {
    const response = await getCampusById(id);
    return response.data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    
    enabled: !!id,
  });

  return {
    campus: data || null,
    isLoading,
    error: isError ? error : null,
    refetch,
  };
};