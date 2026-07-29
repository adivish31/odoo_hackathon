"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { Revenue } from "@/types/report";


interface Props {
  data: Revenue[];
}


export default function RevenueChart({ data }: Props) {


  return (

    <div className="bg-panel border border-hairline rounded-[10px] p-6">


      <h2 className="text-lg font-bold font-heading text-ink mb-6">
        Monthly Revenue
      </h2>



      <div className="h-[300px]">


        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>


            <XAxis
              dataKey="month"
              tick={{ fill: "var(--ink-dim)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />


            <YAxis 
              tick={{ fill: "var(--ink-dim)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />


            <Tooltip 
               cursor={{ fill: "var(--panel-raised)" }}
               contentStyle={{ backgroundColor: "var(--panel)", borderColor: "var(--hairline)", color: "var(--ink)", borderRadius: "6px" }}
            />


            <Legend wrapperStyle={{ color: "var(--ink)" }} />



            <Bar
              dataKey="planned"
              name="Planned"
              fill="var(--ink-faint, #4B5563)"
              radius={[4,4,0,0]}
            />


            <Bar
              dataKey="actual"
              name="Actual"
              fill="var(--reflect)"
              radius={[4,4,0,0]}
            />


          </BarChart>

        </ResponsiveContainer>


      </div>


    </div>

  );
}