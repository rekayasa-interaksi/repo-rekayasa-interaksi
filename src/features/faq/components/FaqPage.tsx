import { Button } from '@/components/ui/button';
import {
  Plus as PlusIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  Clock as ClockIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useFaqes } from '../queries';
import type { Faq } from '../types';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { FaqDialog } from './FaqDialog';
import { FaqTable } from './FaqTable';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function FaqPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditAnswerDialogOpen, setIsEditAnswerDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: faqs, isLoading } = useFaqes();

  const handleAdd = () => {
    console.log('Tambah FAQ button clicked'); // Debug log
    setIsAddDialogOpen(true);
  };

  const handleEdit = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsEditDialogOpen(true);
  };

  const handleEditAnswer = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsEditAnswerDialogOpen(true);
  };

  const handleDelete = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsDeleteDialogOpen(true);
  };

  const filtered = faqs?.filter((faq) => {
    const matchesStatus = statusFilter === 'all' ? true : faq.show === (statusFilter === 'true');
    const matchesQuestion = searchQuery
      ? faq.question.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesQuestion;
  }) || [];

  const totalCount = filtered.length;
  const recent = filtered
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            FAQ{' '}
            <Badge variant="outline" className="ml-2 font-mono">
              {totalCount} FAQ
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola dan pantau semua data FAQ</p>
        </div>
        <Button
          onClick={handleAdd}
          size="sm"
          className="bg-primary hover:bg-primary/90 transition-colors z-10 pointer-events-auto"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah FAQ
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium">Cari Pertanyaan:</span>
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari pertanyaan..."
              className="pl-8 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium">Filter Status:</span>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="h-9 mb-4">
              <TabsTrigger value="all" className="text-sm">
                Semua FAQ
              </TabsTrigger>
              <TabsTrigger value="recent" className="text-sm">
                Baru Ditambahkan
              </TabsTrigger>
            </TabsList>

            {searchQuery && (
              <div className="mb-4 flex items-center gap-2 bg-muted/40 p-2 rounded-md">
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Menampilkan{' '}
                  <Badge variant="outline" className="ml-1 font-mono">
                    {totalCount}
                  </Badge>{' '}
                  hasil untuk "<span className="font-medium">{searchQuery}</span>"
                </span>
              </div>
            )}

            <TabsContent value="all" className="mt-0 p-0">
              <div className="rounded-md border">
                <FaqTable
                  data={filtered}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onEditAnswer={handleEditAnswer}
                  onDelete={handleDelete}
                />
              </div>
              {!isLoading && filtered.length === 0 && searchQuery && (
                <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed rounded-md mt-4 bg-muted/20">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <SearchIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Tidak ada hasil</h3>
                  <p className="text-muted-foreground text-center mt-1 max-w-md">
                    Tidak ada FAQ yang cocok dengan pencarian "{searchQuery}". Coba kata kunci lain
                    atau tambahkan FAQ baru.
                  </p>
                  <Button onClick={handleAdd} variant="outline" className="mt-3">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Tambah FAQ Baru
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-0 p-0">
              <div className="rounded-md border">
                <FaqTable
                  data={recent}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onEditAnswer={handleEditAnswer}
                  onDelete={handleDelete}
                />
              </div>
              {!isLoading && recent.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed rounded-md mt-4 bg-muted/20">
                  <div className="bg-amber-500/10 p-3 rounded-full mb-3">
                    <ClockIcon className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-medium">Belum ada FAQ terbaru</h3>
                  <p className="text-muted-foreground text-center mt-1 max-w-md">
                    Belum ada FAQ yang ditambahkan baru-baru ini. Tambahkan FAQ baru untuk
                    melihatnya di sini.
                  </p>
                  <Button onClick={handleAdd} variant="outline" className="mt-3">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Tambah FAQ Baru
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-muted/20 border-t px-4 sm:px-6 py-2 text-xs text-muted-foreground">
          Terakhir diperbarui:{' '}
          {new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </CardFooter>
      </Card>

      <FaqDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} mode="create" />

      {selectedFaq && (
        <>
          <FaqDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            mode="edit"
            defaultValues={selectedFaq}
          />
          <FaqDialog
            open={isEditAnswerDialogOpen}
            onOpenChange={setIsEditAnswerDialogOpen}
            mode="editAnswer"
            defaultValues={selectedFaq}
          />
          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            faq={selectedFaq}
          />
        </>
      )}
    </div>
  );
}