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

    <div className="bg-white border rounded-xl p-6">


      <h2 className="text-lg font-semibold mb-6">
        Monthly Revenue
      </h2>



      <div className="h-[300px]">


        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>


            <XAxis
              dataKey="month"
            />


            <YAxis />


            <Tooltip />


            <Legend />



            <Bar
              dataKey="planned"
              name="Planned"
              fill="#94a3b8"
              radius={[6,6,0,0]}
            />


            <Bar
              dataKey="actual"
              name="Actual"
              fill="#2563eb"
              radius={[6,6,0,0]}
            />


          </BarChart>

        </ResponsiveContainer>


      </div>


    </div>

  );
}