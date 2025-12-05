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
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, HelpCircle, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateFaq, useUpdateFaq, useUpdateFaqAnswer } from '../queries';
import { FaqFormSchema, FaqAnswerFormSchema } from '../schemas';
import type { Faq, FaqFormData, FaqAnswerFormData } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FaqDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'editAnswer';
  defaultValues?: Faq;
}

export function FaqDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
}: FaqDialogProps) {
  const createMutation = useCreateFaq();
  const updateMutation = useUpdateFaq();
  const updateAnswerMutation = useUpdateFaqAnswer();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const isSubmitting = createMutation.isPending || updateMutation.isPending || updateAnswerMutation.isPending;
  const isEditing = mode === 'edit';
  const isEditingAnswer = mode === 'editAnswer';

  const form = useForm<FaqFormData | FaqAnswerFormData>({
    resolver: zodResolver(isEditingAnswer ? FaqAnswerFormSchema : FaqFormSchema),
    defaultValues: isEditing && defaultValues
      ? {
          question: defaultValues.question || '',
          answer: defaultValues.answer || '',
          show: defaultValues.show || false,
        }
      : isEditingAnswer && defaultValues
      ? {
          answer: defaultValues.answer || '',
        }
      : {
          question: '',
          answer: '',
          show: false,
        },
  });

  useEffect(() => {
    if (open) {
      console.log('FaqDialog rendered, open:', open, 'mode:', mode); // Debug log
      form.reset(
        isEditing && defaultValues
          ? {
              question: defaultValues.question || '',
              answer: defaultValues.answer || '',
              show: defaultValues.show || false,
            }
          : isEditingAnswer && defaultValues
          ? {
              answer: defaultValues.answer || '',
            }
          : {
              question: '',
              answer: '',
              show: false,
            },
      );
      setActiveTab('edit');
    }
  }, [open, isEditing, isEditingAnswer, defaultValues, form]);

  const onSubmit = async (data: FaqFormData | FaqAnswerFormData) => {
    try {
      if (isEditing && defaultValues) {
        console.log('Updating FAQ:', defaultValues.id, data); // Debug log
        await updateMutation.mutateAsync({ id: defaultValues.id, payload: data as FaqFormData });
      } else if (isEditingAnswer && defaultValues) {
        console.log('Updating FAQ answer:', defaultValues.id, data); // Debug log
        await updateAnswerMutation.mutateAsync({ id: defaultValues.id, payload: data as FaqAnswerFormData });
      } else {
        console.log('Creating FAQ:', data); // Debug log
        await createMutation.mutateAsync(data as FaqFormData);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Submit error:', error); // Debug log
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="bg-primary/5 p-6 flex items-center gap-4 border-b">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {isEditing ? <HelpCircle className="h-6 w-6" /> : isEditingAnswer ? <FileText className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </div>
          <DialogHeader className="gap-1.5">
            <DialogTitle className="text-xl">
              {isEditing ? 'Edit FAQ' : isEditingAnswer ? 'Edit Jawaban FAQ' : 'Tambah FAQ'}
            </DialogTitle>
            <DialogDescription className="text-sm opacity-90">
              {isEditing
                ? 'Perbarui data FAQ.'
                : isEditingAnswer
                ? 'Perbarui jawaban FAQ. Gunakan - untuk bullet points dan Enter untuk baris baru.'
                : 'Isi data FAQ baru di bawah ini. Gunakan - untuk bullet points dan Enter untuk baris baru.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div className="space-y-4">
              {!isEditingAnswer && (
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Pertanyaan</FormLabel>
                      <FormControl>
                        <div className="group relative">
                          <Input 
                            placeholder="Masukkan pertanyaan" 
                            {...field} 
                            className="h-11 px-4 bg-background border-input focus-visible:ring-2 focus-visible:ring-ring/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs mt-1.5" />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Jawaban</FormLabel>
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
              {!isEditingAnswer && (
                <FormField
                  control={form.control}
                  name="show"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Show</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(value === 'true')}
                        >
                          <SelectTrigger className="h-11 bg-background border-input">
                            <SelectValue placeholder="Pilih show" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs mt-1.5" />
                    </FormItem>
                  )}
                />
              )}
              {!isEditingAnswer && (
                <FormField
                  control={form.control}
                  name="menu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Menu</FormLabel>
                      <FormControl>
                        <div className="group relative">
                          <Input 
                            placeholder="Masukkan menu" 
                            {...field} 
                            className="h-11 px-4 bg-background border-input focus-visible:ring-2 focus-visible:ring-ring/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs mt-1.5" />
                    </FormItem>
                  )}
                />
              )}
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
                  isEditing ? 'Menyimpan...' : isEditingAnswer ? 'Menyimpan...' : 'Menambahkan...'
                ) : (
                  <>
                    {isEditing || isEditingAnswer ? (
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