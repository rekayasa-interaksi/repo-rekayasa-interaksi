import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ReactNode } from 'react';

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
});

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary/80 flex-col items-center justify-between p-10 relative overflow-hidden">
        <div className="absolute top-8 left-8">
          <img src="/images/DigistarClub_white.png" alt="Digistar Logo" className="h-10" />
        </div>
        
        <div className="w-full flex flex-col items-center justify-center h-full">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-primary-foreground">
              Selamat Datang, Admin
            </h1>
            <p className="text-primary-foreground/90 mb-6">
              Kelola komunitas digital, event, dan student clubs dengan mudah melalui dashboard admin Digistar Club.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <p className="text-white font-medium">Komunitas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <p className="text-white font-medium">Event</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <p className="text-white font-medium">Clubs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 text-primary-foreground/70 text-sm">
          © {new Date().getFullYear()} Digistar Club by Telkom Indonesia. All rights reserved.
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-gradient-to-b from-muted to-background flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

function RouteComponent() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
