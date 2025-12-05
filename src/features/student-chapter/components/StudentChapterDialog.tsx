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
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Building } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateStudentChapter, useUpdateStudentChapter } from '../queries';
import { StudentChapterFormSchema } from '../schemas';
import type { StudentChapter, StudentChapterFormData } from '../types';

interface StudentChapterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  defaultValues?: StudentChapter;
}

export function StudentChapterDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
}: StudentChapterDialogProps) {
  const createMutation = useCreateStudentChapter();
  const updateMutation = useUpdateStudentChapter();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isEditing = mode === 'edit';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<StudentChapterFormData>({
    resolver: zodResolver(StudentChapterFormSchema(isEditing)),
    defaultValues: isEditing && defaultValues
      ? {
          institute: defaultValues.institute || '',
          address: defaultValues.address || '',
          image: undefined,
        }
      : {
          institute: '',
          address: '',
          image: undefined,
        },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        isEditing && defaultValues
          ? {
              institute: defaultValues.institute || '',
              address: defaultValues.address || '',
              image: undefined,
            }
          : {
              institute: '',
              address: '',
              image: undefined,
            },
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open, isEditing, defaultValues, form]);

  const onSubmit = async (data: StudentChapterFormData) => {
    try {
      const formData = new FormData();
      formData.append('institute', data.institute);
      formData.append('address', data.address);
      if (data.image) {
        formData.append('image', data.image);
      }

      if (isEditing && defaultValues) {
        await updateMutation.mutateAsync({ id: defaultValues.id, payload: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="bg-primary/5 p-6 flex items-center gap-4 border-b">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {isEditing ? <Building className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </div>
          <DialogHeader className="gap-1.5">
            <DialogTitle className="text-xl">
              {isEditing ? 'Edit Institusi' : 'Tambah Institusi'}
            </DialogTitle>
            <DialogDescription className="text-sm opacity-90">
              {isEditing
                ? 'Perbarui data institusi pendidikan. Gambar saat ini akan dipertahankan jika tidak ada gambar baru diunggah.'
                : 'Isi data institusi pendidikan baru di bawah ini.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="institute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Nama Institusi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama institusi pendidikan"
                        {...field}
                        className="h-11 px-4 bg-background border-input focus-visible:ring-2 focus-visible:ring-ring/20"
                      />
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Alamat</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan alamat institusi"
                        {...field}
                        className="h-11 px-4 bg-background border-input focus-visible:ring-2 focus-visible:ring-ring/20"
                      />
                    </FormControl>
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Gambar {isEditing ? '(Opsional)' : ''}
                    </FormLabel>
                    {isEditing && defaultValues?.image_url && (
                      <div className="mt-2 mb-4">
                        <p className="text-sm font-medium">Gambar Saat Ini:</p>
                        <img
                          src={defaultValues.image_url}
                          alt="Current Image"
                          className="h-20 w-20 object-cover rounded-md"
                          onError={(e) => (e.currentTarget.src = '/path/to/fallback-image.png')}
                        />
                      </div>
                    )}
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                        className="h-11 px-4 bg-background border-input focus-visible:ring-2 focus-visible:ring-ring/20"
                      />
                    </FormControl>
                    {isEditing && (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Biarkan kosong untuk mempertahankan gambar saat ini.
                      </p>
                    )}
                    <FormMessage className="text-xs mt-1.5" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-row gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1 hover:text-white hover:bg-red-500 transition-all duration-300"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 gap-2"
              >
                {isSubmitting ? (
                  isEditing ? 'Menyimpan...' : 'Menambahkan...'
                ) : (
                  <>
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4" />
                        Simpan
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Tambah
                      </>
                    )}
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