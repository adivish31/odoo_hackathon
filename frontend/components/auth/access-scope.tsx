const scopes = [
  {
    role: "Fleet Manager",
    access: "Fleet, Maintenance visibility",
  },
  {
    role: "Dispatcher",
    access: "Dashboard, Trips, Real-time Tracking",
  },
  {
    role: "Safety Officer",
    access: "Drivers, Compliance, Risks",
  },
  {
    role: "Financial Analyst",
    access: "Fuel, Expenses & Analytics",
  },
];

export default function AccessScope() {
  return (
    <div className="mt-8 border-t border-hairline pt-6">

      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-ink-dim">
        Access Scope
      </p>

      <div className="space-y-4">

        {scopes.map((item) => (
          <div
            key={item.role}
            className="flex items-start gap-3 rounded-lg border border-hairline bg-panel-raised p-3"
          >
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-reflect shrink-0" />

            <div>
              <h4 className="font-semibold text-ink">
                {item.role}
              </h4>

              <p className="text-sm text-ink-dim">
                {item.access}
              </p>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}