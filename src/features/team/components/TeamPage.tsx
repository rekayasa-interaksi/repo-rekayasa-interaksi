import { Button } from '@/components/ui/button';
import {
  Plus as PlusIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  BookOpen as BookOpenIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGenerations, useTeams } from '../queries';
import type { Feature, Team, Version } from '../types';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { TeamDialog } from './TeamDialog';
import { TeamTable } from './TeamTable';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getGenerations } from '../services';
import { VersionDialog } from './VersionDialog';
import { VersionSection } from './VersionSection';
import { DeleteVersionConfirmationDialog } from './DeleteVersionConfirmationDialog';
import { FeatureDialog } from './FeatureDialog';
import { DeleteFeatureConfirmationDialog } from './DeleteFeatureConfirmationDialog';

export function TeamPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddDialogVersionOpen, setIsAddDialogVersionOpen] = useState(false);
  const [isAddDialogFeatureOpen, setIsAddDialogFeatureOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState<string>();
  const [generations, setGenerations] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [isEditVersionOpen, setIsEditVersionOpen] = useState(false);
  const [isDeleteVersionOpen, setIsDeleteVersionOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isEditFeatureOpen, setIsEditFeatureOpen] = useState(false);
  const [isDeleteFeatureOpen, setIsDeleteFeatureOpen] = useState(false);

  function handleVersionEdit(version: Version) {
    setSelectedVersion(version);
    setIsEditVersionOpen(true);
  }

  function handleVersionDelete(version: Version) {
    setSelectedVersion(version);
    setIsDeleteVersionOpen(true);
  }

  function handleFeatureEdit(feature: Feature) {
    setSelectedFeature(feature);
    setIsEditFeatureOpen(true);
  }

  function handleFeatureDelete(feature: Feature) {
    setSelectedFeature(feature);
    setIsDeleteFeatureOpen(true);
  }

  useEffect(() => {
    getGenerations()
      .then((gens) => {
        setGenerations(gens);
        setSelectedGeneration(gens[0] || new Date().getFullYear().toString());
      })
      .catch((err) => console.error(err));
  }, []);


  const { data: teams, isLoading } = useTeams(selectedGeneration);

  const handleAdd = () => setIsAddDialogOpen(true);

  const handleAddVersion = () => setIsAddDialogVersionOpen(true);

  const handleAddFeature = () => setIsAddDialogFeatureOpen(true);

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteDialogOpen(true);
  };

  const filtered =
    teams?.filter((item) =>
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

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tim{' '}
            <Badge variant="outline" className="ml-2 font-mono">
              {totalCount} Tim
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola dan pantau semua data tim
          </p>
        </div>
        <TooltipProvider>
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAdd}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 transition-colors"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Tambah Tim
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tambahkan data tim baru</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAddVersion}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 transition-colors"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Tambah Versi Sistem
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tambahkan data versi sistem baru</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAddFeature}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 transition-colors"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Tambah Fitur Sistem
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tambahkan data fitur sistem baru</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <Card className="shadow-sm w-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tim</p>
                <h3 className="text-2xl font-bold mt-1">{totalCount}</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <BookOpenIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-wrap">
              <TabsList className="h-10 sm:h-9 flex-none">
                <TabsTrigger value="all" className="text-sm px-4">
                  Semua Tim
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-sm px-4">
                  Tim Terbaru
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 flex-none">
                <span className="text-sm font-medium">Generasi:</span>
                <Select value={selectedGeneration} onValueChange={setSelectedGeneration}>
                  <SelectTrigger className="w-36 h-9 rounded-md border border-muted-foreground/30 shadow-sm">
                    <SelectValue placeholder="Pilih generasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {generations?.map((gen) => (
                      <SelectItem key={gen} value={gen}>
                        {gen}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative w-full sm:w-64 flex-1">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama..."
                  className="pl-10 h-9 rounded-md border border-muted-foreground/30 shadow-sm w-full"
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
                <TeamTable
                  data={filtered}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

                <VersionSection
                  generationFilter={selectedGeneration ?? null}
                  onEdit={(v) => handleVersionEdit(v)}
                  onDelete={(v) => handleVersionDelete(v)}
                  onEditFeature={handleFeatureEdit}
                  onDeleteFeature={handleFeatureDelete}
                />
              </div>
              {!isLoading && filtered.length === 0 && searchQuery && (
                <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed rounded-md mt-4 bg-muted/20">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <SearchIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Tidak ada hasil</h3>
                  <p className="text-muted-foreground text-center mt-1 max-w-md">
                    Tidak ada tim yang cocok dengan pencarian "{searchQuery}". Coba kata kunci
                    lain atau tambahkan data baru.
                  </p>
                  <Button onClick={handleAdd} variant="outline" className="mt-3">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Tambah Tim Baru
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-0 p-0">
              <div className="rounded-md border">
                <TeamTable
                  data={recent}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

                <VersionSection
                  generationFilter={selectedGeneration ?? null}
                  onEdit={(v) => handleVersionEdit(v)}
                  onDelete={(v) => handleVersionDelete(v)}
                  onEditFeature={handleFeatureEdit}
                  onDeleteFeature={handleFeatureDelete}
                />
              </div>
              {!isLoading && recent.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed rounded-md mt-4 bg-muted/20">
                  <div className="bg-amber-500/10 p-3 rounded-full mb-3">
                    <ClockIcon className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-medium">Belum ada data terbaru</h3>
                  <p className="text-muted-foreground text-center mt-1 max-w-md">
                    Belum ada tim yang ditambahkan baru-baru ini. Tambahkan data baru untuk
                    melihatnya di sini.
                  </p>
                  <Button onClick={handleAdd} variant="outline" className="mt-3">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Tambah Tim Baru
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

      <TeamDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="create"
      />

      {selectedTeam && (
        <>
          <TeamDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            mode="edit"
            team={selectedTeam}
          />

          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            team={selectedTeam}
          />
        </>
      )}
      <VersionDialog
        open={isAddDialogVersionOpen}
        onOpenChange={setIsAddDialogVersionOpen}
        mode="create"
      />

      {selectedVersion && (
        <>
          <VersionDialog
            open={isEditVersionOpen}
            onOpenChange={setIsEditVersionOpen}
            mode="edit"
            version={selectedVersion}
          />

          <DeleteVersionConfirmationDialog
            open={isDeleteVersionOpen}
            onOpenChange={setIsDeleteVersionOpen}
            version={selectedVersion}
          />
        </>
      )}

      <FeatureDialog
        open={isAddDialogFeatureOpen}
        onOpenChange={setIsAddDialogFeatureOpen}
        mode="create"
      />

      {selectedFeature && (
        <>
          <FeatureDialog
            open={isEditFeatureOpen}
            onOpenChange={setIsEditFeatureOpen}
            mode="edit"
            feature={selectedFeature}
          />

          <DeleteFeatureConfirmationDialog
            open={isDeleteFeatureOpen}
            onOpenChange={setIsDeleteFeatureOpen}
            feature={selectedFeature}
          />
        </>
      )}
    </div>
  );
}