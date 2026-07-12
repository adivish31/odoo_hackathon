import {
  Truck,
  ShieldCheck,
  Route,
  BarChart3,
} from "lucide-react";

const roles = [
  {
    title: "Fleet Manager",
    icon: Truck,
  },
  {
    title: "Dispatcher",
    icon: Route,
  },
  {
    title: "Safety Officer",
    icon: ShieldCheck,
    active: true,
  },
  {
    title: "Financial Analyst",
    icon: BarChart3,
  },
];

const features = [
  "Fleet Monitoring",
  "Driver Management",
  "Trip Scheduling",
  "Maintenance Tracking",
  "Fuel & Expense Analytics",
  "Role-Based Access Control",
];

export default function AuthSidebar() {
  return (
    <aside className="relative hidden lg:flex w-[420px] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-10 py-12 text-white">

      {/* Background Blur */}

      <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="relative z-10">

        {/* Logo */}

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500">

            <Truck className="h-7 w-7 text-slate-900" />

          </div>

          <div>

            <h1 className="text-4xl font-bold tracking-tight">
              TransitOps
            </h1>

            <p className="mt-1 text-sm text-slate-300">
              Smart Transport Operations Platform
            </p>

          </div>

        </div>

        {/* Roles */}

        <div className="mt-20">

          <h2 className="mb-6 text-lg font-semibold">
            One Login. Four Roles.
          </h2>

          <div className="space-y-5">

            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <div
                  key={role.title}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition

                  ${
                    role.active
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5

                    ${
                      role.active
                        ? "text-yellow-400"
                        : "text-slate-300"
                    }`}
                  />

                  <span
                    className={`font-medium

                    ${
                      role.active
                        ? "text-yellow-300"
                        : "text-slate-200"
                    }`}
                  >
                    {role.title}
                  </span>
                </div>
              );
            })}

          </div>

        </div>

        {/* Features */}

        <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">

          <h3 className="mb-5 text-lg font-semibold">
            Platform Features
          </h3>

          <div className="space-y-3">

            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3"
              >
                <div className="h-2 w-2 rounded-full bg-yellow-400" />

                <span className="text-sm text-slate-300">
                  {feature}
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="relative z-10 border-t border-white/10 pt-6">

        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          TransitOps © 2026
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Secure Logistics Management Platform
        </p>

      </div>
    </aside>
  );
}