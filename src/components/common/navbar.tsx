import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { roleConfigs } from '@/constants/navigation';
import { useAuth } from '@/features/authentication/context/AuthContext';
import { UserRole } from '@/features/authentication/context/AuthContext';
import { cn } from '@/lib/utils';
import { Link, redirect, useRouterState } from '@tanstack/react-router';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Navbar() {
  const routerState = useRouterState();
  const { user, logout, isLoading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  const userRole = user?.user_type?.toLowerCase() as UserRole | undefined;
  const roleConfig = userRole ? roleConfigs[userRole] || { title: userRole } : { title: '' };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const currentRoute = routerState.location.pathname;
    const segments = currentRoute.split('/').filter(Boolean);

    if (segments.length === 0) {
      setPageTitle('Dashboard');
      return;
    }

    const formatSegment = (segment: string): string => {
      return segment
        .replace(/-/g, ' ')
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const lastSegment = segments[segments.length - 1];
    const isLastSegmentId = /^\d+$/.test(lastSegment);

    const managementResources = [
      'student-clubs',
      'student-campuses', 
      'major-campuses',
      'student-chapters',
      'roles',
      'program-alumnis',
      'programs',
      'events',
      'members'
    ];

    if (isLastSegmentId) {
      const resource = segments[segments.length - 2] || '';
      const formattedResource = formatSegment(resource);
      setPageTitle(`Detail ${formattedResource}`);
    } else if (segments.length > 1) {
      const formattedSegments = segments.map(formatSegment);
      setPageTitle(formattedSegments.join(' '));
    } else {
      const segment = segments[0];
      const formattedSegment = formatSegment(segment);

      if (managementResources.includes(segment)) {
        setPageTitle(`Manajemen ${formattedSegment}`);
      } else {
        setPageTitle(formattedSegment);
      }
    }
  }, [routerState.location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();

      redirect({ to: '/login' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserInitial = () => {
    if (!user || !user.name) return '';
    return user.name.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <header
        className={cn(
          'sticky top-0 z-50 w-full px-4 flex flex-col border-b backdrop-blur-sm transition-all duration-200',
          scrolled ? 'bg-background/80 shadow-sm' : 'bg-background',
        )}
      >
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full px-4 flex flex-col border-b backdrop-blur-sm transition-all duration-200',
        scrolled ? 'bg-background/80 shadow-sm' : 'bg-background',
      )}
    >
      <div className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-medium bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative pl-2 pr-0 hover:bg-primary/10 focus:bg-primary/10 transition-colors duration-200 group"
                >
                  <div className="relative">
                    <Avatar className="h-9 w-9 mr-2 border border-border ring-2 ring-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="hidden flex-col items-start mr-2 md:flex">
                    <span className="text-sm font-medium leading-none text-foreground">
                      {user?.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px] group-hover:text-primary/80 transition-colors duration-200">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel className="p-4">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <Badge
                      variant="outline"
                      className="mt-1 w-fit px-2.5 py-0.5 font-medium text-primary border-primary/20 bg-primary/10"
                    >
                      {roleConfig.title || userRole || 'User'}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/60" />
                <div className="p-1">
                  <DropdownMenuItem
                    asChild
                    className="flex items-center py-2.5 text-foreground hover:text-foreground focus:text-foreground hover:bg-foreground/10 focus:bg-foreground/10 cursor-pointer transition-colors duration-200 rounded-md"
                  >
                    <Link to="/edit-profile">
                      <User className="mr-3 h-4 w-4" />
                      <span className="font-medium">Edit Profil</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
                <div className="p-1">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center py-2.5 text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer transition-colors duration-200 rounded-md"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Keluar</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
