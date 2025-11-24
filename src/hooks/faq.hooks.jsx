import { useQuery } from '@tanstack/react-query';
import { getFaqs, getFaqById } from '../services/faq.api';

// get all faqs
export const useFaqs = ({ menu, page = 1, limit = 6 }) => {
  const queryKey = ['faqs', menu, page, limit];

  const queryFn = async () => {
    const params = { menu, page, limit };
    const response = await getFaqs(params);
    return response.data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn
  });

  return {
    faqs: data || [],
    isLoading,
    error: isError ? error : null,
    refetch
  };
};

// get faq by id
export const useFaqById = (id) => {
  const queryKey = ['faq', id];

  const queryFn = async () => {
    const response = await getFaqById(id);
    return response.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,

    enabled: !!id
  });

  return {
    faq: data || null,
    isLoading,
    error: isError ? error : null,
    refetch
  };
};
