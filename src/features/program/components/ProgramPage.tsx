import { Button } from '@/components/ui/button';
import {
  Plus as PlusIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  BarChart as BarChartIcon,
  BookOpen as BookOpenIcon,
} from 'lucide-react';
import { useState } from 'react';
import { usePrograms } from '../queries';
import type { Program } from '../types';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { ProgramDialog } from './ProgramDialog';
import { ProgramTable } from './ProgramTable';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function ProgramPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: Programes, isLoading } = usePrograms();

  const handleAdd = () => setIsAddDialogOpen(true);

  const handleEdit = (Program: Program) => {
    setSelectedProgram(Program);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (Program: Program) => {
    setSelectedProgram(Program);
    setIsDeleteDialogOpen(true);
  };

  const filtered =
    Programes?.filter((item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const totalCount = filtered.length;
  const recent = filtered
    .sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const lastUpdated =
    filtered.length > 0
      ? new Date(
          Math.max(
            ...filtered
              .filter((item) => item.updated_at)
              .map((item) => new Date(item.updated_at as string).getTime()),
          ),
        )
      : new Date();

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Program{' '}
            <Badge variant="outline" className="ml-2 font-mono">
              {totalCount} Program
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola dan pantau semua program</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleAdd}
                size="sm"
                className="bg-primary hover:bg-primary/90 transition-colors"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Tambah Program
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tambahkan data Program baru</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <Card className="shadow-sm w-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Program</p>
                <h3 className="text-2xl font-bold mt-1">{totalCount}</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <BookOpenIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm w-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Program Terbaru</p>
                <h3 className="text-2xl font-bold mt-1">{recent.length}</h3>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-full">
                <ClockIcon className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="shadow-sm w-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Terakhir Diperbarui</p>
                <h3 className="text-base font-bold mt-1">
                  {lastUpdated.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </h3>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-full">
                <UsersIcon className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-sm">
                  Semua Program
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-sm">
                  Baru Ditambahkan
                </TabsTrigger>
              </TabsList>
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Program..."
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
                <ProgramTable
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
                    Tidak ada Program yang cocok dengan pencarian "{searchQuery}". Coba kata kunci
                    lain atau tambahkan data baru.
                  </p>
                  <Button onClick={handleAdd} variant="outline" className="mt-3">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Tambah Program Baru
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-0 p-0">
              <div className="rounded-md border">
                <ProgramTable
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
                    Belum ada Program yang ditambahkan baru-baru ini. Tambahkan data baru untuk
                    melihatnya di sini.
                  </p>
                  <Button onClick={handleAdd} variant="outline" className="mt-3">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Tambah Program Baru
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

      <ProgramDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} mode="create" />

      {selectedProgram && (
        <>
          <ProgramDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            mode="edit"
            defaultValues={selectedProgram}
          />

          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            Program={selectedProgram}
          />
        </>
      )}
    </div>
  );
}
