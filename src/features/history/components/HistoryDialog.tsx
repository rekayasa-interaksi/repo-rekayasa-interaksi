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
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStoreHistory, useUpdateHistory } from '../queries';
import { HistoryEditFormSchema, HistoryFormSchema } from '../schemas';
import type { History, HistoryFormData } from '../types';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface HistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  defaultValues?: History;
}

export function HistoryDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
}: HistoryDialogProps) {
  const createMutation = useStoreHistory();
  const updateMutation = useUpdateHistory();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isEditing = mode === 'edit';
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<HistoryFormData>({
    resolver: zodResolver(isEditing ? HistoryEditFormSchema : HistoryFormSchema),
    defaultValues: isEditing && defaultValues
      ? {
          title: defaultValues.title || '',
          description: defaultValues.description || '',
          date: defaultValues.date || '',
          image: undefined,
        }
      : {
          title: '',
          description: '',
          date: '',
          image: undefined,
        },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        isEditing && defaultValues
          ? {
              title: defaultValues.title || '',
              description: defaultValues.description || '',
              date: defaultValues.date || '',
              image: undefined,
            }
          : {
              title: '',
              description: '',
              date: '',
              image: undefined,
            },
      );
      setActiveTab('edit');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open, isEditing, defaultValues, form]);

  const onSubmit = async (data: HistoryFormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('date', data.date);
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
              {isEditing ? 'Edit History' : 'Tambah History'}
            </DialogTitle>
            <DialogDescription className="text-sm opacity-90">
              {isEditing
                ? 'Perbarui detail history di bawah ini.'
                : 'Isi detail untuk menambahkan history baru.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan judul"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Deskripsi</FormLabel>
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 h-9">
                        <TabsTrigger value="edit" className="h-full">Edit</TabsTrigger>
                        <TabsTrigger value="preview" className="h-full">Pratinjau</TabsTrigger>
                      </TabsList>
                      <TabsContent value="edit" className="mt-4">
                        <FormControl>
                          <div className="group relative">
                            <Textarea 
                              placeholder={
                                `- Contoh bullet point pertama\n` +
                                `- Contoh bullet point kedua\n` +
                                `Teks biasa dengan baris baru`
                              }
                              {...field}
                              className="min-h-[100px] bg-background border-input focus-visible:ring-2 focus-visible:ring-ring/20"
                            />
                          </div>
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
                            {field.value || 'Masukkan jawaban untuk melihat pratinjau'}
                          </ReactMarkdown>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const newDate = e.target.value || '';
                          field.onChange(newDate);
                        }}
                      />
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
                    <FormLabel>
                      Gambar {isEditing ? '(Opsional)' : ''}
                    </FormLabel>
                    {isEditing && defaultValues?.image_url && (
                      <div className="mt-2 mb-4">
                        <p className="text-sm font-medium">Gambar Saat Ini:</p>
                        <img
                          src={defaultValues.image_url}
                          alt="Current"
                          className="h-20 w-20 object-cover rounded-md"
                          onError={(e) =>
                            (e.currentTarget.src = '/fallback-image.png')
                          }
                        />
                      </div>
                    )}
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                    </FormControl>
                    {isEditing && (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Biarkan kosong untuk mempertahankan gambar saat ini.
                      </p>
                    )}
                    <FormMessage />
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
                  isEditing ? 'Menyimpan...' : 'Membuat...'
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
