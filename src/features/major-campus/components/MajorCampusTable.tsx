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
  useReactTable
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Loader2, Info, Edit, Trash2 } from 'lucide-react';
import type { MajorCampus } from '../types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MajorCampusTableProps {
  data: MajorCampus[];
  isLoading: boolean;
  onEdit: (majorCampus: MajorCampus) => void;
  onDelete: (majorCampus: MajorCampus) => void;
}

export function MajorCampusTable({ data, isLoading, onEdit, onDelete }: MajorCampusTableProps) {
  const columnHelper = createColumnHelper<MajorCampus>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID Jurusan',
      cell: (info) => {
        const id = info.getValue();
        return id ? (
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
        ) : '-';
      },
    }),
    columnHelper.accessor('major', {
      header: 'Nama Jurusan',
      cell: (info) => {
        const major = info.getValue();
        return major && major.trim() ? (
          <div className="font-medium">{major}</div>
        ) : (
          <span className="text-muted-foreground italic">(Jurusan belum diberi nama)</span>
        );
      },
    }),
    columnHelper.accessor('created_at', {
      header: 'Tanggal Dibuat',
      cell: (info) => {
        const date = new Date(info.getValue());
        return (
          <div className="flex items-center">
            <Badge variant="outline" className="font-normal px-3 py-1">
              {format(date, 'd MMMM yyyy')}
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
                  className="h-8 w-8"
                  onClick={() => onEdit(info.row.original)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Jurusan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete(info.row.original)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hapus Jurusan</p>
              </TooltipContent>
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
          <p className="text-sm text-muted-foreground">Sedang memuat data jurusan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md shadow-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-semibold py-4">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
                data-state={row.getIsSelected() && "selected"}
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
                  <p className="text-muted-foreground">Tidak ada data jurusan yang ditemukan.</p>
                  <p className="text-xs text-muted-foreground">Silakan tambahkan jurusan baru menggunakan tombol "Tambah Jurusan".</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 