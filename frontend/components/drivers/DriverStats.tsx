"use client";

import { useEffect, useState } from "react";
import { getDrivers } from "@/services/driverService";
import { Driver } from "@/types/driver";


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
      icon:"👥"
    },
    {
      title:"On Duty",
      value:onDuty,
      icon:"✅"
    },
    {
      title:"Expired Licenses",
      value:expiredLicenses,
      icon:"⚠️"
    },
    {
      title:"Avg Safety Score",
      value:`${avgSafetyScore}/100`,
      icon:"🛡️"
    }
  ];



  return(

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

      {
        stats.map((item)=>(

          <div
            key={item.title}
            className="bg-white border rounded-lg p-5 flex gap-4 items-center"
          >

            <div className="text-3xl">
              {item.icon}
            </div>


            <div>

              <p className="text-sm text-slate-500">
                {item.title}
              </p>


              <h2 className="text-xl font-bold">
                {item.value}
              </h2>

            </div>


          </div>

        ))
      }


    </div>

  );

}