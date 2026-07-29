import { OperationalTable } from "@/types/report";


interface Props {
  data: OperationalTable[];
}


export default function OperationalInsightsTable({ data }: Props) {


  return (

    <div className="bg-panel border border-hairline rounded-[10px] overflow-hidden">


      <div className="p-5 border-b border-hairline">

        <h2 className="text-lg font-bold font-heading text-ink">
          Operational Insights
        </h2>

      </div>



      <div className="overflow-x-auto">


        <table className="w-full text-left">


          <thead className="bg-panel border-b border-hairline">

            <tr className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-dim">

              <th className="px-6 py-3">
                Region
              </th>


              <th className="px-6 py-3">
                Total Trips
              </th>


              <th className="px-6 py-3">
                Avg. Fuel Cost
              </th>


              <th className="px-6 py-3">
                Maintenance %
              </th>


              <th className="px-6 py-3">
                Status
              </th>


            </tr>

          </thead>



          <tbody className="text-[0.9375rem] text-ink divide-y divide-hairline">


          {
            data.map((item)=>(

              <tr
                key={item.region}
                className="hover:bg-panel-raised transition-colors h-[44px]"
              >


                <td className="px-6 py-2 font-medium">
                  {item.region}
                </td>


                <td className="px-6 py-2 tabular-nums font-mono">
                  {item.trips}
                </td>


                <td className="px-6 py-2 tabular-nums font-mono">
                  {item.fuelCost}
                </td>


                <td className="px-6 py-2 tabular-nums font-mono">
                  {item.maintenance}
                </td>


                <td className="px-6 py-2">


                  <span
                    className={`
                    px-3 py-1 rounded-[4px] text-xs font-semibold
                    ${
                      item.status === "Optimal"
                      ? "bg-go/10 text-go"
                      : "bg-caution/10 text-caution"
                    }
                    `}
                  >

                    {item.status}

                  </span>


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