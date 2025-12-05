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
import { useCreateProgram, useUpdateProgram } from '../queries';
import { ProgramFormSchema } from '../schemas';
import type { Program, ProgramFormData } from '../types';

interface ProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  defaultValues?: Program;
}

export function ProgramDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
}: ProgramDialogProps) {
  const createMutation = useCreateProgram();
  const updateMutation = useUpdateProgram();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isEditing = mode === 'edit';

  const form = useForm<ProgramFormData>({
    resolver: zodResolver(ProgramFormSchema),
    defaultValues: isEditing && defaultValues
      ? {
          name: defaultValues.name || '',
        }
      : {
          name: '',
        },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        isEditing && defaultValues
          ? {
              name: defaultValues.name || '',
            }
          : {
              name: '',
            },
      );
    }
  }, [open, isEditing, defaultValues, form]);

  const onSubmit = async (data: ProgramFormData) => {
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Nama Program</FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <Input 
                          placeholder="Masukkan nama program" 
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