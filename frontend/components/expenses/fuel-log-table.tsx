"use client";

import { useEffect, useState } from "react";
import { Plus, Filter } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  getFuelLogs,
  FuelLog,
} from "@/services/fuelService";



export default function FuelLogTable() {


  const [fuelLogs,setFuelLogs] = useState<FuelLog[]>([]);



  useEffect(()=>{


    async function loadFuelLogs(){

      try{

        const data = await getFuelLogs();

        setFuelLogs(data);

      }
      catch(error){

        console.log(
          "Fuel logs fetch error",
          error
        );

      }

    }


    loadFuelLogs();


  },[]);




  return (

    <Card>


      <CardHeader className="flex flex-row items-center justify-between">


        <CardTitle>
          Fuel Logs
        </CardTitle>



        <div className="flex gap-2">


          <Button>

            <Plus className="mr-2 h-4 w-4" />

            Log Fuel

          </Button>



          <Button variant="outline">

            <Filter className="mr-2 h-4 w-4" />

            Filter

          </Button>


        </div>


      </CardHeader>





      <CardContent>


        <div className="overflow-x-auto">


          <table className="w-full">


            <thead>


              <tr className="border-b text-left text-sm text-slate-500">


                <th className="pb-3">
                  Vehicle
                </th>


                <th className="pb-3">
                  Date
                </th>


                <th className="pb-3">
                  Liters
                </th>


                <th className="pb-3 text-right">
                  Amount
                </th>


                <th className="pb-3">
                  Trip ID
                </th>


              </tr>


            </thead>





            <tbody>


              {fuelLogs.map((log)=>(


                <tr
                  key={log.id}
                  className="border-b last:border-none hover:bg-slate-50"
                >


                  <td className="py-4 font-medium">

                    {log.vehicle?.registrationNumber || "-"}

                  </td>



                  <td>

                    {new Date(log.date)
                    .toLocaleDateString()}

                  </td>



                  <td>

                   {log.liters ?? 0} L
                  </td>



                  <td className="text-right font-semibold">

                    ₹{(log.amount ?? 0).toLocaleString()}

                  </td>



                  <td>

                    {log.tripId || "-"}

                  </td>



                </tr>


              ))}





              {fuelLogs.length === 0 && (

                <tr>

                  <td
                    colSpan={5}
                    className="py-6 text-center text-slate-500"
                  >

                    No fuel logs found

                  </td>

                </tr>

              )}



            </tbody>



          </table>



        </div>



      </CardContent>


    </Card>

  );
}