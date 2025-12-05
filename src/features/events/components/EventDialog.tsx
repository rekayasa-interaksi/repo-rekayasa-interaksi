import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useCreateEvent, useUpdateEvent, useStudentClubs, usePrograms, useStudentChapters } from '../queries';
import { EventFormSchema, EventUpdateFormSchema } from '../schemas';
import type { Event, EventFormData, EventUpdateFormData } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Combobox } from '@/components/ui/combobox';
import { useDebounce } from 'use-debounce';
import { toast } from 'sonner';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  event?: Event;
}

interface ImageMetadata {
  id?: string;
  url?: string;
  file?: File;
  activated: boolean;
}

export function EventDialog({ open, onOpenChange, mode, event }: EventDialogProps) {
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const [descriptionTab, setDescriptionTab] = useState<'edit' | 'preview'>('edit');
  const [rulesTab, setRulesTab] = useState<'edit' | 'preview'>('edit');
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [clubSearch, setClubSearch] = useState('');
  const [programSearch, setProgramSearch] = useState('');
  const [chapterSearch, setChapterSearch] = useState('');
  const [debouncedClubSearch] = useDebounce(clubSearch, 300);
  const [debouncedProgramSearch] = useDebounce(programSearch, 300);
  const [debouncedChapterSearch] = useDebounce(chapterSearch, 300);
  const [selectedClubName, setSelectedClubName] = useState<string | undefined>(undefined);
  const [selectedProgramName, setSelectedProgramName] = useState<string | undefined>(undefined);
  const [selectedChapterName, setSelectedChapterName] = useState<string | undefined>(undefined);

  const studentClubs = useStudentClubs(debouncedClubSearch);
  const programs = usePrograms(debouncedProgramSearch);
  const studentChapters = useStudentChapters(debouncedChapterSearch);

  useEffect(() => {
    console.log('studentClubs:', {
      isLoading: studentClubs.isLoading,
      data: studentClubs.data,
      error: studentClubs.error,
      search: debouncedClubSearch,
    });
    console.log('programs:', {
      isLoading: programs.isLoading,
      data: programs.data,
      error: programs.error,
      search: debouncedProgramSearch,
    });
    console.log('studentChapters:', {
      isLoading: studentChapters.isLoading,
      data: studentChapters.data,
      error: studentChapters.error,
      search: debouncedChapterSearch,
    });
  }, [studentClubs, programs, studentChapters, debouncedClubSearch, debouncedProgramSearch, debouncedChapterSearch]);

  const form = useForm<EventUpdateFormData>({
    resolver: zodResolver(EventUpdateFormSchema),
    defaultValues: {
      images: [],
      name: '',
      description: '',
      link_tor: '',
      student_club_id: undefined,
      program_id: undefined,
      student_chapter_id: undefined,
      is_big: false,
      instagram: '',
      zoom: '',
      rules: '',
      event_activated: false,
      place: 'online',
      status: 'upcoming',
      type: 'public',
      detail_events: [{ title: '', date: '', start_time: '', end_time: '' }],
      deleted_image_ids: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'detail_events',
  });

  useEffect(() => {
    if (open) {
      console.log('EventDialog rendered, open:', open, 'mode:', mode, 'event:', event);
      if (mode === 'edit' && event) {
        form.reset({
          images: [],
          name: event.name,
          description: event.description,
          link_tor: event.link_tor,
          student_club_id: event.student_club?.id,
          program_id: event.program?.id,
          student_chapter_id: event.student_chapter?.id,
          is_big: event.is_big,
          instagram: event.links?.instagram,
          zoom: event.links?.zoom,
          rules: event.rules,
          event_activated: event.event_activate,
          place: event.place,
          status: event.status,
          type: event.type,
          detail_events:
            event.detail_events?.map((detail) => ({
              title: detail.title,
              date: detail.date,
              start_time: detail.start_time,
              end_time: detail.end_time,
            })) ?? [{ title: '', date: '', start_time: '', end_time: '' }],
          deleted_image_ids: [],
        });
        setSelectedClubName(event.student_club?.name);
        setSelectedProgramName(event.program?.name);
        setSelectedChapterName(event.student_chapter?.institute);
        setClubSearch('');
        setProgramSearch('');
        setChapterSearch('');
      } else {
        form.reset({
          images: [],
          name: '',
          description: '',
          link_tor: '',
          student_club_id: undefined,
          program_id: undefined,
          student_chapter_id: undefined,
          is_big: false,
          instagram: '',
          zoom: '',
          rules: '',
          event_activated: false,
          place: 'online',
          status: 'upcoming',
          type: 'public',
          detail_events: [{ title: '', date: '', start_time: '', end_time: '' }],
          deleted_image_ids: [],
        });
        setSelectedClubName(undefined);
        setSelectedProgramName(undefined);
        setSelectedChapterName(undefined);
        setClubSearch('');
        setProgramSearch('');
        setChapterSearch('');
      }
      setDescriptionTab('edit');
      setRulesTab('edit');
      setImages([]);
      setDeletedImageIds([]);
    }
  }, [open, mode, event, form]);

  useEffect(() => {
    console.log('Images state updated:', images);
    const files = images.filter((img) => img.file).map((img) => img.file!);
    console.log('Setting form images:', files);
    form.setValue('images', files);
    const previews = images
      .filter((img) => img.file || img.url)
      .map((img) => (img.file ? URL.createObjectURL(img.file) : img.url!));
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [images, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length + images.length > 8) {
      form.setError('images', { message: 'Maksimum 8 gambar diperbolehkan' });
      return;
    }
    setImages((prev) => [
      ...prev,
      ...newFiles.map((file, index) => ({
        file,
        activated: prev.length === 0 && index === 0 && !prev.some((img) => img.activated),
      })),
    ]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const removedImage = prev[index];
      if (removedImage.id) {
        setDeletedImageIds((ids) => [...ids, removedImage.id!]);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleToggleActivated = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        activated: i === index ? true : false,
      }))
    );
  };

  const onSubmit = async (data: EventUpdateFormData) => {
    console.log('Form data before submission:', data);
  console.log('Images state:', images);
    try {
      if (mode === 'create') {
        const createValidation = EventFormSchema.safeParse({
            ...data,
            images: images.filter((img) => img.file).map((img) => img.file!),
        });
        // const createValidation = EventFormSchema.safeParse(data);
        if (!createValidation.success) {
          createValidation.error.issues.forEach((issue) => {
            form.setError(issue.path[0] as keyof EventUpdateFormData, {
              message: issue.message,
            });
          });
          return;
        }
        const payload: EventFormData = createValidation.data;
        console.log('Creating event:', payload);
        await createMutation.mutateAsync(payload);
      } else {
        const payload: EventUpdateFormData = {
          ...data,
          images: images.filter((img) => img.file).map((img) => img.file!),
          deleted_image_ids: deletedImageIds,
        };
        console.log('Updating event:', event?.id, payload);
        await updateMutation.mutateAsync({
          id: event!.id,
          payload,
        });
      }
      onOpenChange(false);
      form.reset();
      toast.success(mode === 'create' ? 'Event berhasil dibuat' : 'Event berhasil diubah');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(mode === 'create' ? 'Gagal membuat event' : 'Gagal mengubah event');
    }
  };

  const handleClose = () => {
    if (form.formState.isDirty || images.length > 0) {
      if (window.confirm('Ada perubahan yang belum disimpan. Yakin ingin menutup?')) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-y-auto max-h-[90vh]">
        <div className="bg-primary/5 p-6 flex items-center gap-4 border-b">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Plus className="h-6 w-6" />
          </div>
          <DialogHeader className="gap-1.5">
            <DialogTitle className="text-xl">{mode === 'create' ? 'Tambah Event' : 'Edit Event'}</DialogTitle>
            <DialogDescription className="text-sm opacity-90">
              {mode === 'create'
                ? 'Isi data event baru di bawah ini. Semua kolom bertanda * wajib diisi.'
                : 'Edit data event di bawah ini. Gunakan - untuk bullet points dan Enter untuk baris baru pada deskripsi dan aturan.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Gambar (maks. 8) {mode === 'create' && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="bg-background border-input"
                      />
                    </FormControl>
                    {images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {images.map((img, index) => (
                          <div key={img.id || `new-${index}`} className="relative">
                            <img
                              src={img.file ? URL.createObjectURL(img.file) : img.url!}
                              alt={`Image ${index}`}
                              className={`h-20 w-20 object-cover rounded ${img.activated ? 'border-2 border-primary' : ''}`}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-0 right-0 h-6 w-6"
                              onClick={() => handleRemoveImage(index)}
                              aria-label={`Hapus gambar ${index + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant={img.activated ? 'default' : 'outline'}
                              size="sm"
                              className="absolute bottom-0 left-0 text-xs"
                              onClick={() => handleToggleActivated(index)}
                              aria-label={img.activated ? 'Nonaktifkan gambar' : 'Aktifkan gambar'}
                            >
                              {img.activated ? 'Aktif' : 'Set Aktif'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Nama Event {mode === 'create' && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama event" {...field} className="h-11 px-4" value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Deskripsi {mode === 'create' && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <Tabs value={descriptionTab} onValueChange={(value) => setDescriptionTab(value as 'edit' | 'preview')} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 h-9">
                        <TabsTrigger value="edit" className="h-full">Edit</TabsTrigger>
                        <TabsTrigger value="preview" className="h-full">Pratinjau</TabsTrigger>
                      </TabsList>
                      <TabsContent value="edit" className="mt-4">
                        <FormControl>
                          <Textarea
                            placeholder={
                              `- Contoh bullet point pertama\n` +
                              `- Contoh bullet point kedua\n` +
                              `Teks biasa dengan baris baru`
                            }
                            {...field}
                            className="min-h-[100px]"
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1.5" />
                      </TabsContent>
                      <TabsContent value="preview" className="mt-4">
                        <div className="min-h-[100px] p-3 bg-background border border-input rounded-md prose prose-sm max-w-none">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              ol: ({ children, ...props }) => (
                                <ol className="list-decimal list-inside" {...props}>
                                  {children}
                                </ol>
                              ),
                              ul: ({ children, ...props }) => (
                                <ul className="list-disc list-inside" {...props}>
                                  {children}
                                </ul>
                              ),
                            }}
                            >
                            {field.value || 'Masukkan deskripsi untuk melihat pratinjau'}
                          </ReactMarkdown>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link_tor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Link TOR {mode === 'create' && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan link TOR" {...field} className="h-11 px-4" value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="student_club_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Klub Mahasiswa (Opsional)</FormLabel>
                    <FormControl>
                      <Combobox
                        options={
                          studentClubs.data?.map((club) => ({
                            value: club.id,
                            label: club.name,
                          })) || (selectedClubName && field.value ? [{ value: field.value, label: selectedClubName }] : [])
                        }
                        placeholder={studentClubs.isLoading ? 'Memuat klub...' : 'Cari klub mahasiswa...'}
                        onSearch={(value) => {
                          setClubSearch(value);
                          setSelectedClubName(undefined); // Reset selected name when searching
                        }}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          const selectedOption = studentClubs.data?.find((club) => club.id === value);
                          setSelectedClubName(selectedOption?.name);
                        }}
                        disabled={studentClubs.isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                    {studentClubs.error && (
                      <p className="text-xs text-red-500 mt-1.5">Gagal memuat klub: {studentClubs.error.message}</p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="program_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Program (Opsional)</FormLabel>
                    <FormControl>
                      <Combobox
                        options={
                          programs.data?.map((program) => ({
                            value: program.id,
                            label: program.name,
                          })) || (selectedProgramName && field.value ? [{ value: field.value, label: selectedProgramName }] : [])
                        }
                        placeholder={programs.isLoading ? 'Memuat program...' : 'Cari program...'}
                        onSearch={(value) => {
                          setProgramSearch(value);
                          setSelectedProgramName(undefined);
                        }}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          const selectedOption = programs.data?.find((program) => program.id === value);
                          setSelectedProgramName(selectedOption?.name);
                        }}
                        disabled={programs.isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                    {programs.error && (
                      <p className="text-xs text-red-500 mt-1.5">Gagal memuat program: {programs.error.message}</p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="student_chapter_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Chapter Mahasiswa (Opsional)</FormLabel>
                    <FormControl>
                      <Combobox
                        options={
                          studentChapters.data?.map((chapter) => ({
                            value: chapter.id,
                            label: chapter.name,
                          })) || (selectedChapterName && field.value ? [{ value: field.value, label: selectedChapterName }] : [])
                        }
                        placeholder={studentChapters.isLoading ? 'Memuat chapter...' : 'Cari chapter mahasiswa...'}
                        onSearch={(value) => {
                          setChapterSearch(value);
                          setSelectedChapterName(undefined);
                        }}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          const selectedOption = studentChapters.data?.find((chapter) => chapter.id === value);
                          setSelectedChapterName(selectedOption?.name);
                        }}
                        disabled={studentChapters.isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                    {studentChapters.error && (
                      <p className="text-xs text-red-500 mt-1.5">Gagal memuat chapter: {studentChapters.error.message}</p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_big"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="text-base font-medium">Event Besar</FormLabel>
                    <FormControl>
                      <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Link Instagram {mode === 'create' && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan link Instagram" {...field} className="h-11 px-4" value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zoom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Link Zoom {mode === 'create' && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan link Zoom" {...field} className="h-11 px-4" value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Aturan {mode === 'create' && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <Tabs value={rulesTab} onValueChange={(value) => setRulesTab(value as 'edit' | 'preview')} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 h-9">
                        <TabsTrigger value="edit" className="h-full">Edit</TabsTrigger>
                        <TabsTrigger value="preview" className="h-full">Pratinjau</TabsTrigger>
                      </TabsList>
                      <TabsContent value="edit" className="mt-4">
                        <FormControl>
                          <Textarea
                            placeholder={
                              `- Aturan pertama\n` +
                              `- Aturan kedua\n` +
                              `Teks biasa dengan baris baru`
                            }
                            {...field}
                            className="min-h-[100px]"
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1.5" />
                      </TabsContent>
                      <TabsContent value="preview" className="mt-4">
                        <div className="min-h-[100px] p-3 bg-background border border-input rounded-md prose prose-sm max-w-none">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              ol: ({ children, ...props }) => (
                                <ol className="list-decimal list-inside" {...props}>
                                  {children}
                                </ol>
                              ),
                              ul: ({ children, ...props }) => (
                                <ul className="list-disc list-inside" {...props}>
                                  {children}
                                </ul>
                              ),
                            }}
                            >
                            {field.value || 'Masukkan aturan untuk melihat pratinjau'}
                          </ReactMarkdown>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="event_activated"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="text-base font-medium">Aktifkan Event</FormLabel>
                    <FormControl>
                      <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Tempat {mode === 'create' && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pilih tempat" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                          <SelectItem value="both">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Status {mode === 'create' && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                          <SelectItem value="cancel">Cancel</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Tipe {mode === 'create' && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel className="text-base font-medium">
                  Detail Events {mode === 'create' && <span className="text-red-500">*</span>}
                </FormLabel>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 border p-4 rounded-md mt-4">
                    <FormField
                      control={form.control}
                      name={`detail_events.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Judul {mode === 'create' && <span className="text-red-500">*</span>}</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan judul" {...field} className="h-11 px-4" value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage className="text-xs mt-1.5" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`detail_events.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal {mode === 'create' && <span className="text-red-500">*</span>}</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="h-11 px-4" value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage className="text-xs mt-1.5" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`detail_events.${index}.start_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Waktu Mulai {mode === 'create' && <span className="text-red-500">*</span>}</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} className="h-11 px-4" value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage className="text-xs mt-1.5" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`detail_events.${index}.end_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Waktu Selesai {mode === 'create' && <span className="text-red-500">*</span>}</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} className="h-11 px-4" value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage className="text-xs mt-1.5" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      aria-label={`Hapus detail event ${index + 1}`}
                    >
                      Hapus Detail
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ title: '', date: '', start_time: '', end_time: '' })}
                  className="mt-2"
                  aria-label="Tambah detail event"
                >
                  Tambah Detail Event
                </Button>
              </div>
            </div>

            <DialogFooter className="flex flex-row gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 hover:text-white hover:bg-red-500 transition-all duration-300"
                aria-label="Batal"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 gap-2"
                aria-label={mode === 'create' ? 'Tambah event' : 'Simpan event'}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  mode === 'create' ? 'Menambahkan...' : 'Menyimpan...'
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    {mode === 'create' ? 'Tambah' : 'Simpan'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}