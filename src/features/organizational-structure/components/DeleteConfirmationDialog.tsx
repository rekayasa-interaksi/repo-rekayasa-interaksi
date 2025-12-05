import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeleteOrganizationalStructure } from '../queries';
import type { OrganizationalStructure } from '../types';
import { toast } from 'sonner';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationalStructure: OrganizationalStructure;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  organizationalStructure,
}: DeleteConfirmationDialogProps) {
  const deleteMutation = useDeleteOrganizationalStructure();

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(organizationalStructure.id);
      onOpenChange(false);
      toast.success('Struktur organisasi berhasil dihapus');
    } catch (error) {
      console.error('Failed to delete organizational structure:', error);
      toast.error('Gagal menghapus struktur organisasi');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus Struktur Organisasi</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus struktur organisasi "{organizationalStructure.name}"? Tindakan ini tidak dapat dibatalkan.
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