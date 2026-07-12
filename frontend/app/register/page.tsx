import AuthSidebar from "@/components/auth/auth-sidebar";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">

      <AuthSidebar />

      <main className="flex-1 flex items-center justify-center bg-slate-50 p-8">
        <RegisterForm />
      </main>

    </div>
  );
}