import { ServiceRecord } from "@/types/maintenance";

export default function ServiceTable({
  data,
  onClose,
}: {
  data: ServiceRecord[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="bg-panel rounded-[10px] border border-hairline overflow-hidden">
      <div className="p-5 border-b border-hairline">
        <h2 className="text-xl font-bold font-heading text-ink">Service Log</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-panel border-b border-hairline">
            <tr className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-dim">
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Cost</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-hairline text-[0.9375rem] text-ink">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-ink-dim">
                  No service records yet.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-panel-raised transition-colors h-[54px]">
                  <td className="px-6 py-3">
                    <p className="font-semibold text-ink">{item.vehicle}</p>
                    <p className="text-[0.8125rem] text-ink-dim mt-0.5">{item.model}</p>
                  </td>
                  <td className="px-6 py-3 font-medium">{item.service}</td>
                  <td className="px-6 py-3 text-ink-dim font-mono text-[0.875rem]">{item.date}</td>
                  <td className="px-6 py-3 tabular-nums font-mono font-medium text-ink">
                    ₹{item.cost.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`rounded-[4px] px-3 py-1 text-xs font-semibold ${
                        item.status === "IN SHOP"
                          ? "bg-caution/10 text-caution"
                          : "bg-go/10 text-go"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {item.status === "IN SHOP" && (
                      <button
                        onClick={() => onClose(item.id)}
                        className="rounded-[6px] border border-reflect px-3 py-1.5 text-sm font-medium text-reflect hover:bg-reflect hover:text-[#1A1300] transition-colors"
                      >
                        Close record
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
