import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createEvent,
  getEvents,
  getEventDetail,
  updateEvent,
  deleteEvent,
  getStudentClubs,
  getPrograms,
  getStudentChapters,
  getEventRegistrants,
  getEventFeedbacks,
} from './services';
import type {
  Event,
  EventFormData,
  EventUpdateFormData,
  StudentClub,
  Program,
  StudentChapter,
} from './types';

export const EventKeys = {
  all: ['events'] as const,
  list: () => [...EventKeys.all, 'list'] as const,
  detail: (id: string) => [...EventKeys.all, 'detail', id] as const,
  studentClubs: (search?: string) => ['student-clubs', search || ''] as const,
  programs: (search?: string) => ['programs', search || ''] as const,
  studentChapters: (search?: string) => ['student-chapters', search || ''] as const,
};

export function useEvents() {
  return useQuery<Event[]>({
    queryKey: EventKeys.list(),
    queryFn: async () => {
      const response = await getEvents();
      return response;
    },
    placeholderData: (prev) => prev,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: EventKeys.detail(id),
    queryFn: () => getEventDetail(id),
    enabled: !!id,
    placeholderData: (prev) => prev,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EventFormData) => {
      return createEvent(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EventKeys.list() });
      toast.success('Event berhasil dibuat');
    },
    onError: (error) => {
      toast.error('Gagal membuat event');
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: EventUpdateFormData }) => {
      console.log('Updating event:', id, payload);
      return updateEvent(id, payload);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: EventKeys.list() });
      queryClient.invalidateQueries({ queryKey: EventKeys.detail(id) });
      toast.success('Event berhasil diubah');
    },
    onError: (error) => {
      console.error('Update event error:', error);
      toast.error('Gagal mengubah event');
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EventKeys.list() });
      toast.success('Event berhasil dihapus');
    },
    onError: (error) => {
      console.error('Delete event error:', error);
      toast.error('Gagal menghapus event');
    },
  });
}

export function useStudentClubs(search?: string) {
  return useQuery({
    queryKey: EventKeys.studentClubs(search),
    queryFn: () => getStudentClubs(search),
    placeholderData: [],
  });
}

export function usePrograms(search?: string) {
  return useQuery({
    queryKey: EventKeys.programs(search),
    queryFn: () => getPrograms(search),
    placeholderData: [],
  });
}

export function useStudentChapters(search?: string) {
  return useQuery({
    queryKey: EventKeys.studentChapters(search),
    queryFn: () => getStudentChapters(search),
    placeholderData: [],
  });
}

export function useEventRegistrants(eventId: string) {
  return useQuery({
    queryKey: ['event-registrants', eventId],
    queryFn: () => getEventRegistrants(eventId),
    enabled: !!eventId,
    placeholderData: [],
  });
}

export function useEventFeedbacks(eventId: string) {
  return useQuery({
    queryKey: ['event-feedbacks', eventId],
    queryFn: () => getEventFeedbacks(eventId),
    enabled: !!eventId,
    placeholderData: [],
  });
}