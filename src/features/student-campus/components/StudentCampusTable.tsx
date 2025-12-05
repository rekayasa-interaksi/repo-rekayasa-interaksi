import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2, Info, Edit, Trash2 } from 'lucide-react';
import type { StudentCampus } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { id } from 'date-fns/locale';

interface StudentCampusTableProps {
  data: StudentCampus[];
  isLoading: boolean;
  onEdit: (campus: StudentCampus) => void;
  onDelete: (campus: StudentCampus) => void;
}

export function StudentCampusTable({ data, isLoading, onEdit, onDelete }: StudentCampusTableProps) {
  const columnHelper = createColumnHelper<StudentCampus>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID Kampus',
      cell: (info) => {
        const id = info.getValue();
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help font-mono text-xs bg-muted px-2.5 py-1.5 rounded">
                  {id.substring(0, 8)}...
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>ID Lengkap: {id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    }),
    columnHelper.accessor('institute', {
      header: 'Institusi',
      cell: (info) => (
        <div className="font-medium">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Tanggal Dibuat',
      cell: (info) => {
        const date = new Date(info.getValue());
        return (
          <div className="flex items-center">
            <Badge variant="outline" className="font-normal px-3 py-1">
              {format(date, 'EEEE, d MMMM yyyy', { locale: id })}
            </Badge>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-center">Tindakan</div>,
      cell: (info) => (
        <div className="flex items-center justify-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                  onClick={() => onEdit(info.row.original)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit kampus ini</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 text-destructive hover:text-destructive"
                  onClick={() => onDelete(info.row.original)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Hapus kampus ini</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="rounded-md border p-12 w-full flex items-center justify-center bg-background/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Sedang memuat data kampus mahasiswa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="py-4 font-semibold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="hover:bg-muted/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Info className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">Tidak ada data kampus mahasiswa yang ditemukan.</p>
                  <p className="text-xs text-muted-foreground">Silakan tambahkan data baru melalui tombol "Tambah Data Kampus".</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
