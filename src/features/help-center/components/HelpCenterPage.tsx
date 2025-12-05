import { Button } from '@/components/ui/button';
import {
  Search as SearchIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useHelpCenters } from '../queries';
import { HelpCenterTable } from './HelpCenterTable';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function HelpCenterPage() {
  const [filters, setFilters] = useState({
    query: '',
    status: undefined as boolean | undefined,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const useHelpCenterQuery = useHelpCenters({
    page,
    limit,
    ...(filters.query ? { query: filters.query } : {}),
    ...(filters.status !== undefined ? { status: filters.status } : {}),
  });

  const handleApplyFilter = () => {
    setFilters({
      query: searchQuery,
      status:
        statusFilter === 'true' ? true :
        statusFilter === 'false' ? false :
        undefined,
    });
    setPage(1);
  };

  const handleResetFilter = () => {
    setSearchQuery('');
    setStatusFilter('all');

    setFilters({
      query: '',
      status: undefined,
    });

    setPage(1);
    setLimit(5);
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Help Center{' '}
            <Badge variant="outline" className="ml-2 font-mono">
              {useHelpCenterQuery.data?.metaData?.totalData} Help Center
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola dan pantau semua data Help Center</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Cari Pertanyaan:</label>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari pertanyaan..."
              className="pl-8 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Filter Status:</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden md:block"></div>

        <div className="flex gap-2 justify-start md:justify-end">
          <Button onClick={handleApplyFilter} className="h-9">
            Terapkan Filter
          </Button>

          <Button onClick={handleResetFilter} variant="outline" className="h-9">
            Reset
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="h-9 mb-4">
              <TabsTrigger value="all" className="text-sm">
                Semua Help Center
              </TabsTrigger>
              <TabsTrigger value="recent" className="text-sm">
                Baru Ditambahkan
              </TabsTrigger>
            </TabsList>

            {(filters.query) && (
              <div className="mb-4 text-sm text-muted-foreground">
                Filter aktif:
                {filters.query && <Badge variant="outline" className="mx-1">Query: {filters.query}</Badge>}
              </div>
            )}

            <TabsContent value="all" className="mt-0 p-0">
              <div className="rounded-md border">
                <HelpCenterTable
                  data={useHelpCenterQuery.data?.data || []}
                  isLoading={useHelpCenterQuery.isLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="recent" className="mt-0 p-0">
              <div className="rounded-md border">
                <HelpCenterTable
                  data={useHelpCenterQuery.data?.data || []}
                  isLoading={useHelpCenterQuery.isLoading}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        {useHelpCenterQuery.data && useHelpCenterQuery.data.metaData.totalData > 0 && (
          <CardFooter className="bg-muted/20 border-t px-4 sm:px-6 py-2 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Menampilkan {useHelpCenterQuery.data.metaData.page} dari {useHelpCenterQuery.data.metaData.totalPage}{' '}
              halaman ({useHelpCenterQuery.data.metaData.totalData} total anggota)
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
                disabled={page === 1 || useHelpCenterQuery.isLoading}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === useHelpCenterQuery.data.metaData.totalPage || useHelpCenterQuery.isLoading}
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
    </div>
  );
}