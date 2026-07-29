import {
  Fuel,
  BarChart3,
  Wallet,
  TrendingUp
} from "lucide-react";

import type { ElementType } from "react";
import { KPI } from "@/types/report";


interface Props{
  data:KPI;
}


const iconMap: Record<string, ElementType> = {

 "Fuel Efficiency":Fuel,

 "Fleet Utilization":BarChart3,

 "Operational Cost":Wallet,

 "Vehicle ROI":TrendingUp

};


export default function KpiCard({data}:Props){


 const Icon=iconMap[data.title];


 return(

  <div className="bg-panel rounded-[10px] border border-hairline p-5">


    <div className="flex justify-between">

      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-dim">
        {data.title}
      </p>


      <Icon
        size={22}
        className="text-reflect"
        strokeWidth={1.75}
      />

    </div>



    <h2 className="text-3xl font-bold mt-5 font-heading text-ink">

      {data.value}

      <span className="text-lg text-ink-dim ml-1">
        {data.unit}
      </span>

    </h2>


    <p className="text-go text-sm mt-2 font-medium">
      {data.trend}
    </p>


  </div>

 )

}