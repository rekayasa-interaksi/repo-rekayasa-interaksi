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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useCreateOrganizationalStructure, useUpdateOrganizationalStructure, useStudentClubs, useStudentChapters, useMembers } from '../queries';
import { OrganizationalStructureFormSchema } from '../schemas';
import type { OrganizationalStructure, OrganizationalStructureFormData } from '../types';
import { Combobox } from '@/components/ui/combobox';
import { useDebounce } from 'use-debounce';
import { toast } from 'sonner';
import { useState } from 'react';

interface OrganizationalStructureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  structure?: OrganizationalStructure;
}

export function OrganizationalStructureDialog({ open, onOpenChange, mode, structure }: OrganizationalStructureDialogProps) {
  const createMutation = useCreateOrganizationalStructure();
  const updateMutation = useUpdateOrganizationalStructure();
  const [clubSearch, setClubSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMemberName, setSelectedMemberName] = useState<string | undefined>(undefined);
  const users = useMembers(memberSearch);
  const [chapterSearch, setChapterSearch] = useState('');
  const [debouncedClubSearch] = useDebounce(clubSearch, 300);
  const [debouncedChapterSearch] = useDebounce(chapterSearch, 300);
  const studentClubs = useStudentClubs(debouncedClubSearch);
  const studentChapters = useStudentChapters(debouncedChapterSearch);

  const form = useForm<OrganizationalStructureFormData>({
    resolver: zodResolver(OrganizationalStructureFormSchema),
    defaultValues: {
      type: 'digistar_club',
      position: '',
      image: undefined,
      student_club_id: '',
      student_chapter_id: '',
      user_id: '',
      generation: '',
    },
  });

  useEffect(() => {
    if (open && mode === 'edit' && structure) {
      form.reset({
        type: structure.type,
        position: structure.position,
        image: undefined,
        student_club_id: structure.student_club?.id ?? '',
        student_chapter_id: structure.student_chapter?.id ?? '',
        user_id: structure.user?.id ?? '',
        generation: structure.generation ?? '',
      });
    } else if (open) {
      form.reset({
        type: 'digistar_club',
        position: '',
        image: undefined,
        student_club_id: '',
        student_chapter_id: '',
        user_id: '',
        generation: '',
      });
    }
  }, [open, mode, structure, form]);

  const onSubmit = async (data: OrganizationalStructureFormData) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data);
      } else {
        await updateMutation.mutateAsync({ id: structure!.id, payload: data });
      }
      onOpenChange(false);
      form.reset();
      toast.success(mode === 'create' ? 'Struktur organisasi berhasil dibuat' : 'Struktur organisasi berhasil diubah');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(mode === 'create' ? 'Gagal membuat struktur organisasi' : 'Gagal mengubah struktur organisasi');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Tambah Struktur Organisasi' : 'Edit Struktur Organisasi'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Isi data struktur organisasi baru di bawah ini.'
              : 'Edit data struktur organisasi di bawah ini.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Member <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Combobox
                      options={
                        users.data?.map((user) => ({
                          value: user.id,
                          label: user.name,
                        })) || (selectedMemberName && field.value ? [{ value: field.value, label: selectedMemberName }] : [])
                      }
                      placeholder={users.isLoading ? 'Memuat member...' : 'Cari member...'}
                      onSearch={(value) => {
                        setMemberSearch(value);
                        setSelectedMemberName(undefined); // Reset selected name when searching
                      }}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        const selectedOption = users.data?.find((user) => user.id === value);
                        setSelectedMemberName(selectedOption?.name);
                      }}
                      disabled={users.isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs mt-1.5" />
                  {users.error && (
                    <p className="text-xs text-red-500 mt-1.5">Gagal memuat member: {users.error.message}</p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="digistar_club">Digistar Club</SelectItem>
                        <SelectItem value="student_club">Student Club</SelectItem>
                        <SelectItem value="campus_chapter">Campus Chapter</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posisi <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan posisi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="generation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Angkatan <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan angkatan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) form.setValue('image', file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="student_club_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Klub Mahasiswa</FormLabel>
                  <FormControl>
                    <Combobox
                      options={studentClubs.data?.map((club) => ({
                        value: club.id,
                        label: club.name,
                      })) || []}
                      placeholder={studentClubs.isLoading ? 'Memuat klub...' : 'Cari klub mahasiswa...'}
                      onSearch={setClubSearch}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={studentClubs.isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                  {studentClubs.error && (
                    <p className="text-xs text-red-500 mt-1">Gagal memuat klub: {studentClubs.error.message}</p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="student_chapter_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chapter Mahasiswa</FormLabel>
                  <FormControl>
                    <Combobox
                      options={studentChapters.data?.map((chapter) => ({
                        value: chapter.id,
                        label: chapter.institute,
                      })) || []}
                      placeholder={studentChapters.isLoading ? 'Memuat chapter...' : 'Cari chapter mahasiswa...'}
                      onSearch={setChapterSearch}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={studentChapters.isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                  {studentChapters.error && (
                    <p className="text-xs text-red-500 mt-1">Gagal memuat chapter: {studentChapters.error.message}</p>
                  )}
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {mode === 'create' ? 'Tambah' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}