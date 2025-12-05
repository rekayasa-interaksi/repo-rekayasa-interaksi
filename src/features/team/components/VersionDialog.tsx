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
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useCreateVersion, useUpdateVersion } from '../queries';
import { VersionFormSchema } from '../schemas';
import type { VersionFormData, Version } from '../types';
import { toast } from 'sonner';

interface VersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  version?: Version;
}

export function VersionDialog({ open, onOpenChange, mode, version }: VersionDialogProps) {
  const createMutation = useCreateVersion();
  const updateMutation = useUpdateVersion();

  const form = useForm<VersionFormData>({
    resolver: zodResolver(VersionFormSchema),
    defaultValues: {
      version: '',
      generation: '',
    },
  });

  useEffect(() => {
    if (open && mode === 'edit' && version) {
      form.reset({
        version: version.version,
        generation: version.generation ?? '',
      });
    } else if (open) {
      form.reset({
        version: '',
        generation: '',
      });
    }
  }, [open, mode, version, form]);

  const onSubmit = async (data: VersionFormData) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data);
      } else {
        await updateMutation.mutateAsync({ id: version!.id, payload: data });
      }

      onOpenChange(false);
      form.reset();
      toast.success(mode === 'create' ? 'Versi sistem berhasil dibuat' : 'Versi sistem berhasil diubah');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(mode === 'create' ? 'Gagal membuat versi sistem' : 'Gagal mengubah versi sistem');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Tambah Versi Sistem' : 'Edit Versi Sistem'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Isi data versi sistem baru di bawah ini.'
              : 'Edit data versi sistem di bawah ini.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* VERSION */}
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan versi (contoh: v1.0.0)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* GENERATION */}
            <FormField
              control={form.control}
              name="generation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Generation <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan angkatan" {...field} />
                  </FormControl>
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