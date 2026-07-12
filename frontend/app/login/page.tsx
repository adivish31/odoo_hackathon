import AuthSidebar from "@/components/auth/auth-sidebar";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <AuthSidebar />

      <main className="flex-1 flex items-center justify-center bg-slate-50 p-8">
        <LoginForm />
      </main>
    </div>
  );
}