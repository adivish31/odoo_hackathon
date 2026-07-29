import AppSidebar from "@/components/layout/app-sidebar";
import TopNavbar from "@/components/layout/top-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">

      <AppSidebar />

      <div className="flex flex-1 flex-col min-w-0">

        <TopNavbar />

        <main
          className="
          flex-1
          overflow-auto
          bg-bitumen
          p-4
          md:p-6
          "
        >
          {children}
        </main>

      </div>

    </div>
  );
}