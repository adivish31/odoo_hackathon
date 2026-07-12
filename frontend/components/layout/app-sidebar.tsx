"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
   <aside
  className="
  hidden
  md:flex
  min-h-screen
  w-64
  flex-col
  border-r
  bg-slate-900
  text-white
  "
>

      <div className="border-b px-6 py-6">
        <h1 className="text-2xl font-bold text-yellow-400">
          TransitOps
        </h1>

        <p className="text-sm text-slate-400">
          Smart Transport Platform
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">

        {menus.map((menu) => {
          const Icon = menu.icon;

          const active = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                active
                  ? "bg-yellow-500 text-slate-900 font-semibold"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              {menu.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}