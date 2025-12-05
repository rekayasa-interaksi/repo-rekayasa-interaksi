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
import { Plus, Save, BookOpen } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateMajorCampus, useUpdateMajorCampus } from '../queries';
import { MajorCampusFormSchema } from '../schemas';
import type { MajorCampus, MajorCampusFormData } from '../types';

interface MajorCampusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  defaultValues?: MajorCampus;
}

export function MajorCampusDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
}: MajorCampusDialogProps) {
  const createMutation = useCreateMajorCampus();
  const updateMutation = useUpdateMajorCampus();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isEditing = mode === 'edit';

  const form = useForm<MajorCampusFormData>({
    resolver: zodResolver(MajorCampusFormSchema),
    defaultValues: isEditing && defaultValues
      ? {
          major: defaultValues.major || '',
        }
      : {
          major: '',
        },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        isEditing && defaultValues
          ? {
              major: defaultValues.major || '',
            }
          : {
              major: '',
            },
      );
    }
  }, [open, isEditing, defaultValues, form]);

  const onSubmit = async (data: MajorCampusFormData) => {
    try {
      if (isEditing && defaultValues) {
        await updateMutation.mutateAsync({ id: defaultValues.id, payload: data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {}
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
              {isEditing ? 'Edit Jurusan' : 'Tambah Jurusan'}
            </DialogTitle>
            <DialogDescription className="text-sm opacity-90">
              {isEditing
                ? 'Perbarui data jurusan di bawah ini.'
                : 'Isi data jurusan baru di bawah ini.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Nama Jurusan</FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <Input 
                          placeholder="Masukkan nama jurusan" 
                          {...field} 
                          className="h-11 px-4 bg-background border-input focus-visible:ring-2 focus-visible:ring-ring/20"
                        />
                      </div>
                    </FormControl>
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