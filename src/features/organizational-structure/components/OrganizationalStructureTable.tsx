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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2, Info, Edit, Trash2, Instagram, Linkedin, Send, Phone, Mail } from 'lucide-react';
import type { OrganizationalStructure } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface OrganizationalStructureTableProps {
  data: OrganizationalStructure[];
  isLoading: boolean;
  onEdit: (structure: OrganizationalStructure) => void;
  onDelete: (structure: OrganizationalStructure) => void;
}

export function OrganizationalStructureTable({ data, isLoading, onEdit, onDelete }: OrganizationalStructureTableProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const columnHelper = createColumnHelper<OrganizationalStructure>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => {
        const id = info.getValue();
        const truncatedId = id ? `${id.substring(0, 8)}...` : '';
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="font-mono text-xs text-muted-foreground cursor-help">
                  {truncatedId}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <div className="text-xs font-mono">{id}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    }),
    columnHelper.accessor('name', {
      header: 'Nama',
      cell: (info) => (
        <div className="font-medium">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('type', {
      header: 'Tipe',
      cell: (info) => {
        const type = info.getValue();
        return (
          <div className="font-medium">
            {type === 'digistar_club' ? 'Digistar Club' : type === 'student_club' ? 'Student Club' : 'Campus Chapter'}
          </div>
        );
      },
    }),
    columnHelper.accessor('position', {
      header: 'Posisi',
      cell: (info) => (
        <div className="font-medium">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('student_chapter', {
      header: 'Chapter',
      cell: (info) => (
        <div className="font-medium">{info.getValue()?.institute ?? '-'}</div>
      ),
    }),
    columnHelper.accessor('student_club', {
      header: 'Club',
      cell: (info) => (
        <div className="font-medium">{info.getValue()?.name ?? '-'}</div>
      ),
    }),
    columnHelper.accessor('generation', {
      header: 'Angkatan',
      cell: (info) => (
        <div className="font-medium">{info.getValue() ?? '-'}</div>
      ),
    }),
    columnHelper.accessor('social_media', {
      header: 'Social Media',
      cell: (info) => {
        const sm = info.getValue();
        if (!sm) return <span className="text-muted-foreground">-</span>;

        const platforms = [
          { icon: <Instagram className="w-3 h-3 text-pink-500" />, value: sm.instagram, label: 'Instagram' },
          { icon: <Linkedin className="w-3 h-3 text-blue-600" />, value: sm.linkedin, label: 'LinkedIn' },
          { icon: <Send className="w-3 h-3 text-blue-400" />, value: sm.telegram, label: 'Telegram' },
          { icon: <Phone className="w-3 h-3 text-green-500" />, value: sm.whatsapp, label: 'WhatsApp' },
          { icon: <Mail className="w-3 h-3 text-red-500" />, value: sm.mail, label: 'Email' },
        ];

        return (
          <div className="flex flex-col gap-1 text-xs">
            {platforms.map(
              (p, idx) =>
                p.value && (
                  <TooltipProvider key={idx}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-muted/20 rounded text-xs cursor-help">
                          {p.icon} {p.value}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>{p.label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('image_url', {
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
              <TooltipContent>Lihat gambar struktur organisasi</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-muted-foreground">Tidak ada gambar</span>
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
              <TooltipContent>Edit struktur organisasi ini</TooltipContent>
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
              <TooltipContent>Hapus struktur organisasi ini</TooltipContent>
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
          <p className="text-sm text-muted-foreground">Sedang memuat data struktur organisasi...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
                    <p className="text-muted-foreground">
                      Tidak ada data struktur organisasi yang ditemukan.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Silakan tambahkan data baru melalui tombol "Tambah Struktur".
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Pratinjau Gambar</DialogTitle>
          </DialogHeader>
          {selectedImageUrl ? (
            <div className="flex justify-center">
              <img
                src={selectedImageUrl}
                alt="Organizational Structure"
                className="max-w-full max-h-[400px] object-contain"
              />
            </div>
          ) : (
            <p className="text-muted-foreground">Gambar tidak tersedia.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}