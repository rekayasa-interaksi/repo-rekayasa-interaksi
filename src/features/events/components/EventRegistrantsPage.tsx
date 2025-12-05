import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, MailIcon } from 'lucide-react';
import { useParams } from '@tanstack/react-router';
import apiClient from '@/utils/apiClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Member {
  user_id: string;
  name: string;
  email: string;
  unique_number: string;
  attend: boolean;
  duration: string | null;
  evidence_path: string | null;
  suggestion: string | null;
  material_quality: string | null;
  delivery_quality: string | null;
  next_topic: string | null;
}

interface EventDetail {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

interface Registrant {
  detail_event: EventDetail;
  members: Member[];
}

interface FetchRegistrantsResponse {
  registrants: Registrant[];
  status_event: string;
}

async function fetchRegistrants(eventId: string): Promise<FetchRegistrantsResponse> {
  try {
    const response = await apiClient.get(`/events/registrants/${eventId}`);
    const registrants = response?.data?.data?.registrants;
    const status_event = response?.data?.data?.status_event || 'unknown';
    return {
      registrants: Array.isArray(registrants) ? registrants : [],
      status_event,
    };
  } catch (error) {
    console.error('Failed to fetch registrants:', error);
    throw new Error('Gagal memuat daftar pendaftar');
  }
}

async function sendZoomLink(eventId: string, zoomLink: string): Promise<void> {
  try {
    await apiClient.post(`/events/send-link-meeting/${eventId}`, { zoom_link: zoomLink });
    alert('Link Zoom berhasil dikirim!');
  } catch (error) {
    console.error('Failed to send Zoom link:', error);
    throw new Error('Gagal mengirim link Zoom');
  }
}

export function EventRegistrantsPage() {
  const { event_id } = useParams({ from: '/_dashboard/registrants/$event_id' }) as { event_id: string };
  const { data, isLoading, error } = useQuery({
    queryKey: ['registrants', event_id],
    queryFn: () => fetchRegistrants(event_id),
    enabled: !!event_id,
  });

  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomLink, setZoomLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const registrants = data?.registrants || [];
  const statusEvent = data?.status_event || 'unknown';

  const handleAdd = () => {
    setIsZoomModalOpen(true);
  };

  const handleSubmitZoomLink = async () => {
    if (!zoomLink.trim()) {
      alert('Link Zoom tidak boleh kosong');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendZoomLink(event_id, zoomLink);
      setIsZoomModalOpen(false);
      setZoomLink('');
    } catch (error) {
      alert((error as Error).message || 'Gagal mengirim link Zoom');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenImageModal = (imageUrl: string | null) => {
    if (imageUrl) {
      setSelectedImage(`${import.meta.env.VITE_BUCKET_BASE_URL}${imageUrl}`);
      setIsImageModalOpen(true);
    }
  };

  const totalRegistrants = Array.isArray(registrants)
    ? registrants.reduce((total, event) => total + (event.members?.length || 0), 0)
    : 0;

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Pendaftar Events{' '}
            <Badge variant="outline" className="ml-2 font-mono">
              {totalRegistrants} Pendaftar
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola dan pantau data pendaftar event</p>
        </div>
        {statusEvent === 'upcoming' && (
          <Button
            onClick={handleAdd}
            size="sm"
            className="bg-primary hover:bg-primary/90 transition-colors z-10 pointer-events-auto"
            disabled={isSubmitting}
          >
            <MailIcon className="mr-2 h-4 w-4" />
            Kirim Link Meeting
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {(error as Error).message}</p>
      ) : Array.isArray(registrants) && registrants.length > 0 ? (
        registrants.map((event) => (
          <Card key={event.detail_event.id} className="shadow-sm border-t-4 border-t-primary mb-6">
            <CardHeader>
              <CardTitle>{event.detail_event.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                <p>Tanggal: {event.detail_event.date}</p>
                <p>Waktu: {event.detail_event.start_time} - {event.detail_event.end_time}</p>
                <p>Dibuat pada: {new Date(event.detail_event.created_at).toLocaleString()}</p>
              </div>
            </CardHeader>
            <CardContent>
              {event.members && event.members.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Nomor Unik</TableHead>
                      <TableHead>Kehadiran</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead>Bukti</TableHead>
                      <TableHead>Saran</TableHead>
                      <TableHead>Kualitas Materi</TableHead>
                      <TableHead>Kualitas Penyampaian</TableHead>
                      <TableHead>Topik Berikutnya</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {event.members.map((member) => (
                      <TableRow key={member.user_id}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.unique_number}</TableCell>
                        <TableCell>{member.attend ? 'Hadir' : 'Tidak Hadir'}</TableCell>
                        <TableCell>{member.duration || '-'}</TableCell>
                        <TableCell>
                          {member.evidence_path ? (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenImageModal(member.evidence_path);
                              }}
                              className="text-blue-600 hover:underline"
                            >
                              Lihat Bukti
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>{member.suggestion || '-'}</TableCell>
                        <TableCell>{member.material_quality || '-'}</TableCell>
                        <TableCell>{member.delivery_quality || '-'}</TableCell>
                        <TableCell>{member.next_topic || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground">Belum ada pendaftar untuk event ini.</p>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="shadow-sm border-t-4 border-t-primary">
          <CardContent>
            <p className="text-center text-muted-foreground">Belum ada event atau pendaftar untuk event ini.</p>
          </CardContent>
        </Card>
      )}

      {/* Zoom Link Modal */}
      <Dialog open={isZoomModalOpen} onOpenChange={setIsZoomModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kirim Link Zoom</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="zoomLink">Link Zoom</Label>
              <Input
                id="zoomLink"
                value={zoomLink}
                onChange={(e) => setZoomLink(e.target.value)}
                placeholder="Masukkan link Zoom"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsZoomModalOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button onClick={handleSubmitZoomLink} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kirim'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bukti Kehadiran</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Bukti Kehadiran"
                className="max-w-full max-h-[500px] object-contain"
              />
            ) : (
              <p className="text-muted-foreground">Tidak ada gambar untuk ditampilkan</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageModalOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}