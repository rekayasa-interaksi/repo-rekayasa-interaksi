import { useQuery } from '@tanstack/react-query';
import { getAllOrganizations, getOrganizationById } from '../services/ranger.api';

// get all organizations
export const useAllOrganizations = () => {
  const queryKey = ['organizations'];

  const queryFn = async () => {
    const response = await getAllOrganizations();
    return response.data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn
  });

  return {
    organizations: data || [],
    isLoading,
    error: isError ? error : null,
    refetch
  };
};

// get organization by id
export const useOrganizationById = (id) => {
  const queryKey = ['organization', id];

  const queryFn = async () => {
    const response = await getOrganizationById(id);
    return response.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,

    enabled: !!id
  });

  return {
    organization: data || null,
    isLoading,
    error: isError ? error : null,
    refetch
  };
};
