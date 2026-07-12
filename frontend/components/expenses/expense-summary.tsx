"use client";

import { useEffect, useState } from "react";
import { IndianRupee } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getExpenses } from "@/services/expenseService";


export default function ExpenseSummary() {

  const [total, setTotal] = useState(0);
  const [month, setMonth] = useState("");


  useEffect(()=>{

    async function loadSummary(){

      try{

        const expenses = await getExpenses();


        const totalAmount = expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );


        setTotal(totalAmount);


        const currentMonth = new Date()
          .toLocaleString("en-US", {
            month:"long",
            year:"numeric",
          });


        setMonth(currentMonth);


      }
      catch(error){

        console.log(
          "Summary fetch error",
          error
        );

      }

    }


    loadSummary();

  },[]);



  return (

    <Card className="border-0 bg-slate-900 text-white shadow-xl">

      <CardContent className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between">


        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Aggregate Operational Cost
          </p>


          <h2 className="mt-3 text-3xl font-bold">
            Total Operational Cost
          </h2>


          <p className="mt-2 text-sm text-slate-400">
            Fuel + Maintenance + Toll + Miscellaneous Expenses
          </p>


        </div>



        <div className="text-right">


          <div className="mb-2 flex items-center justify-end gap-2">


            <IndianRupee className="h-7 w-7 text-yellow-400" />


            <span className="text-5xl font-bold tracking-tight text-yellow-400">

              {total.toLocaleString()}

            </span>


          </div>


          <p className="text-sm text-slate-300">

            {month}

          </p>


        </div>


      </CardContent>

    </Card>

  );
}