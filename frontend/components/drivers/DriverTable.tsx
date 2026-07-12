"use client";

import { useEffect, useState } from "react";
import { Driver } from "@/types/driver";
import { getDrivers } from "@/services/driverService";


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
      <div className="bg-white border rounded-lg p-6">
        Loading drivers...
      </div>
    );

  }



  return(

    <div className="bg-white border rounded-lg overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="p-3 text-left">
              Driver
            </th>

            <th>
              License
            </th>

            <th>
              Category
            </th>

            <th>
              Score
            </th>

            <th>
              Status
            </th>

          </tr>

        </thead>



        <tbody>

        {
          drivers.map((driver)=>(

            <tr
              key={driver.id}
              className="border-t"
            >

              <td className="p-3 font-semibold">
                {driver.name}
              </td>


              <td>
                {driver.licenseNumber}
              </td>


              <td>
                {driver.licenseCategory}
              </td>


              <td>
                {driver.safetyScore}/100
              </td>


              <td>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">

                  {driver.status}

                </span>

              </td>


            </tr>

          ))
        }


        </tbody>


      </table>


    </div>

  );

}