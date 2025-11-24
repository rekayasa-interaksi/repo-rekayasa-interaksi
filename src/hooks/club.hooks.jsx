import { useQuery } from '@tanstack/react-query';
import { getAllStudentClubs, getStudentClubById } from '../services/club.api';

// get all student clubs
export const useAllStudentClubs = () => {
  const queryKey = ['studentClubs'];

  const queryFn = async () => {
    const response = await getAllStudentClubs();
    return response.data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn
  });

  return {
    clubs: data || [],
    isLoading,
    error: isError ? error : null,
    refetch
  };
};

// get student club by id
export const useStudentClubById = (id) => {
  const queryKey = ['studentClub', id];

  const queryFn = async () => {
    const response = await getStudentClubById(id);
    return response.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,

    enabled: !!id
  });

  return {
    club: data || null,
    isLoading,
    error: isError ? error : null,
    refetch
  };
};
