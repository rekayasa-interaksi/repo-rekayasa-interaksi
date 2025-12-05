import {
  loginAdmin,
  logoutAdmin,
  getUserData,
  clearAuthData,
  getAccessToken,
  setAccessToken,
} from '@/utils/apiClient';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export type UserRole = 'superadmin' | 'admin' | 'member';

type User = {
  id: string;
  email: string;
  name: string;
  user_type: UserRole;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const queryClient = new QueryClient();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();
  const navigate = router ? router.navigate : null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderContent
        children={children}
        setUser={setUser}
        user={user}
        error={error}
        setError={setError}
        navigate={navigate}
      />
    </QueryClientProvider>
  );
};

const AuthProviderContent = ({
  children,
  setUser,
  user,
  error,
  setError,
  navigate,
}: {
  children: ReactNode;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  user: User | null;
  error: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  navigate: any;
}) => {
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(true);
  const hasInitRun = useRef(false);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleTokenExpiryLogout = (exp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const msUntilExpiry = (exp - now) * 1000;

    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (msUntilExpiry > 0) {
      logoutTimerRef.current = setTimeout(async () => {
        await logout();
        toast.info('Session expired. Logged out.');
      }, msUntilExpiry);
    }
  };

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await loginAdmin(email, password);
      const token = res?.access_token;
      if (!token) throw new Error('Invalid token');

      const decoded = JSON.parse(atob(token.split('.')[1]));
      if (decoded?.exp) scheduleTokenExpiryLogout(decoded.exp);
      return res;
    },
    onSuccess: async () => {
      const stored = await getUserData();
      if (stored) {
        setUser(stored as User);
        toast.success('Login berhasil!');
      }
    },
    onError: (error: any) => {
      setError(error);
      toast.error(error?.response?.data?.message || 'Login gagal. Periksa kredensial Anda.');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutAdmin,
    onSuccess: async () => {
      setUser(null);
      await clearAuthData();
      queryClient.clear();
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

      if (navigate) {
        navigate({ to: '/' });
      } else {
        window.location.href = '/';
      }

      toast.success('Logout berhasil');
    },
    onError: async () => {
      setUser(null);
      await clearAuthData();
      toast.error('Gagal logout dari server. Anda telah keluar dari sesi.');
    },
  });

  useEffect(() => {
    if (hasInitRun.current) return;
    hasInitRun.current = true;

    let isMounted = true;
    const init = async () => {
      try {
        const storedUser = await getUserData();
        if (storedUser && isMounted) {
          setUser(storedUser as User);

          const token = await getAccessToken();
          if (token) {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            if (decoded?.exp) {
              const now = Math.floor(Date.now() / 1000);
              if (now >= decoded.exp) {
                await clearAuthData();
                setUser(null);
                toast.error('Session expired. Please log in again.');
                if (navigate) {
                  navigate({ to: '/' });
                }
                return;
              }
              scheduleTokenExpiryLogout(decoded.exp);
            }
          } else {
            await clearAuthData();
            setUser(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          await clearAuthData();
        }
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };

    init();

    const handleLogin = async (event: CustomEvent<{ user: any }>) => {
      const userData = event.detail.user;
      if (userData && isMounted) {
        setUser(userData);
      }
    };

    const handleLogout = async () => {
      if (isMounted) {
        setUser(null);
      }
      await clearAuthData();
      if (navigate) {
        navigate({ to: '/' });
      } else {
        window.location.href = '/';
      }
    };

    const removeLoginListener = addAsyncEventListener<CustomEvent<{ user: any }>>(
      'auth:admin-login',
      handleLogin,
    );
    const removeLogoutListener = addAsyncEventListener<Event>('auth:admin-logout', handleLogout);

    return () => {
      isMounted = false;
      removeLoginListener();
      removeLogoutListener();
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false;
    return Array.isArray(role) ? role.includes(user.user_type) : user.user_type === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: isInitializing || loginMutation.isPending || logoutMutation.isPending,
        error,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function addAsyncEventListener<T extends Event>(
  type: string,
  listener: (event: T) => Promise<void> | void,
) {
  const wrappedListener = (event: T) => {
    try {
      const result = listener(event);
      if (result instanceof Promise) {
        result.catch((error) => {
          if (import.meta.env.MODE === 'development') {
            console.error(`Error in event listener for ${type}:`, error);
          }
        });
      }
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        console.error(`Error in event listener for ${type}:`, error);
      }
    }
  };

  window.addEventListener(type, wrappedListener as EventListener);
  return () => window.removeEventListener(type, wrappedListener as EventListener);
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
