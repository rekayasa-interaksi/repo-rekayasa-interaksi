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
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2, Info, Edit, Trash2, FileText } from 'lucide-react';
import type { Faq } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FaqTableProps {
  data: Faq[];
  isLoading: boolean;
  onEdit: (faq: Faq) => void;
  onEditAnswer: (faq: Faq) => void;
  onDelete: (faq: Faq) => void;
}

export function FaqTable({ data, isLoading, onEdit, onEditAnswer, onDelete }: FaqTableProps) {
  const columnHelper = createColumnHelper<Faq>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID FAQ',
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
    columnHelper.accessor('question', {
      header: 'Pertanyaan',
      cell: (info) => (
        <div className="font-medium">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('answer', {
      header: 'Jawaban',
      cell: (info) => (
        <div className="font-medium prose prose-sm max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              ol: ({ children, ...props }) => (
                <ol className="list-decimal list-inside" {...props}>
                  {children}
                </ol>
              ),
              ul: ({ children, ...props }) => (
                <ul className="list-disc list-inside" {...props}>
                  {children}
                </ul>
              ),
            }}
          >
            {info.getValue()}
          </ReactMarkdown>
        </div>
      ),
    }),
    columnHelper.accessor('show', {
      header: 'Show',
      cell: (info) => (
        <Badge variant={info.getValue() ? 'default' : 'destructive'} className="font-normal px-3 py-1">
          {info.getValue() ? 'Active' : 'Inactive'}
        </Badge>
      ),
    }),
    columnHelper.accessor('menu', {
      header: 'Menu',
      cell: (info) => (
        <div className="font-medium">
          {info.getValue()}
        </div>
      ),
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
              <TooltipContent>Edit FAQ ini</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/20 hover:text-primary"
                  onClick={() => onEditAnswer(info.row.original)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit jawaban FAQ ini</TooltipContent>
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
              <TooltipContent>Hapus FAQ ini</TooltipContent>
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
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-md border p-12 w-full flex items-center justify-center bg-background/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Sedang memuat data FAQ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
                    <p className="text-muted-foreground">Tidak ada data FAQ yang ditemukan.</p>
                    <p className="text-xs text-muted-foreground">Silakan tambahkan data baru melalui tombol "Tambah FAQ".</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className='ml-3'>Halaman</span>
          <span>{table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}