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
import { Badge } from '@/components/ui/badge';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Info, Loader2, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { HistoryFormData, History } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface MembersTableProps {
  data: History[];
  isLoading: boolean;
  onEdit: (history: History) => void;
  onDelete: (history: History) => void;
}

export function HistoryTable({ data, isLoading, onEdit, onDelete }: MembersTableProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const columnHelper = createColumnHelper<History>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
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
                <p>{id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    }),
    columnHelper.accessor('title', {
      header: 'Judul Kegiatan',
      cell: (info) => {
        const name = info.getValue();
        return name && name.trim() ? (
          <div className="font-medium">{name}</div>
        ) : (
          <span className="text-muted-foreground italic">(Kegiatan belum diberi nama)</span>
        );
      },
    }),
    columnHelper.accessor('description', {
      header: 'Deskripsi Kegiatan',
      cell: (info) => {
        const description = info.getValue();
        return description && description.trim() ? (
          <div className="font-medium">{description}</div>
        ) : (
          <span className="text-muted-foreground italic">(Kegiatan belum diberi deskripsi)</span>
        );
      },
    }),columnHelper.accessor('image_url', {
      header: 'Gambar',
      cell: (info) => {
        const imageUrl = info.getValue();
        return imageUrl ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className="text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedImageUrl(imageUrl);
                    setIsImageModalOpen(true);
                  }}
                >
                  Lihat Gambar
                </a>
              </TooltipTrigger>
              <TooltipContent>Lihat gambar kegiatan</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-muted-foreground">Tidak ada gambar</span>
        );
      },
    }),
    columnHelper.accessor('date', {
      header: 'Tanggal Kegiatan',
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
                  className="h-8 w-8"
                  onClick={() => onEdit(info.row.original)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Club</p>
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
                <p>Delete Club</p>
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
          <p className="text-sm text-muted-foreground">Sedang memuat data sejarah Digistar Club...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-semibold py-4">
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
                    <p className="text-muted-foreground">Tidak ada data sejarah kegiatan yang ditemukan.</p>
                    <p className="text-xs text-muted-foreground">Silakan tambahkan sejarah kegiatan baru menggunakan tombol "Tambah Kegiatan".</p>
                  </div>
                </TableCell>
              </TableRow>
          )}
        </TableBody>
      </Table>
      
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Pratinjau Gambar</DialogTitle>
          </DialogHeader>
          {selectedImageUrl ? (
            <div className="flex justify-center">
              <img
                src={selectedImageUrl}
                alt="Student Club"
                className="max-w-full max-h-[400px] object-contain"
              />
            </div>
          ) : (
            <p className="text-muted-foreground">Gambar tidak tersedia.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}