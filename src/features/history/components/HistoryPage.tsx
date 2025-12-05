import { useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Info, PlusIcon, Search as SearchIcon } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { HistoryTable } from './HistoryTable';
import { useHistories, useStoreHistory, useUpdateHistory, useDeleteHistory } from '../queries';
import type { HistoriesListResponse, History, HistoryMutationResponse } from '../types';
import { Badge } from '@/components/ui/badge';
import { HistoryDialog } from './HistoryDialog';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

export function HistoryPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [yearInput, setYearInput] = useState<string | undefined>();
  const [filters, setFilters] = useState({
    query: '',
    year: undefined as string | undefined,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [year, setYear] = useState<string | undefined>();
  const [selectedHistory, setSelectedHistory] = useState<History | null>(null);

  const useHistoryQuery = useHistories({
    page,
    limit,
    ...(filters.query ? { query: filters.query } : {}),
    ...(filters.year ? { year: filters.year } : {}),
  });

  const handleApplyFilter = () => {
    setFilters({
      query: searchInput.trim(),
      year: yearInput?.trim() || undefined,
    });
    setPage(1); // reset ke halaman pertama tiap kali filter
  };

  const handleResetFilter = () => {
    setSearchInput('');
    setYearInput(undefined);
    setFilters({ query: '', year: undefined });
    setPage(1);
    setLimit(5);
  };


  const handleAddHistory = () => {
      setIsAddDialogOpen(true);
    };

  const handleEditHistory = (history: History) => {
    setSelectedHistory(history);
    setIsEditDialogOpen(true);
  };

  const handleDeleteHistory = (history: History) => {
    setSelectedHistory(history);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            History{' '}
            <Badge variant="outline" className="ml-2 font-mono">
              {useHistoryQuery.data?.metaData?.totalData || 0} Entries
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola dan pantau semua sejarah Digistar Club</p>
        </div>
        <Button
          onClick={handleAddHistory}
          size="sm"
          className="bg-primary hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah Sejarah Kegiatan
        </Button>
      </div>

      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan nama"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-8 h-9 mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Year</label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan tahun (contoh: 2023)"
                  value={yearInput || ''}
                  onChange={(e) => setYearInput(e.target.value)}
                  className="pl-8 h-9 mt-1"
                />
              </div>
            </div>

            <div>
              
            </div>


            <div className="flex items-end gap-2">
              <Button onClick={handleApplyFilter} className="w-full bg-primary hover:bg-primary/90">
                Filter
              </Button>
              <Button onClick={handleResetFilter} variant="outline" className="w-full">
                Reset
              </Button>
            </div>
          </div>

          {(filters.query || filters.year) && (
            <div className="mb-4 text-sm text-muted-foreground">
              Filter aktif:
              {filters.query && <Badge variant="outline" className="mx-1">Query: {filters.query}</Badge>}
              {filters.year && <Badge variant="outline" className="mx-1">Year: {filters.year}</Badge>}
            </div>
          )}


          {searchQuery && (
            <div className="mb-4 flex items-center gap-2 bg-muted/40 p-2 rounded-md">
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Menampilkan{' '}
                <Badge variant="outline" className="ml-1 font-mono">
                  {useHistoryQuery.data?.metaData?.totalData || 0}
                </Badge>{' '}
                hasil untuk "<span className="font-medium">{searchQuery}</span>"
              </span>
            </div>
          )}

          <HistoryTable
            data={useHistoryQuery.data?.data || []}
            isLoading={useHistoryQuery.isLoading}
            onEdit={handleEditHistory}
            onDelete={handleDeleteHistory}
          />

          {useHistoryQuery.error && (
            <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed rounded-md mt-4 bg-muted/20">
              <div className="bg-red-500/10 p-3 rounded-full mb-3">
                <Info className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-lg font-medium">Error</h3>
              <p className="text-muted-foreground text-center mt-1 max-w-md">
                {useHistoryQuery.error.message}
              </p>
            </div>
          )}
        </CardContent>
        {useHistoryQuery.data && useHistoryQuery.data.metaData.totalData > 0 && (
          <CardFooter className="bg-muted/20 border-t px-4 sm:px-6 py-2 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Menampilkan {useHistoryQuery.data.metaData.page} dari {useHistoryQuery.data.metaData.totalPage}{' '}
              halaman ({useHistoryQuery.data.metaData.totalData} total anggota)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || useHistoryQuery.isLoading}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === useHistoryQuery.data.metaData.totalPage || useHistoryQuery.isLoading}
              >
                Selanjutnya
              </Button>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  setLimit(parseInt(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-24 h-9">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardFooter>
        )}
      </Card>

      <HistoryDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} mode="create" />

      {selectedHistory && (
        <>
          <HistoryDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            mode="edit"
            defaultValues={selectedHistory}
          />

          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            history={selectedHistory}
          />
        </>
      )}
    </div>
  );
}