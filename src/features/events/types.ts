import { z } from 'zod';
import {
  EventSchema,
  EventFormSchema,
  EventUpdateFormSchema,
  EventMutationResponseSchema,
  StudentClubSchema,
  ProgramSchema,
  StudentChapterSchema,
} from './schemas';

export type Event = z.infer<typeof EventSchema>;
export type EventDetail = Event;

export type EventFormData = z.infer<typeof EventFormSchema>;
export type EventUpdateFormData = z.infer<typeof EventUpdateFormSchema>;

export type EventMutationResponse = z.infer<typeof EventMutationResponseSchema>;

export type StudentClub = z.infer<typeof StudentClubSchema>;
export type Program = z.infer<typeof ProgramSchema>;
export type StudentChapter = z.infer<typeof StudentChapterSchema>;