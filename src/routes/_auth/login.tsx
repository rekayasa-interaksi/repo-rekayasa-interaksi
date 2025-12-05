import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createFileRoute,
  useNavigate,
  Link,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/features/authentication/context/AuthContext";

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email harus diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        navigate({ to: "/dashboard" });
      }
    };

    if (!isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      form.reset();
    } catch (error) {
      form.setError("root", {
        message: "Login gagal. Silakan periksa kredensial Anda.",
      });
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto my-4 sm:my-8">
      <Card className="w-full shadow-xl border-0 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-primary/80"></div>
        <CardHeader className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 pt-6">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-center text-foreground">
            Selamat Datang Kembali
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base font-normal text-muted-foreground">
            Silahkan masuk untuk mengakses dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-5 pt-1 sm:pt-2 px-6 sm:px-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2 sm:space-y-2.5">
                    <FormLabel className="text-xs sm:text-sm font-medium text-foreground block mb-0.5 sm:mb-1">
                      Email
                    </FormLabel>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
                        <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Masukkan alamat email Anda"
                          className="bg-background border-input focus:border-primary py-5 sm:py-6 text-sm sm:text-base pl-10 transition-all rounded-md"
                          aria-label="Email"
                          autoComplete="email"
                          autoFocus
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2 sm:space-y-2.5">
                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                      <FormLabel className="text-xs sm:text-sm font-medium text-foreground block">
                        Kata Sandi
                      </FormLabel>
                    </div>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
                        <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan kata sandi Anda"
                          className="bg-background border-input focus:border-primary py-5 sm:py-6 text-sm sm:text-base pl-10 pr-10 transition-all rounded-md"
                          aria-label="Password"
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" />
                        ) : (
                          <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                        )}
                      </button>
                    </div>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 py-5 sm:py-6 text-sm sm:text-base font-medium rounded-md shadow-sm hover:shadow mt-4 sm:mt-6 flex items-center justify-center gap-2"
                disabled={isLoading}
                aria-label="Masuk ke akun"
              >
                {isLoading ? (
                  <div
                    className="flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg
                      className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-sm sm:text-base">Memproses...</span>
                  </div>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight size={18} className="ml-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6 pt-2">

        </CardFooter>
      </Card>

    </div>
  );
}
