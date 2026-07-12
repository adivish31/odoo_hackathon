"use client";

import { useEffect, useState } from "react";
import { ReceiptText } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  getExpenses,
  Expense,
} from "@/services/expenseService";


export default function ExpenseTable() {

  const [expenses,setExpenses] = useState<Expense[]>([]);


  useEffect(()=>{

    async function loadExpenses(){

      try{

        const data = await getExpenses();

        setExpenses(data);

      }
      catch(error){

        console.log("Expense fetch error",error);

      }

    }


    loadExpenses();

  },[]);



  return (

    <Card>

      <CardHeader className="flex flex-row items-center justify-between">

        <CardTitle>
          Other Expenses (Toll / Misc)
        </CardTitle>


        <Button>

          <ReceiptText className="mr-2 h-4 w-4" />

          Add Expense

        </Button>


      </CardHeader>


      <CardContent>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b text-left text-sm text-slate-500">

                <th className="pb-3">Trip ID</th>

                <th className="pb-3">Vehicle</th>

                <th className="pb-3">Category</th>

                <th className="pb-3 text-right">Amount</th>

                <th className="pb-3">Date</th>

              </tr>

            </thead>



            <tbody>


            {expenses.map((expense)=>(

              <tr
                key={expense.id}
                className="border-b last:border-none hover:bg-slate-50"
              >

                <td className="py-4 font-semibold">

                  {expense.tripId || "-"}

                </td>


                <td>

                  {expense.vehicle?.registrationNumber}

                </td>


                <td>

                  {expense.category}

                </td>


                <td className="text-right font-bold">

                  ₹{expense.amount.toLocaleString()}

                </td>


                <td>

                  {new Date(expense.date)
                  .toLocaleDateString()}

                </td>


              </tr>


            ))}


            </tbody>


          </table>


        </div>


      </CardContent>


    </Card>

  );

}