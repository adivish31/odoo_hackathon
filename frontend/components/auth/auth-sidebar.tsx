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
    <aside className="relative hidden lg:flex w-[420px] flex-col justify-between overflow-hidden bg-panel border-r border-hairline px-10 py-12 text-ink">

      <div className="relative z-10">

        {/* Logo */}

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-[10px] bg-amber">

            <Truck className="h-7 w-7 text-[#1A1300]" strokeWidth={1.75} />

          </div>

          <div>

            <h1 className="text-4xl font-bold font-heading tracking-tight text-ink">
              TransitOps
            </h1>

            <p className="mt-1 text-sm text-ink-dim">
              Fleet, drivers, and dispatch on one board.
            </p>

          </div>

        </div>

        {/* Roles */}

        <div className="mt-20">

          <h2 className="mb-6 text-lg font-semibold text-ink">
            One Login. Four Roles.
          </h2>

          <div className="space-y-5">

            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <div
                  key={role.title}
                  className={`flex items-center gap-3 rounded-[6px] border px-4 py-3 transition

                  ${
                    role.active
                      ? "border-amber bg-amber/10"
                      : "border-hairline bg-panel-raised"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5

                    ${
                      role.active
                        ? "text-amber"
                        : "text-ink-dim"
                    }`}
                    strokeWidth={1.75}
                  />

                  <span
                    className={`font-medium

                    ${
                      role.active
                        ? "text-amber"
                        : "text-ink"
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

        <div className="mt-16 rounded-[10px] border border-hairline bg-panel-raised p-6">

          <h3 className="mb-5 text-lg font-semibold text-ink">
            Platform Features
          </h3>

          <div className="space-y-3">

            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3"
              >
                <div className="h-2 w-2 rounded-full bg-reflect" />

                <span className="text-sm text-ink-dim">
                  {feature}
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="relative z-10 border-t border-hairline pt-6">

        <p className="text-xs uppercase tracking-[0.25em] text-ink-dim">
          TransitOps © 2026
        </p>

        <p className="mt-2 text-sm text-ink-dim/60">
          Secure Logistics Management Platform
        </p>

      </div>
    </aside>
  );
}