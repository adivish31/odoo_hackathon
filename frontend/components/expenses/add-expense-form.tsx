"use client";

import { useState } from "react";
import { addExpense } from "@/services/expenseService";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";


export default function AddExpenseForm(){

  const [form,setForm] = useState({
    vehicleId:"",
    tripId:"",
    category:"",
    amount:"",
    date:"",
  });


  async function handleSubmit(){

    try{

      await addExpense({
        vehicleId: form.vehicleId,
        tripId: form.tripId || undefined,
        category: form.category,
        amount:Number(form.amount),
        date:form.date,
      });


      alert("Expense Added");


      setForm({
        vehicleId:"",
        tripId:"",
        category:"",
        amount:"",
        date:"",
      });


    }
    catch(error){

      console.log(error);
      alert("Failed to add expense");

    }

  }



  return(

    <Card>

      <CardHeader>

        <CardTitle>
          Add Expense
        </CardTitle>

      </CardHeader>


      <CardContent className="space-y-4">


        <input
          className="w-full border p-2 rounded"
          placeholder="Vehicle ID"
          value={form.vehicleId}
          onChange={(e)=>
            setForm({...form,vehicleId:e.target.value})
          }
        />


        <input
          className="w-full border p-2 rounded"
          placeholder="Trip ID (optional)"
          value={form.tripId}
          onChange={(e)=>
            setForm({...form,tripId:e.target.value})
          }
        />


        <input
          className="w-full border p-2 rounded"
          placeholder="Category"
          value={form.category}
          onChange={(e)=>
            setForm({...form,category:e.target.value})
          }
        />


        <input
          className="w-full border p-2 rounded"
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e)=>
            setForm({...form,amount:e.target.value})
          }
        />


        <input
          className="w-full border p-2 rounded"
          type="date"
          value={form.date}
          onChange={(e)=>
            setForm({...form,date:e.target.value})
          }
        />


        <Button onClick={handleSubmit}>
          Save Expense
        </Button>


      </CardContent>

    </Card>

  );

}