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
import { useDeleteProgramAlumni } from '../queries';
import type { ProgramAlumni } from '../types';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ProgramAlumni: ProgramAlumni;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  ProgramAlumni, 
}: DeleteConfirmationDialogProps) {
  const deleteMutation = useDeleteProgramAlumni();
  const isDeleting = deleteMutation.isPending;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(ProgramAlumni.id);
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
            <DialogTitle className="text-xl font-bold">Hapus ProgramAlumni</DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="px-6 py-4">
          <DialogDescription className="text-center text-base">
            Apakah Anda yakin ingin menghapus programAlumni <span className="font-semibold text-foreground">"{ProgramAlumni.name}"</span>?
            <p className="mt-2 text-sm text-muted-foreground">
              Tindakan ini tidak dapat dibatalkan. Semua data terkait jurusan ini akan dihapus secara permanen.
            </p>
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