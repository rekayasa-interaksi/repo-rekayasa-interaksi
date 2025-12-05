import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeleteVersion } from '../queries';
import type { Version } from '../types';
import { toast } from 'sonner';

interface DeleteVersionConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  version: Version;
}

export function DeleteVersionConfirmationDialog({
  open,
  onOpenChange,
  version,
}: DeleteVersionConfirmationDialogProps) {
  const deleteMutation = useDeleteVersion();

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(version.id);
      onOpenChange(false);
      toast.success('Versi sistem berhasil dihapus');
    } catch (error) {
      console.error('Failed to delete Versi sistem:', error);
      toast.error('Gagal menghapus Versi sistem');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus Tim</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus versi "{version.version}"? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}