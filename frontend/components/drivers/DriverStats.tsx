"use client";

import { useEffect, useState } from "react";
import { getDrivers } from "@/services/driverService";
import { Driver } from "@/types/driver";
import { Users, CheckCircle, AlertTriangle, Shield } from "lucide-react";


export default function DriverStats(){

  const [drivers,setDrivers] = useState<Driver[]>([]);


  useEffect(()=>{

    getDrivers()
      .then(setDrivers)
      .catch((err)=>console.log(err));

  },[]);



  const totalDrivers = drivers.length;


  const onDuty = drivers.filter(
    (driver)=>
      driver.status === "AVAILABLE" ||
      driver.status === "ON_TRIP"
  ).length;


  const expiredLicenses = drivers.filter(
    (driver)=>
      new Date(driver.licenseExpiryDate) < new Date()
  ).length;



  const avgSafetyScore =
    totalDrivers > 0
      ? Math.round(
          drivers.reduce(
            (sum,driver)=>
              sum + driver.safetyScore,
            0
          ) / totalDrivers
        )
      : 0;



  const stats=[
    {
      title:"Total Drivers",
      value:totalDrivers,
      icon: Users
    },
    {
      title:"On Duty",
      value:onDuty,
      icon: CheckCircle
    },
    {
      title:"Expired Licenses",
      value:expiredLicenses,
      icon: AlertTriangle
    },
    {
      title:"Avg Safety Score",
      value:`${avgSafetyScore}/100`,
      icon: Shield
    }
  ];



  return(

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

      {
        stats.map((item)=>{
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-panel border border-hairline rounded-[10px] p-5 flex gap-4 items-center"
            >
              <div className="text-ink-dim flex items-center justify-center">
                <Icon size={24} strokeWidth={1.75} />
              </div>

              <div>
                <p className="text-[0.75rem] leading-[1.2] font-semibold uppercase tracking-[0.08em] text-ink-dim mb-1">
                  {item.title}
                </p>

                <h2 className="text-[2.5rem] leading-none font-bold font-heading">
                  {item.value}
                </h2>
              </div>
            </div>
          )
        })
      }

    </div>

  );

}