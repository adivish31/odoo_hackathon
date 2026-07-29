"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
   Settings,
  LogOut,
} from "lucide-react";
import { clearAuth } from "@/lib/auth-token";

const menus = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vehicles", href: "/vehicles", icon: Truck },
  { name: "Drivers", href: "/drivers", icon: Users },
  { name: "Trips", href: "/trips", icon: Route },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Expenses", href: "/expenses", icon: Fuel },

  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  return (
   <aside
  className="
  hidden
  md:flex
  min-h-screen
  w-[232px]
  flex-col
  border-r border-hairline
  bg-panel
  text-ink
  "
>

      <div className="border-b border-hairline px-6 py-6 flex flex-col justify-center h-[56px]">
        <h1 className="text-[20px] font-bold text-amber font-heading">
          TransitOps
        </h1>

        <p className="text-[12px] text-ink-dim">
          Smart Transport Platform
        </p>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">

        {menus.map((menu) => {
          const Icon = menu.icon;

          const active = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 rounded-md px-3 py-[10px] transition-all text-[15px] ${
                active
                  ? "bg-transparent text-amber font-semibold border-l-[3px] border-amber pl-[9px]"
                  : "text-ink-dim hover:bg-panel-raised hover:text-ink border-l-[3px] border-transparent"
              }`}
            >
              <Icon size={16} strokeWidth={1.75} />
              {menu.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-hairline p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-[15px] text-ink-dim hover:bg-panel-raised hover:text-ink transition-all"
        >
          <LogOut size={16} strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </aside>
  );
}