import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  link_tor: z.string(),
  images: z.array(
    z.object({
      id: z.string().uuid(),
      image_path: z.string(),
      activated: z.boolean(),
      created_at: z.string().datetime(),
      created_by: z.string().uuid().nullable(),
      updated_at: z.string().datetime().nullable(),
      updated_by: z.string().uuid().nullable(),
    })
  ),
  student_club: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      image_path: z.string(),
      logo_path: z.string(),
      created_at: z.string().datetime(),
      created_by: z.string().uuid(),
      updated_at: z.string().datetime().nullable(),
      updated_by: z.string().uuid().nullable(),
    })
    .nullable(),
  student_chapter: z
    .object({
      id: z.string().uuid(),
      institute: z.string(),
      created_at: z.string().datetime(),
      created_by: z.string().uuid().nullable(),
      updated_at: z.string().datetime().nullable(),
      updated_by: z.string().uuid().nullable(),
    })
    .nullable(),
  program: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      created_at: z.string().datetime(),
      created_by: z.string().uuid().nullable(),
      updated_at: z.string().datetime().nullable(),
      updated_by: z.string().uuid().nullable(),
    })
    .nullable(),
  links: z.object({
    id: z.string().uuid(),
    zoom: z.string(),
    instagram: z.string(),
    documentation: z.string().nullable(),
    created_at: z.string().datetime(),
    created_by: z.string().uuid().nullable(),
    updated_at: z.string().datetime().nullable(),
    updated_by: z.string().uuid().nullable(),
  }),
  detail_events: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      date: z.string(),
      start_time: z.string(),
      end_time: z.string(),
      created_at: z.string().datetime(),
      created_by: z.string().uuid().nullable(),
      updated_at: z.string().datetime().nullable(),
      updated_by: z.string().uuid().nullable(),
    })
  ),
  event_activate: z.boolean(),
  status: z.enum(['upcoming', 'active', 'done', 'cancel']),
  place: z.enum(['online', 'offline']),
  type: z.enum(['exclusive', 'public']),
  rules: z.string(),
  is_big: z.boolean(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid(),
  updated_at: z.string().datetime().nullable(),
  updated_by: z.string().uuid().nullable(),
});

export const EventFormSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .max(8, 'Maksimum 8 gambar diperbolehkan')
    .refine(
      (files) => files.every((file) => file.type.startsWith('image/')),
      'Hanya file gambar yang diperbolehkan'
    ),
  name: z
    .string({ required_error: 'Nama event wajib diisi' })
    .min(1, 'Nama event tidak boleh kosong'),
  description: z
    .string({ required_error: 'Deskripsi wajib diisi' })
    .min(1, 'Deskripsi tidak boleh kosong'),
  link_tor: z
    .string({ required_error: 'Link TOR wajib diisi' })
    .min(1, 'Link TOR tidak boleh kosong')
    .url('Link TOR harus berupa URL yang valid'),
  student_club_id: z.string().optional(),
  program_id: z.string().optional(),
  student_chapter_id: z.string().optional(),
  is_big: z.boolean().default(false),
  instagram: z
    .string({ required_error: 'Link Instagram wajib diisi' })
    .min(1, 'Link Instagram tidak boleh kosong')
    .url('Link Instagram harus berupa URL yang valid'),
  zoom: z
    .string({ required_error: 'Link Zoom wajib diisi' })
    .min(1, 'Link Zoom tidak boleh kosong')
    .url('Link Zoom harus berupa URL yang valid'),
  rules: z
    .string({ required_error: 'Aturan wajib diisi' })
    .min(1, 'Aturan tidak boleh kosong'),
  event_activated: z.boolean().default(false),
  place: z.enum(['online', 'offline'], { required_error: 'Tempat wajib dipilih' }),
  status: z.enum(['upcoming', 'active', 'done', 'cancel'], {
    required_error: 'Status wajib dipilih',
  }),
  type: z.enum(['exclusive', 'public'], { required_error: 'Tipe wajib dipilih' }),
  detail_events: z
    .array(
      z.object({
        title: z
          .string({ required_error: 'Judul wajib diisi' })
          .min(1, 'Judul tidak boleh kosong'),
        date: z
          .string({ required_error: 'Tanggal wajib diisi' })
          .min(1, 'Tanggal tidak boleh kosong'),
        start_time: z
          .string({ required_error: 'Waktu mulai wajib diisi' })
          .min(1, 'Waktu mulai tidak boleh kosong'),
        end_time: z
          .string({ required_error: 'Waktu selesai wajib diisi' })
          .min(1, 'Waktu selesai tidak boleh kosong'),
      })
    )
    .min(1, 'Setidaknya satu detail event diperlukan'),
});

export const EventUpdateFormSchema = EventFormSchema.partial().extend({
  deleted_image_ids: z.array(z.string().uuid()).optional(),
});

export const StudentClubSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const ProgramSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const StudentChapterSchema = z.object({
  id: z.string(),
  institute: z.string().transform((val) => val),
}).transform((data) => ({
  ...data,
  name: data.institute,
}));

export const EventListResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.array(EventSchema),
});

export const EventDetailResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: EventSchema,
});

export const EventMutationResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.any().optional(),
});