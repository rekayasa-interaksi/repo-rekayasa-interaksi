import { Button } from '@/components/ui/button';
import {
  Plus as PlusIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  Clock as ClockIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useExternalOrganizations } from '../queries';
import type { ExternalOrganization } from '../types';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { ExternalOrganizationDialog } from './ExternalOrganizationDialog';
import { ExternalOrganizationsTable } from './ExternalOrganizationTable';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export function ExternalOrganizationsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    query: '',
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExternalOrganization, setSelectedExternalOrganization] = useState<ExternalOrganization | null>(null);

  const useExternalOrganizationQuery = useExternalOrganizations({
    page,
    limit,
    ...(filters.query ? { query: filters.query } : {}),
  });

  const handleApplyFilter = () => {
    setFilters({
      query: searchInput.trim(),
    });
    setPage(1);
  };

  const handleResetFilter = () => {
    setSearchInput('');
    setFilters({ query: '' });
    setPage(1);
    setLimit(5);
  };

  const handleAddExternalOrganization = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditExternalOrganization = (externalOrganization: ExternalOrganization) => {
    setSelectedExternalOrganization(externalOrganization);
    setIsEditDialogOpen(true);
  };

  const handleDeleteExternalOrganization = (externalOrganization: ExternalOrganization) => {
    setSelectedExternalOrganization(externalOrganization);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className=" py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            External Organization{' '}
            <Badge variant="outline" className="ml-2 font-mono">
              {useExternalOrganizationQuery.data?.metaData?.totalData} External Organization
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola dan pantau semua semua eksternal organisasi</p>
        </div>
        <Button
          onClick={handleAddExternalOrganization}
          size="sm"
          className="bg-primary hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah External Organization
        </Button>
      </div>

      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari eksternal organisasi..."
                className="pl-8 h-9"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div></div>

            <div className="flex items-end gap-2">
              <Button onClick={handleApplyFilter} className="w-full bg-primary hover:bg-primary/90">
                Filter
              </Button>
              <Button onClick={handleResetFilter} variant="outline" className="w-full">
                Reset
              </Button>
            </div>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-sm">
                  Semua External Organization
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-sm">
                  Baru Ditambahkan
                </TabsTrigger>
              </TabsList>
            </div>

            {(filters.query) && (
              <div className="mb-4 text-sm text-muted-foreground">
                Filter aktif:
                {filters.query && <Badge variant="outline" className="mx-1">Query: {filters.query}</Badge>}
              </div>
            )}

            <TabsContent value="all" className="mt-0 p-0">
              <div className="rounded-md border">
                <ExternalOrganizationsTable
                  data={useExternalOrganizationQuery.data?.data || []}
                  isLoading={useExternalOrganizationQuery.isLoading}
                  onEdit={handleEditExternalOrganization}
                  onDelete={handleDeleteExternalOrganization}
                />
              </div>
            </TabsContent>

            <TabsContent value="recent" className="mt-0 p-0">
              <div className="rounded-md border">
                <ExternalOrganizationsTable
                  data={useExternalOrganizationQuery.data?.data || []}
                  isLoading={useExternalOrganizationQuery.isLoading}
                  onEdit={handleEditExternalOrganization}
                  onDelete={handleDeleteExternalOrganization}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        {useExternalOrganizationQuery.data && useExternalOrganizationQuery.data.metaData.totalData > 0 && (
          <CardFooter className="bg-muted/20 border-t px-4 sm:px-6 py-2 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Menampilkan {useExternalOrganizationQuery.data.metaData.page} dari {useExternalOrganizationQuery.data.metaData.totalPage}{' '}
              halaman ({useExternalOrganizationQuery.data.metaData.totalData} total anggota)
              <br></br>
              Terakhir diperbarui:{' '}
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || useExternalOrganizationQuery.isLoading}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === useExternalOrganizationQuery.data.metaData.totalPage || useExternalOrganizationQuery.isLoading}
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

      <ExternalOrganizationDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} mode="create" />

      {selectedExternalOrganization && (
        <>
          <ExternalOrganizationDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            mode="edit"
            defaultValues={selectedExternalOrganization}
          />

          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            club={selectedExternalOrganization}
          />
        </>
      )}
    </div>
  );
}
