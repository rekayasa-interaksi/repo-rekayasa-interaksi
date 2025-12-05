import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Info, Search as SearchIcon, RotateCcw, Filter } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { MembersTable } from "./MembersTable";
import {
  useUsers,
  useDomisili,
  useStudentCampuses,
  useStudentChapters,
  useStudentClubs,
  useValidateMember,
  useSendDefaultPassword,
  useRoles,
} from "../queries";
import type {
  Domisili,
  StudentCampus,
  StudentChapter,
  StudentClub,
  Role,
} from "../types";
import { Badge } from "@/components/ui/badge";

interface FilterState {
  query: string;
  domisiliId: string | undefined;
  campusId: string | undefined;
  studentChapterId: string | undefined;
  studentClubId: string | undefined;
  roleId: string | undefined;
  sort: { created_at: number };
}

const initialFilterState: FilterState = {
  query: "",
  domisiliId: undefined,
  campusId: undefined,
  studentChapterId: undefined,
  studentClubId: undefined,
  roleId: undefined,
  sort: { created_at: 0 },
};

export function MembersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const [activeFilters, setActiveFilters] =
    useState<FilterState>(initialFilterState);

  const [domisiliSearch, setDomisiliSearch] = useState("");
  const [campusSearch, setCampusSearch] = useState("");
  const [chapterSearch, setChapterSearch] = useState("");
  const [clubSearch, setClubSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");

  const [debouncedDomisiliSearch] = useDebounce(domisiliSearch, 300);
  const [debouncedCampusSearch] = useDebounce(campusSearch, 300);
  const [debouncedChapterSearch] = useDebounce(chapterSearch, 300);
  const [debouncedClubSearch] = useDebounce(clubSearch, 300);
  const [debouncedRoleSearch] = useDebounce(roleSearch, 300);

  const usersQuery = useUsers({
    page,
    limit,
    query: activeFilters.query,
    domisili_id: activeFilters.domisiliId,
    campus_id: activeFilters.campusId,
    student_chapter_id: activeFilters.studentChapterId,
    student_club_id: activeFilters.studentClubId,
    role_id: activeFilters.roleId,
    sort: JSON.stringify(activeFilters.sort),
  });

  const domisiliQuery = useDomisili(debouncedDomisiliSearch);
  const campusQuery = useStudentCampuses(debouncedCampusSearch);
  const chapterQuery = useStudentChapters(debouncedChapterSearch);
  const clubQuery = useStudentClubs(debouncedClubSearch);
  const roleQuery = useRoles(debouncedRoleSearch);

  const validateMutation = useValidateMember();
  const sendDefaultPasswordMutation = useSendDefaultPassword();

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    setPage(1);
    setActiveFilters(filters);
  };

  const handleResetFilter = () => {
    setPage(1);
    setFilters(initialFilterState);
    setActiveFilters(initialFilterState);

    setDomisiliSearch("");
    setCampusSearch("");
    setChapterSearch("");
    setClubSearch("");
    setRoleSearch("");
  };

  const handleValidateMember = async (uniqueNumber: string[]) => {
    try {
      await validateMutation.mutateAsync(uniqueNumber);

      usersQuery.refetch();
    } catch (error: any) {
      console.error("Failed to validate member:", error);
      toast.error(
        error.message || "Gagal memvalidasi anggota. Silakan coba lagi."
      );
    }
  };

  const handleSendDefaultPassword = async (users_id: string[]) => {
    try {
      await sendDefaultPasswordMutation.mutateAsync(users_id);

      usersQuery.refetch();
    } catch (error: any) {
      console.error("Failed to send default password:", error);
      toast.error(
        error.message || "Gagal mengirim password default. Silakan coba lagi."
      );
    }
  };

  const domisiliOptions = useMemo(
    () =>
      domisiliQuery.data
        ?.filter((d: Domisili) => d.domisili != null)
        .map((d: Domisili) => ({ value: d.id, label: d.domisili })) || [],
    [domisiliQuery.data]
  );

  const campusOptions = useMemo(
    () =>
      campusQuery.data
        ?.filter((c: StudentCampus) => c.institute != null)
        .map((c: StudentCampus) => ({ value: c.id, label: c.institute })) || [],
    [campusQuery.data]
  );

  const chapterOptions = useMemo(
    () =>
      chapterQuery.data
        ?.filter((c: StudentChapter) => c.institute != null)
        .map((c: StudentChapter) => ({ value: c.id, label: c.institute })) ||
      [],
    [chapterQuery.data]
  );

  const roleOptions = useMemo(
    () =>
      roleQuery.data
        ?.filter((r: Role) => r.name != null)
        .map((r: Role) => ({ value: r.id, label: r.name })) || [],
    [roleQuery.data]
  );

  const clubOptions = useMemo(
    () =>
      clubQuery.data
        ?.filter((c: StudentClub) => c.name != null)
        .map((c: StudentClub) => ({ value: c.id, label: c.name })) || [],
    [clubQuery.data]
  );

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Members{" "}
            <Badge variant="outline" className="ml-2 font-mono">
              {usersQuery.data?.metaData.totalData || 0} Members
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola dan pantau semua anggota
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nama atau Email..."
                  value={filters.query}
                  onChange={(e) => updateFilter("query", e.target.value)}
                  className="pl-8 h-9 mt-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleApplyFilter();
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Domisili</label>
              <Combobox
                options={domisiliOptions}
                placeholder={
                  domisiliQuery.isLoading ? "Memuat..." : "Pilih domisili..."
                }
                onSearch={setDomisiliSearch}
                value={filters.domisiliId}
                onChange={(val) => updateFilter("domisiliId", val)}
                disabled={domisiliQuery.isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Campus</label>
              <Combobox
                options={campusOptions}
                placeholder={
                  campusQuery.isLoading ? "Memuat..." : "Pilih kampus..."
                }
                onSearch={setCampusSearch}
                value={filters.campusId}
                onChange={(val) => updateFilter("campusId", val)}
                disabled={campusQuery.isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Student Chapter</label>
              <Combobox
                options={chapterOptions}
                placeholder={
                  chapterQuery.isLoading ? "Memuat..." : "Pilih chapter..."
                }
                onSearch={setChapterSearch}
                value={filters.studentChapterId}
                onChange={(val) => updateFilter("studentChapterId", val)}
                disabled={chapterQuery.isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Student Club</label>
              <Combobox
                options={clubOptions}
                placeholder={
                  clubQuery.isLoading ? "Memuat..." : "Pilih klub..."
                }
                onSearch={setClubSearch}
                value={filters.studentClubId}
                onChange={(val) => updateFilter("studentClubId", val)}
                disabled={clubQuery.isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Role</label>
              <Combobox
                options={roleOptions}
                placeholder={
                  roleQuery.isLoading ? "Memuat..." : "Pilih peran..."
                }
                onSearch={setRoleSearch}
                value={filters.roleId}
                onChange={(val) => updateFilter("roleId", val)}
                disabled={roleQuery.isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Urutkan</label>
              <Select
                value={filters.sort.created_at.toString()}
                onValueChange={(value) =>
                  updateFilter("sort", { created_at: parseInt(value) })
                }
              >
                <SelectTrigger className="mt-1 h-9">
                  <SelectValue placeholder="Urutkan..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Terlama Dahulu</SelectItem>
                  <SelectItem value="1">Terbaru Dahulu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2 items pb-1">
              <Button
                className="flex-1"
                onClick={handleApplyFilter}
                disabled={usersQuery.isLoading}
              >
                <Filter className="w-4 h-4 mr-2" />
                Cari
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={handleResetFilter}
                title="Reset Filter"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {activeFilters.query && (
            <div className="mb-4 flex items-center gap-2 bg-muted/40 p-2 rounded-md border border-dashed">
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Hasil pencarian untuk "
                <span className="font-medium text-foreground">
                  {activeFilters.query}
                </span>
                "
              </span>
            </div>
          )}

          <MembersTable       
            data={usersQuery.data?.data || []}
            isLoading={usersQuery.isLoading}
            onValidate={handleValidateMember}
            onSendDefaultPassword={handleSendDefaultPassword}
          />

          {usersQuery.error && (
            <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed rounded-md mt-4 bg-muted/20">
              <div className="bg-red-500/10 p-3 rounded-full mb-3">
                <Info className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-lg font-medium">Error</h3>
              <p className="text-muted-foreground text-center mt-1 max-w-md">
                {usersQuery.error.message}
              </p>
            </div>
          )}
        </CardContent>

        {usersQuery.data && usersQuery.data.metaData.totalData > 0 && (
          <CardFooter className="bg-muted/20 border-t px-4 sm:px-6 py-2 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Halaman {usersQuery.data.metaData.page} dari{" "}
              {usersQuery.data.metaData.totalPage}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || usersQuery.isLoading}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={
                  page === usersQuery.data.metaData.totalPage ||
                  usersQuery.isLoading
                }
              >
                Next
              </Button>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  setLimit(parseInt(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-20 h-8 text-xs">
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
