"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, UserCircle2, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

export default function TopNavbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className="
      flex
      h-16
      items-center
      justify-between
      border-b
      border-hairline
      bg-panel
      px-4
      md:px-6
      text-ink
      "
    >

      {/* Mobile Menu Button */}
      <button className="md:hidden text-ink-dim hover:text-ink">
        <Menu size={24} />
      </button>


      {/* Search */}
      <div
        className="
        w-full
        max-w-xs
        md:w-80
        ml-3
        "
      >
        <Input
          placeholder="Search..."
          className="bg-panel-raised border-hairline text-ink placeholder:text-ink-faint focus-visible:ring-amber"
        />
      </div>



      {/* Right Section */}

      <div className="flex items-center gap-3 md:gap-5">


        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-ink-dim hover:text-ink transition-colors"
          aria-label="Toggle Theme"
        >
          {mounted ? (
            theme === "dark" ? <Sun size={20} strokeWidth={1.75} /> : <Moon size={20} strokeWidth={1.75} />
          ) : (
            <div className="w-5 h-5" />
          )}
        </button>


        <Bell
          className="
          cursor-pointer
          text-ink-dim hover:text-ink transition-colors
          "
          size={20}
          strokeWidth={1.75}
        />



        <div className="flex items-center gap-2">


          <UserCircle2
            size={34}
            className="text-ink-dim"
            strokeWidth={1.5}
          />


          {/* Hide text on mobile */}

          <div className="hidden sm:block">

            <p className="text-sm font-semibold text-ink">
              Fleet Manager
            </p>

            <p className="text-xs text-ink-dim">
              Admin
            </p>

          </div>


        </div>


      </div>


    </header>
  );
}