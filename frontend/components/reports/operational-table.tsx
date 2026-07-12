import { OperationalTable } from "@/types/report";


interface Props {
  data: OperationalTable[];
}


export default function OperationalInsightsTable({ data }: Props) {


  return (

    <div className="bg-white border rounded-xl overflow-hidden">


      <div className="p-5 border-b">

        <h2 className="text-lg font-semibold">
          Operational Insights
        </h2>

      </div>



      <div className="overflow-x-auto">


        <table className="w-full text-left">


          <thead className="bg-slate-100">

            <tr>

              <th className="px-6 py-3 text-sm">
                Region
              </th>


              <th className="px-6 py-3 text-sm">
                Total Trips
              </th>


              <th className="px-6 py-3 text-sm">
                Avg. Fuel Cost
              </th>


              <th className="px-6 py-3 text-sm">
                Maintenance %
              </th>


              <th className="px-6 py-3 text-sm">
                Status
              </th>


            </tr>

          </thead>



          <tbody>


          {
            data.map((item)=>(

              <tr
                key={item.region}
                className="border-t hover:bg-slate-50"
              >


                <td className="px-6 py-4 font-medium">
                  {item.region}
                </td>


                <td className="px-6 py-4">
                  {item.trips}
                </td>


                <td className="px-6 py-4">
                  {item.fuelCost}
                </td>


                <td className="px-6 py-4">
                  {item.maintenance}
                </td>


                <td className="px-6 py-4">


                  <span
                    className={`
                    px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      item.status === "Optimal"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
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