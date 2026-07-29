"use client";

import { useEffect, useState } from "react";
import { Driver } from "@/types/driver";
import { getDrivers } from "@/services/driverService";
import { StatusBadge } from "@/components/ui/status-badge";

export default function DriverTable(){

  const [drivers,setDrivers] = useState<Driver[]>([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    async function fetchDrivers(){
      try{
        const data = await getDrivers();
        setDrivers(data);
      }
      catch(err){
        console.log(err);
      }
      finally{
        setLoading(false);
      }
    }
    fetchDrivers();
  },[]);

  if(loading){
    return (
      <div className="bg-panel border border-hairline rounded-[10px] p-6 text-ink-dim">
        Loading drivers...
      </div>
    );
  }

  return(
    <div className="bg-panel border border-hairline rounded-[10px] overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-panel border-b border-hairline text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-dim">
            <tr>
              <th className="px-6 py-4">
                Driver
              </th>
              <th className="px-6 py-4">
                License
              </th>
              <th className="px-6 py-4">
                Category
              </th>
              <th className="px-6 py-4 text-right">
                Score
              </th>
              <th className="px-6 py-4 text-right">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-hairline text-[0.9375rem] text-ink">
          {
            drivers.map((driver)=>(
              <tr
                key={driver.id}
                className="hover:bg-panel-raised transition-colors h-[44px]"
              >
                <td className="px-6 py-2 font-medium">
                  {driver.name}
                </td>
                <td className="px-6 py-2 font-mono text-[0.875rem] text-ink-dim">
                  {driver.licenseNumber}
                </td>
                <td className="px-6 py-2 capitalize">
                  {driver.licenseCategory}
                </td>
                <td className="px-6 py-2 tabular-nums text-right font-mono font-medium">
                  {driver.safetyScore}/100
                </td>
                <td className="px-6 py-2 text-right">
                  <StatusBadge status={driver.status} />
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </div>
  );
}