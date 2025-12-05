import { z } from 'zod';
import apiClient from '@/utils/apiClient';
import {
  EventListResponseSchema,
  EventDetailResponseSchema,
  EventMutationResponseSchema,
  StudentClubSchema,
  ProgramSchema,
  StudentChapterSchema,
} from './schemas';
import type {
  Event,
  EventDetail,
  EventFormData,
  EventUpdateFormData,
  EventMutationResponse,
  StudentClub,
  Program,
  StudentChapter,
} from './types';

/**
 * GET /events
 */
export async function getEvents(): Promise<Event[]> {
  try {
    const res = await apiClient.get('/events');
    const parsed = EventListResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw data without schema enforcement');
      if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
}

/**
 * GET /events/:id
 */
export async function getEventDetail(id: string): Promise<EventDetail> {
  try {
    const res = await apiClient.get(`/events/${id}`);
    const parsed = EventDetailResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      console.warn('Fallback: returning raw detail data');
      if (res.data?.status === 'success' && res.data?.data?.id) {
        return res.data.data;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.data;
  } catch (error) {
    console.error(`Failed to fetch event with ID ${id}:`, error);
    throw error;
  }
}

/**
 * POST /events
 */
export async function createEvent(payload: EventFormData): Promise<EventMutationResponse> {
  try {
    const formData = new FormData();
    payload.images.forEach((image) => {
      formData.append('image', image);
    });

    payload.images.forEach((_, index) => {
      formData.append(`event_images[${index}][activated]`, String(index === 0));
    });
    formData.append('name', payload.name);
    formData.append('description', payload.description);
    if (payload.student_club_id) formData.append('student_club_id', payload.student_club_id);
    if (payload.program_id) formData.append('program_id', payload.program_id);
    if (payload.student_chapter_id) formData.append('student_chapter_id', payload.student_chapter_id);
    formData.append('is_big', payload.is_big.toString());
    formData.append('zoom', payload.zoom);
    formData.append('instagram', payload.instagram);
    formData.append('rules', payload.rules);
    formData.append('event_activated', payload.event_activated.toString());
    formData.append('place', payload.place);
    formData.append('status', payload.status);
    formData.append('type', payload.type);
    payload.detail_events.forEach((detail, index) => {
        formData.append(`detail_events[${index}][title]`, detail.title);
        formData.append(`detail_events[${index}][date]`, detail.date);
        formData.append(`detail_events[${index}][start_time]`, detail.start_time);
        formData.append(`detail_events[${index}][end_time]`, detail.end_time);
    });

    const res = await apiClient.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const parsed = EventMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.status === 201) return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
}

/**
 * PATCH /events/:id
 */
export async function updateEvent(id: string, payload: EventUpdateFormData): Promise<EventMutationResponse> {
  try {
    const formData = new FormData();
    if (payload.images) {
      payload.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
      formData.append(
        'event_images',
        JSON.stringify(payload.images.map((_, index) => ({ activated: index === 0 })))
      );
    }
    if (payload.name) formData.append('name', payload.name);
    if (payload.description) formData.append('description', payload.description);
    if (payload.student_club_id) formData.append('student_club_id', payload.student_club_id);
    if (payload.program_id) formData.append('program_id', payload.program_id);
    if (payload.student_chapter_id) formData.append('student_chapter_id', payload.student_chapter_id);
    if (payload.is_big !== undefined) formData.append('is_big', payload.is_big.toString());
    if (payload.instagram) formData.append('links[instagram]', payload.instagram);
    if (payload.zoom) formData.append('links[zoom]', payload.zoom);
    if (payload.rules) formData.append('rules', payload.rules);
    if (payload.event_activated !== undefined) formData.append('event_activated', payload.event_activated.toString());
    if (payload.place) formData.append('place', payload.place);
    if (payload.status) formData.append('status', payload.status);
    if (payload.type) formData.append('type', payload.type);
    if (payload.detail_events) formData.append('detail_events', JSON.stringify(payload.detail_events));

    const res = await apiClient.patch(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const parsed = EventMutationResponseSchema.safeParse(res.data);

    if (!parsed.success) {
      if (res.status === 200) return res.data;
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error(`Failed to update event with ID ${id}:`, error);
    throw error;
  }
}

/**
 * DELETE /events/:id
 */
export async function deleteEvent(id: string): Promise<void> {
  try {
    await apiClient.delete(`/events/${id}`);
  } catch (error) {
    console.error(`Failed to delete event with ID ${id}:`, error);
    throw error;
  }
}

/**
 * GET /student-clubs
 */
export async function getStudentClubs(search?: string): Promise<StudentClub[]> {
  try {
    const url = search ? `/student-clubs?search=${encodeURIComponent(search)}` : '/student-clubs';
    const res = await apiClient.get(url);
    const rawData = res.data?.data ?? res.data;
    const parsed = z.array(StudentClubSchema).safeParse(rawData);

    if (!parsed.success) {
      console.warn('Fallback: returning raw student clubs data');
      if (Array.isArray(rawData)) {
        return rawData;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to fetch student clubs:', error);
    throw error;
  }
}

/**
 * GET /programs
 */
export async function getPrograms(search?: string): Promise<Program[]> {
  try {
    const url = search ? `/programs?search=${encodeURIComponent(search)}` : '/programs';
    const res = await apiClient.get(url);
    const rawData = res.data?.data ?? res.data;
    const parsed = z.array(ProgramSchema).safeParse(rawData);

    if (!parsed.success) {
      console.warn('Fallback: returning raw programs data');
      if (Array.isArray(rawData)) {
        return rawData;
      }
      throw new Error('Invalid response format');
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to fetch programs:', error);
    throw error;
  }
}

/**
 * GET /student-chapters
 */
export async function getStudentChapters(search?: string): Promise<StudentChapter[]> {
  try {
    const url = search ? `/student-chapters?search=${encodeURIComponent(search)}` : '/student-chapters';
    const res = await apiClient.get(url);
    const rawData = res.data?.data ?? res.data;
    const parsed = z.array(StudentChapterSchema).safeParse(rawData);

    if (!parsed.success) {
      console.warn('Fallback: returning raw student chapters data');
      if (Array.isArray(rawData)) {
        return rawData.map((item) => ({
          ...item,
          name: item.institute
        }));
      }
      throw new Error('Invalid response format');
    }

    return parsed.data.map((item) => ({
      ...item,
      name: item.institute
    }));
  } catch (error) {
    console.error('Failed to fetch student chapters:', error);
    throw error;
  }
}

/**
 * GET /events/registrants/:eventId
 */
export async function getEventRegistrants(eventId: string): Promise<any[]> {
  try {
    const res = await apiClient.get(`/events/registrants/${eventId}`);
    return res.data?.data ?? [];
  } catch (error) {
    console.error(`Failed to fetch registrants for event ID ${eventId}:`, error);
    throw error;
  }
}

/**
 * GET /events/feedbacks/:eventId
 */
export async function getEventFeedbacks(eventId: string): Promise<any[]> {
  try {
    const res = await apiClient.get(`/events/feedbacks/${eventId}`);
    return res.data?.data ?? [];
  } catch (error) {
    console.error(`Failed to fetch feedbacks for event ID ${eventId}:`, error);
    throw error;
  }
}