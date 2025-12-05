import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeleteTeam } from '../queries';
import type { Team } from '../types';
import { toast } from 'sonner';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  team,
}: DeleteConfirmationDialogProps) {
  const deleteMutation = useDeleteTeam();

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(team.id);
      onOpenChange(false);
      toast.success('Tim berhasil dihapus');
    } catch (error) {
      console.error('Failed to delete tim:', error);
      toast.error('Gagal menghapus tim');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus Tim</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus tim "{team.name}"? Tindakan ini tidak dapat dibatalkan.
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