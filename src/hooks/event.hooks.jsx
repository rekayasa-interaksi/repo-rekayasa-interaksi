import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getAllEvents,
  getEventById,
  registerEvent,
  feedbackEvent,
  getAllEventDoc
} from '../services/event.api';

// get all events
export const useAllEvents = (page = 1, limit = 10, query = '', status = 'all') => {
  const queryKey = ['events', { page, limit, query, status }];

  const queryFn = async () => {
    const response = await getAllEvents(page, limit, query, status);
    return response.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn
  });

  return {
    events: data?.data || [],
    metaData: data?.metaData,
    isLoading,
    error: isError ? error : null,
    refetch
  };
};

// get event by id
export const useEventById = (id) => {
  const queryKey = ['event', id];

  const queryFn = async () => {
    const response = await getEventById(id);
    return response.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,

    enabled: !!id,

    select: (responseData) => {
      if (Array.isArray(responseData.data) && responseData.data.length > 0) {
        return responseData.data[0];
      }
      return responseData.data;
    }
  });

  return {
    event: data,
    isLoading,
    error: isError ? error : null,
    refetch
  };
};

// register event
export const useRegisterEvent = () => {
  const mutationFn = async (registrationData) => {
    const response = await registerEvent(registrationData);
    return response.data;
  };

  const { mutateAsync, isPending, error, data } = useMutation({
    mutationFn: mutationFn
  });

  return {
    execute: mutateAsync,
    isLoading: isPending,
    error,
    data
  };
};

// feedback event
export const useFeedbackEvent = () => {
  const { mutateAsync, isPending, error, data } = useMutation({
    mutationFn: async (feedbackData) => {
      const response = await feedbackEvent(feedbackData);
      return response.data;
    }
  });

  return {
    execute: mutateAsync,
    isLoading: isPending,
    error,
    data
  };
};

// get all event documentation
export const useAllEventDoc = (params) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['eventDocs', params], 
    queryFn: async () => {
      const response = await getAllEventDoc(params); 
      return response.data.data;
    }
  });

  return {
    documents: data || [],
    isLoading,
    error: isError ? error : null,
    refetch
  };
};