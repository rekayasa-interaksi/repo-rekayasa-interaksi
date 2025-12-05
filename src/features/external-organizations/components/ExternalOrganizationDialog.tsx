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
import { BookOpen, Plus, Save } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateExternalOrganization, useUpdateExternalOrganization } from '../queries';
import { ExternalOrganizationFormSchema } from '../schemas';
import type { ExternalOrganization, ExternalOrganizationFormData } from '../types';
import { Textarea } from '@/components/ui/textarea';

interface ExternalOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  defaultValues?: ExternalOrganization;
}

export function ExternalOrganizationDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
}: ExternalOrganizationDialogProps) {
  const createMutation = useCreateExternalOrganization();
  const updateMutation = useUpdateExternalOrganization();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isEditing = mode === 'edit';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ExternalOrganizationFormData>({
      resolver: zodResolver(ExternalOrganizationFormSchema(isEditing)),
      defaultValues: isEditing && defaultValues
        ? {
            name: defaultValues.name || '',
            image: undefined,
          }
        : {
            name: '',
            image: undefined,
          },
    });

  useEffect(() => {
    if (open) {
      form.reset(
        isEditing && defaultValues
          ? {
              name: defaultValues.name || '',
              image: undefined,
            }
          : {
              name: '',
              image: undefined,
            },
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open, isEditing, defaultValues, form]);

  const onSubmit = async (data: ExternalOrganizationFormData) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
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
            {isEditing ? <BookOpen className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </div>
          <DialogHeader className="gap-1.5">
            <DialogTitle className="text-xl">
              {isEditing ? 'Edit External Organization' : 'Tambah External Organization'}
            </DialogTitle>
            <DialogDescription className="text-sm opacity-90">
              {isEditing
                ? 'Perbarui detail eksternal organisasi di bawah ini.'
                : 'Isi detail untuk eksternal organisasi baru di bawah ini.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Nama Eksternal Organisasi</FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <Input
                          placeholder="Masukkan nama eksternal organisasi"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="h-11 px-4 bg-background border-input focus-visible:ring-2 focus-visible:ring-ring/20"
                        />
                      </div>
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

            <DialogFooter className="flex flex-row gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1 hover:text-white hover:bg-red-500 transition-all duration-300"
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
                {isSubmitting ? (
                  isEditing ? (
                    'Menyimpan...'
                  ) : (
                    'Membuat...'
                  )
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
                        Buat
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
