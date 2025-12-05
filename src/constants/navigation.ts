import { UserRole } from '@/features/authentication/context/AuthContext';
import { NavigationGroup } from '@/types/navigation';
import {
  Home,
  Users,
  Building2,
  BookOpen,
  Landmark,
  ClipboardList,
  FileText,
  Briefcase,
  Activity,
  MailQuestion
} from 'lucide-react';

export const roleConfigs: Record<UserRole, { title: string }> = {
  superadmin: { title: 'Super Admin' },
  admin: { title: 'Admin' },
  member: { title: 'Member' },
};

export const defaultNavigation: NavigationGroup[] = [
  {
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: Home,
        roles: ['superadmin', 'admin'],
        exact: true,
      },
    ],
  },
  {
    groupName: 'Website Management',
    items: [
      {
        title: 'Roles',
        path: '/roles',
        icon: ClipboardList,
        roles: ['superadmin'],
      },
      {
        title: 'Team',
        path: '/team',
        icon: ClipboardList,
        roles: ['superadmin'],
      },
      {
        title: 'Histories',
        path: '/histories',
        icon: ClipboardList,
        roles: ['superadmin'],
      },
      {
        title: 'Faqs',
        path: '/faqs',
        icon: MailQuestion,
        roles: ['superadmin'],
      },
      {
        title: 'Help Center',
        path: '/help-center',
        icon: ClipboardList,
        roles: ['superadmin'],
      },
    ],
  },
  {
    groupName: 'Community Management',
    items: [
      {
        title: 'Student Clubs',
        path: '/student-clubs',
        icon: Users,
        roles: ['superadmin', 'admin'],
      },
      {
        title: 'Student Campus',
        path: '/student-campus',
        icon: Building2,
        roles: ['superadmin'],
      },
      {
        title: 'Major Campus',
        path: '/major-campuses',
        icon: BookOpen,
        roles: ['superadmin'],
      },
      {
        title: 'Student Chapters',
        path: '/student-chapters',
        icon: Landmark,
        roles: ['superadmin', 'admin'],
      },
      {
        title: 'External Organizations',
        path: '/external-organizations',
        icon: Landmark,
        roles: ['superadmin', 'admin'],
      },
    ],
  },
  {
    groupName: 'Program Management',
    items: [
      {
        title: 'Program Alumni',
        path: '/program-alumnis',
        icon: Briefcase,
        roles: ['superadmin'],
      },
      {
        title: 'Programs',
        path: '/programs',
        icon: FileText,
        roles: ['superadmin', 'admin'],
      },
      {
        title: 'Events',
        path: '/events',
        icon: Activity,
        roles: ['superadmin', 'admin'],
      }
    ],
  },
  {
    groupName: 'Member Management',
    items: [
      {
        title: 'Members',
        path: '/members',
        icon: Users,
        roles: ['superadmin'],
      },
      {
        title: 'Organizational Structure',
        path: '/organizational-structure',
        icon: Users,
        roles: ['superadmin'],
      },
    ],
  },
];
