import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeleteFeature } from '../queries';
import type { Feature } from '../types';
import { toast } from 'sonner';

interface DeleteFeatureConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: Feature;
}

export function DeleteFeatureConfirmationDialog({
  open,
  onOpenChange,
  feature,
}: DeleteFeatureConfirmationDialogProps) {
  const deleteMutation = useDeleteFeature();

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(feature.id);
      onOpenChange(false);
      toast.success('Fitur sistem berhasil dihapus');
    } catch (error) {
      console.error('Failed to delete fitur sistem:', error);
      toast.error('Gagal menghapus fitur sistem');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus Tim</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus fitur "{feature.name}"? Tindakan ini tidak dapat dibatalkan.
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