import {
  Fuel,
  BarChart3,
  Wallet,
  TrendingUp
} from "lucide-react";

import { KPI } from "@/types/report";


interface Props{
  data:KPI;
}


const iconMap:any={

 "Fuel Efficiency":Fuel,

 "Fleet Utilization":BarChart3,

 "Operational Cost":Wallet,

 "Vehicle ROI":TrendingUp

};


export default function KpiCard({data}:Props){


 const Icon=iconMap[data.title];


 return(

  <div className="bg-white rounded-xl border p-5">


    <div className="flex justify-between">

      <p className="text-sm text-slate-500">
        {data.title}
      </p>


      <Icon
        size={22}
        className="text-blue-600"
      />

    </div>



    <h2 className="text-3xl font-bold mt-5">

      {data.value}

      <span className="text-lg text-slate-400">
        {data.unit}
      </span>

    </h2>


    <p className="text-green-600 text-sm mt-2">
      {data.trend}
    </p>


  </div>

 )

}