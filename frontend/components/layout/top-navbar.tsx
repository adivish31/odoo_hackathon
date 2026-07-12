"use client";

import { Bell, Menu, UserCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TopNavbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">

      {/* Mobile Menu Button */}
      <button className="md:hidden">
        <Menu size={24} />
      </button>


      {/* Search */}
      <div className="w-full max-w-xs md:w-80 ml-3">
        <Input
          placeholder="Search..."
        />
      </div>



      {/* Right Section */}

      <div className="flex items-center gap-3 md:gap-5">


        <Bell
          className="cursor-pointer text-slate-600"
          size={20}
        />



        <div className="flex items-center gap-2">


          <UserCircle2
            size={34}
            className="text-slate-600"
          />


          {/* Hide text on mobile */}

          <div className="hidden sm:block">

            <p className="text-sm font-semibold">
              Fleet Manager
            </p>

            <p className="text-xs text-slate-500">
              Admin
            </p>

          </div>


        </div>


      </div>


    </header>
  );
}