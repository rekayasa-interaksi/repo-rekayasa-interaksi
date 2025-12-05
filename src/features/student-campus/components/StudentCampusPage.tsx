import { Button } from '@/components/ui/button';
import {
  Plus as PlusIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  BarChart as BarChartIcon,
  Building as BuildingIcon
} from 'lucide-react';
import { useState } from 'react';
import { useStudentCampuses } from '../queries';
import type { StudentCampus } from '../types';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { StudentCampusDialog } from './StudentCampusDialog';
import { StudentCampusTable } from './StudentCampusTable';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function StudentCampusPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<StudentCampus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: studentCampuses, isLoading } = useStudentCampuses();

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  const handleEdit = (campus: StudentCampus) => {
    setSelectedCampus(campus);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (campus: StudentCampus) => {
    setSelectedCampus(campus);
    setIsDeleteDialogOpen(true);
  };

  const filtered = studentCampuses?.filter((campus) =>
    campus.institute?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalCount = filtered.length;
  const recent = filtered
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className=" py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Student Campus{' '}
            <Badge variant="outline" className="ml-2 font-mono">
              {totalCount} Kampus
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola dan pantau semua data kampus mahasiswa</p>
        </div>
        <Button
          onClick={handleAdd}
          size="sm"
          className="bg-primary hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah Data Kampus
        </Button>
      </div>

      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-sm">
                  Semua Kampus
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-sm">
                  Baru Ditambahkan
                </TabsTrigger>
              </TabsList>
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari institusi..."
                  className="pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

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
                <StudentCampusTable
                  data={filtered}
                  isLoading={isLoading}
                  onEdit={handleEdit}
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
                    Tidak ada kampus yang cocok dengan pencarian "{searchQuery}". Coba kata kunci lain
                    atau tambahkan data baru.
                  </p>
                  <Button onClick={handleAdd} variant="outline" className="mt-3">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Tambah Data Baru
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-0 p-0">
              <div className="rounded-md border">
                <StudentCampusTable
                  data={recent}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
              {!isLoading && recent.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed rounded-md mt-4 bg-muted/20">
                  <div className="bg-amber-500/10 p-3 rounded-full mb-3">
                    <ClockIcon className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-medium">Belum ada data terbaru</h3>
                  <p className="text-muted-foreground text-center mt-1 max-w-md">
                    Belum ada kampus yang ditambahkan baru-baru ini. Tambahkan data baru untuk
                    melihatnya di sini.
                  </p>
                  <Button onClick={handleAdd} variant="outline" className="mt-3">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Tambah Data Baru
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

      <StudentCampusDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} mode="create" />

      {selectedCampus && (
        <>
          <StudentCampusDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            mode="edit"
            defaultValues={selectedCampus}
          />

          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            campus={selectedCampus}
          />
        </>
      )}
    </div>
  );
}
