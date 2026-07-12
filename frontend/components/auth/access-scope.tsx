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
    <div className="mt-8 border-t pt-6">

      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Access Scope
      </p>

      <div className="space-y-4">

        {scopes.map((item) => (
          <div
            key={item.role}
            className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
          >
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />

            <div>
              <h4 className="font-semibold text-slate-900">
                {item.role}
              </h4>

              <p className="text-sm text-slate-600">
                {item.access}
              </p>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}