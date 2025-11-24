import { useQuery } from '@tanstack/react-query';
import { getAllStudentChapters, getStudentChapterById } from '../services/chapter.api';

// get all student chapters
export const useAllStudentChapters = () => {
  const queryKey = ['studentChapters'];

  const queryFn = async () => {
    const response = await getAllStudentChapters();
    return response.data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
  });

  return {
    chapters: data || [],
    isLoading,
    error: isError ? error : null,
    refetch,
  };
};

// get student chapter by id
export const useStudentChapterById = (id) => {
  const queryKey = ['studentChapter', id];

  const queryFn = async () => {
    const response = await getStudentChapterById(id);
    return response.data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    
    enabled: !!id,
  });

  return {
    chapter: data || null,
    isLoading,
    error: isError ? error : null,
    refetch,
  };
};