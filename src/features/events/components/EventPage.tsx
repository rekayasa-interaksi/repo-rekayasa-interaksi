import { Button } from '@/components/ui/button';
import { Plus as PlusIcon, Edit, Trash2, Image as ImageIcon, Users } from 'lucide-react';
import { useState } from 'react';
import { useEvents, useDeleteEvent } from '../queries';
import type { Event } from '../types';
import { EventDialog } from './EventDialog';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from '@tanstack/react-router';

export function EventsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { data: events, isLoading, refetch } = useEvents();
  const deleteMutation = useDeleteEvent();

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;
    try {
      await deleteMutation.mutateAsync(selectedEvent.id);
      toast.success('Event berhasil dihapus');
      setIsDeleteDialogOpen(false);
      setSelectedEvent(undefined);
      refetch();
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Gagal menghapus event');
    }
  };

  const handleViewImages = (event: Event) => {
    setSelectedImages(event.images.map(img => import.meta.env.VITE_BUCKET_BASE_URL + img.image_path));
    setIsImageModalOpen(true);
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Events{' '}
            <Badge variant="outline" className="ml-2 font-mono">
              {events?.length || 0} Events
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola dan pantau semua data event</p>
        </div>
        <Button
          onClick={handleAdd}
          size="sm"
          className="bg-primary hover:bg-primary/90 transition-colors z-10 pointer-events-auto"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah Event
        </Button>
      </div>

      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardContent className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground mt-4">Sedang memuat data event...</p>
            </div>
          ) : events && events.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold py-4">Nama</TableHead>
                  <TableHead className="font-semibold py-4">Student Club</TableHead>
                  <TableHead className="font-semibold py-4">Student Chapter</TableHead>
                  <TableHead className="font-semibold py-4">Program</TableHead>
                  <TableHead className="font-semibold py-4">Status</TableHead>
                  <TableHead className="font-semibold py-4">Tipe</TableHead>
                  <TableHead className="font-semibold py-4">Tempat</TableHead>
                  <TableHead className="font-semibold py-4">Tanggal Event</TableHead>
                  <TableHead className="font-semibold py-4 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="py-3">
                      {event.name.length > 15 ? event.name.slice(0, 20) + '...' : event.name}
                    </TableCell>
                    <TableCell className="py-3">
                      {event.student_club ? event.student_club.name : 'N/A'}
                    </TableCell>
                    <TableCell className="py-3">
                      {event.student_chapter ? event.student_chapter.institute : 'N/A'}
                    </TableCell>
                    <TableCell className="py-3">
                      {event.program ? event.program.name : 'N/A'}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        className={
                          event.status === 'upcoming'
                            ? 'bg-yellow-400 text-black'
                            : event.status === 'active'
                            ? 'bg-blue-500 text-white'
                            : event.status === 'done'
                            ? 'bg-green-500 text-white'
                            : event.status === 'cancel'
                            ? 'bg-red-500 text-white'
                            : ''
                        }
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</TableCell>
                    <TableCell className="py-3">{event.place.charAt(0).toUpperCase() + event.place.slice(1)}</TableCell>
                    <TableCell className="py-3">
                        {event.detail_events.length > 0
                          ? (
                              <div className="flex flex-col gap-1">
                                {event.detail_events.map((detail, idx) => (
                                  <span key={idx}>
                                    {detail.date
                                      ? `${format(new Date(detail.date), 'd MMMM yyyy', { locale: id })}${
                                          detail.start_time && detail.end_time
                                            ? ` (${detail.start_time.slice(0, -3)} - ${detail.end_time.slice(0, -3)})`
                                            : detail.start_time
                                              ? ` (${detail.start_time.slice(0, -3)})`
                                              : ''
                                        }`
                                      : 'N/A'}
                                  </span>
                                ))}
                              </div>
                            )
                          : 'N/A'}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(event)}
                          aria-label={`Edit event ${event.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(event)}
                          aria-label={`Delete event ${event.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewImages(event)}
                          aria-label={`Lihat gambar event ${event.name}`}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Link
                          to="/event-data/$event_id"
                          params={{ event_id: event.id }}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`Lihat daftar pendaftar event ${event.name}`}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <PlusIcon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Belum ada event</h3>
              <p className="text-muted-foreground text-center mt-1 max-w-md">
                Tambahkan event baru untuk melihatnya di sini.
              </p>
              <Button onClick={handleAdd} variant="outline" className="mt-3">
                <PlusIcon className="mr-2 h-4 w-4" />
                Tambah Event Baru
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/20 border-t px-4 sm:px-6 py-2 text-xs text-muted-foreground">
          Terakhir diperbarui:{' '}
          {new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </CardFooter>
      </Card>

      <EventDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="create"
      />
      <EventDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        event={selectedEvent}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Event</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus event "{selectedEvent?.name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gambar Event</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[60vh]">
            {selectedImages.length > 0 ? (
              selectedImages.map((path, index) => (
                <img
                  key={index}
                  src={path}
                  alt={`Gambar event ${index + 1}`}
                  className="w-full h-auto rounded-lg object-cover"
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground col-span-full">
                Tidak ada gambar untuk event ini.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsImageModalOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}