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
import { Loader2, Info, CheckCircle } from 'lucide-react';
import type { HelpCenter } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { updateHelpCenter } from '../services';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface HelpCenterTableProps {
  data: HelpCenter[];
  isLoading: boolean;
}

export function HelpCenterTable({ data, isLoading }: HelpCenterTableProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const openAnswerModal = (id: string) => {
    setSelectedId(id);
    setAnswer("");
    setOpen(true);
  };
  const columnHelper = createColumnHelper<HelpCenter>();
  const queryClient = useQueryClient();

  const handleSubmitAnswer = async () => {
    if (!selectedId) return;

    try {
      await updateHelpCenter(selectedId, { answer });
      toast.success("Jawaban berhasil disimpan");

      queryClient.invalidateQueries({ queryKey: ["help-center"] });

      setOpen(false);
    } catch (error) {
      toast.error("Gagal menyimpan jawaban");
    }
  };

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID Help Center',
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
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => (
        <div className="font-medium">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <Badge variant={info.getValue() ? 'default' : 'destructive'} className="font-normal px-3 py-1">
          {info.getValue() ? 'Active' : 'Inactive'}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-center">Action</div>,
      cell: (info) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => openAnswerModal(info.row.original.id)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
          </Button>
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
          <p className="text-sm text-muted-foreground">Sedang memuat data Help Center...</p>
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
                    <p className="text-muted-foreground">Tidak ada data Help Center yang ditemukan.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Masukkan Jawaban</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <label className="text-sm font-medium">Jawaban:</label>
            <Textarea
              placeholder="Tulis jawaban untuk pertanyaan ini..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmitAnswer}>
              Simpan Jawaban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}