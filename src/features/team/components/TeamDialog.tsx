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
import { useEffect, useState } from 'react';
import { useCreateTeam, useUpdateTeam, useMembers } from '../queries';
import { TeamFormSchema } from '../schemas';
import type { Team, TeamFormData } from '../types';
import { Combobox } from '@/components/ui/combobox';
import { useDebounce } from 'use-debounce';
import { toast } from 'sonner';

interface TeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  team?: Team;
}

export function TeamDialog({ open, onOpenChange, mode, team }: TeamDialogProps) {
  const createMutation = useCreateTeam();
  const updateMutation = useUpdateTeam();

  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMemberName, setSelectedMemberName] = useState<string | undefined>(undefined);

  const users = useMembers(memberSearch);

  const form = useForm<TeamFormData>({
    resolver: zodResolver(TeamFormSchema),
    defaultValues: {
      role: '',
      image: undefined,
      user_id: '',
      generation: '',
    },
  });

  useEffect(() => {
    if (open && mode === 'edit' && team) {
      form.reset({
        role: team.role,
        image: undefined,
        user_id: team.user_id ?? '',
        generation: team.generation ?? '',
      });
    } else if (open) {
      form.reset({
        role: '',
        image: undefined,
        user_id: '',
        generation: '',
      });
    }
  }, [open, mode, team, form]);

  const onSubmit = async (data: TeamFormData) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data);
      } else {
        await updateMutation.mutateAsync({ id: team!.id, payload: data });
      }

      onOpenChange(false);
      form.reset();
      toast.success(mode === 'create' ? 'Tim berhasil dibuat' : 'Tim berhasil diubah');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(mode === 'create' ? 'Gagal membuat tim' : 'Gagal mengubah tim');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Tambah Tim' : 'Edit Tim'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Isi data tim baru di bawah ini.'
              : 'Edit data tim di bawah ini.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* USER */}
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Member <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={
                        users.data?.map((user) => ({
                          value: user.id,
                          label: user.name,
                        })) ||
                        (selectedMemberName && field.value
                          ? [{ value: field.value, label: selectedMemberName }]
                          : [])
                      }
                      placeholder={users.isLoading ? 'Memuat member...' : 'Cari member...'}
                      onSearch={(value) => {
                        setMemberSearch(value);
                        setSelectedMemberName(undefined);
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
                    <p className="text-xs text-red-500 mt-1.5">
                      Gagal memuat member: {users.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan role" {...field} />
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
                  <FormLabel>Foto</FormLabel>
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