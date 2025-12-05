import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useDeleteFaq } from '../queries';
import type { Faq } from '../types';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: Faq;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  faq,
}: DeleteConfirmationDialogProps) {
  const deleteMutation = useDeleteFaq();
  const isDeleting = deleteMutation.isPending;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(faq.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="bg-red-500/10 px-6 pt-6 pb-4 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold">Hapus FAQ</DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="px-6 py-4">
          <DialogDescription className="text-center text-base">
            Apakah Anda yakin ingin menghapus FAQ <span className="font-semibold text-foreground">"{faq.question}"</span>?
          </DialogDescription>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 px-6 py-4 border-t bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="w-full sm:w-auto gap-2"
          >
            <X className="h-4 w-4" />
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto gap-2"
          >
            {isDeleting ? (
              'Menghapus...'
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Hapus
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}