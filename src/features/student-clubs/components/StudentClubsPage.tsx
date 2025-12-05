import { Button } from '@/components/ui/button';
import {
  Plus as PlusIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  Clock as ClockIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useStudentClubs } from '../queries';
import type { StudentClub } from '../types';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { StudentClubDialog } from './StudentClubDialog';
import { StudentClubsTable } from './StudentClubsTable';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export function StudentClubsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<StudentClub | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: studentClubs, isLoading } = useStudentClubs();

  const handleAddClub = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClub = (club: StudentClub) => {
    setSelectedClub(club);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClub = (club: StudentClub) => {
    setSelectedClub(club);
    setIsDeleteDialogOpen(true);
  };

  const filteredClubs =
    studentClubs?.filter((club) => club.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    [];

  const clubCount = filteredClubs.length;
  const recentClubs = filteredClubs
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className=" py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Student Club{' '}
            <Badge variant="outline" className="ml-2 font-mono">
              {clubCount} Club
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola dan pantau semua student club</p>
        </div>
        <Button
          onClick={handleAddClub}
          size="sm"
          className="bg-primary hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah Student Club
        </Button>
      </div>

      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-sm">
                  Semua Klub
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-sm">
                  Baru Ditambahkan
                </TabsTrigger>
              </TabsList>
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari klub..."
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
                    {clubCount}
                  </Badge>{' '}
                  hasil untuk "<span className="font-medium">{searchQuery}</span>"
                </span>
              </div>
            )}

            <TabsContent value="all" className="mt-0 p-0">
              <div className="rounded-md border">
                <StudentClubsTable
                  data={filteredClubs}
                  isLoading={isLoading}
                  onEdit={handleEditClub}
                  onDelete={handleDeleteClub}
                />
              </div>
              {!isLoading && filteredClubs.length === 0 && searchQuery && (
                <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed rounded-md mt-4 bg-muted/20">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <SearchIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Tidak ada hasil</h3>
                  <p className="text-muted-foreground text-center mt-1 max-w-md">
                    Tidak ada klub yang cocok dengan pencarian "{searchQuery}". Coba kata kunci lain
                    atau tambahkan klub baru.
                  </p>
                  <Button onClick={handleAddClub} variant="outline" className="mt-3">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Tambah Klub Baru
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-0 p-0">
              <div className="rounded-md border">
                <StudentClubsTable
                  data={recentClubs}
                  isLoading={isLoading}
                  onEdit={handleEditClub}
                  onDelete={handleDeleteClub}
                />
              </div>
              {!isLoading && recentClubs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed rounded-md mt-4 bg-muted/20">
                  <div className="bg-amber-500/10 p-3 rounded-full mb-3">
                    <ClockIcon className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-medium">Belum ada klub terbaru</h3>
                  <p className="text-muted-foreground text-center mt-1 max-w-md">
                    Belum ada klub yang ditambahkan baru-baru ini. Tambahkan klub baru untuk
                    melihatnya di sini.
                  </p>
                  <Button onClick={handleAddClub} variant="outline" className="mt-3">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Tambah Klub Baru
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

      <StudentClubDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} mode="create" />

      {selectedClub && (
        <>
          <StudentClubDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            mode="edit"
            defaultValues={selectedClub}
          />

          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            club={selectedClub}
          />
        </>
      )}
    </div>
  );
}
