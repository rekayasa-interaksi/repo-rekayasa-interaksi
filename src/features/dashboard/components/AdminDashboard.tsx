import { defaultNavigation } from '@/constants/navigation';
import { useAuth } from '@/features/authentication/context/AuthContext';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Building, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Calendar, 
  User, 
  FileText, 
  School 
} from 'lucide-react';
import { useUsers } from '../../member/queries';
import { usePrograms } from '../../program/queries';
import { useStudentChapters } from '../../student-chapter/queries';
import { useEvents } from '@/features/events/queries';

export function AdminDashboard() {
  const { user } = useAuth();
  const userName = user?.name || 'Admin';

  const usersQuery = useUsers({});
  const totalMembers = usersQuery.data?.metaData?.totalData ?? 0;
  const { data: events } = useEvents();
  const { data: programs } = usePrograms();
  const { data: studentChapters } = useStudentChapters();

  // Filter navigation items for admin role
  const adminNavItems = defaultNavigation.flatMap((group) => 
    group.items.filter(item => item.roles?.includes('admin'))
  );

  // Create menu items based on navigation configuration
  const menuItems = [
    {
      title: 'Student Clubs',
      icon: <School className="h-5 w-5" />,
      path: '/student-clubs',
      description: 'Kelola klub dan organisasi mahasiswa',
    },
    {
      title: 'Student Campus',
      icon: <GraduationCap className="h-5 w-5" />,
      path: '/student-campuses',
      description: 'Lihat dan kelola data kampus mahasiswa',
    },
    {
      title: 'Major Campus',
      icon: <Building className="h-5 w-5" />,
      path: '/major-campuses',
      description: 'Konfigurasi jurusan dan departemen kampus',
    },
    {
      title: 'Student Chapters',
      icon: <BookOpen className="h-5 w-5" />,
      path: '/student-chapters',
      description: 'Kelola chapter dan kelompok mahasiswa',
    },
    {
      title: 'Alumni Program',
      icon: <Users className="h-5 w-5" />,
      path: '/program-alumnis',
      description: 'Lacak dan berinteraksi dengan alumni program',
    },
    { 
      title: 'Program', 
      icon: <FileText className="h-5 w-5" />, 
      path: '/programs', 
      description: 'Buat dan kelola program' 
    },
    {
      title: 'Acara',
      icon: <Calendar className="h-5 w-5" />,
      path: '/events',
      description: 'Jadwalkan dan kelola acara komunitas',
    },
    { 
      title: 'Anggota', 
      icon: <User className="h-5 w-5" />, 
      path: '/members', 
      description: 'Lihat dan kelola anggota komunitas' 
    },
  ];

  // Group menu items by category for better organization
  const frequentlyUsed = menuItems.slice(0, 4);
  const managementTools = menuItems.slice(4);

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="border-none shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="bg-indigo-100 rounded-full p-4 text-indigo-600 flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Selamat datang, {userName}!
              </h1>
              <p className="mt-2 text-gray-600">
                Kelola komunitas dengan mudah melalui dashboard.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="bg-white/50 text-gray-600">
                  Login terakhir: {formattedDate}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="sering-digunakan" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="sering-digunakan" className="text-sm md:text-base">
            <span className="mr-2">⭐</span> Manajemen Kampus & Jurusan
          </TabsTrigger>
          <TabsTrigger value="alat-manajemen" className="text-sm md:text-base">
            <span className="mr-2">🛠️</span> Manajemen Klub & Chapter
          </TabsTrigger>
        </TabsList>

        {/* Frequently Used Tab */}
        <TabsContent value="sering-digunakan" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {frequentlyUsed.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="block h-full"
              >
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/20 hover:bg-blue-50/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        {item.icon}
                      </div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* Management Tools Tab */}
        <TabsContent value="alat-manajemen" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {managementTools.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="block h-full"
              >
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/20 hover:bg-blue-50/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        {item.icon}
                      </div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ringkasan Aktivitas</CardTitle>
          <CardDescription>Statistik aktivitas terbaru dalam sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Anggota</span>
              <span className="text-2xl font-bold">{totalMembers}</span>
            </div>
            <div className="flex flex-col p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600">Acara Aktif</span>
              <span className="text-2xl font-bold">{events?.length ?? 0}</span>
            </div>
            <div className="flex flex-col p-3 bg-amber-50 rounded-lg">
              <span className="text-sm text-gray-600">Chapter</span>
              <span className="text-2xl font-bold">{studentChapters?.length ?? 0}</span>
            </div>
            <div className="flex flex-col p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-gray-600">Program</span>
              <span className="text-2xl font-bold">{programs?.length ?? 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}