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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { useCreateFeature, useUpdateFeature, useVersions } from '../queries';
import { FeatureFormSchema } from '../schemas';
import type { Feature, FeatureFormData } from '../types';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  feature?: Feature;
}

export function FeatureDialog({ open, onOpenChange, mode, feature }: FeatureDialogProps) {
  const createMutation = useCreateFeature();
  const updateMutation = useUpdateFeature();

  const { data: versions } = useVersions({ generation: null });

  const form = useForm<FeatureFormData>({
    resolver: zodResolver(FeatureFormSchema),
    defaultValues: {
      name: '',
      content: '',
      version_system_id: '',
    },
  });

  useEffect(() => {
    if (open && mode === 'edit' && feature) {
      form.reset({
        name: feature.name,
        content: feature.content ?? '',
        version_system_id: feature.version_system_id ?? '',
      });
    } else if (open) {
      form.reset({
        name: '',
        content: '',
        version_system_id: '',
      });
    }
  }, [open, mode, feature, form]);

  const onSubmit = async (data: FeatureFormData) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data);
      } else {
        await updateMutation.mutateAsync({ id: feature!.id, payload: data });
      }

      onOpenChange(false);
      form.reset();
      toast.success(mode === 'create' ? 'Fitur berhasil dibuat' : 'Fitur berhasil diperbarui');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(mode === 'create' ? 'Gagal membuat fitur' : 'Gagal mengubah fitur');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Tambah Fitur' : 'Edit Fitur'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Isi data fitur baru di bawah ini.'
              : 'Edit data fitur di bawah ini.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Fitur <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama fitur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan penjelasan fitur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version_system_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Versi Sistem <span className="text-red-500">*</span>
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih versi sistem" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {versions?.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.version} — {v.generation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {mode === 'create' ? 'Tambah' : 'Simpan'}
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}