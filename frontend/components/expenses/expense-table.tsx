"use client";

import { useState, useEffect } from "react";
import { ReceiptText, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddExpenseModal from "./add-expense-modal";
import { getExpenses, type Expense } from "@/services/expense.service";

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const loadData = async () => {
    try {
      setAccessDenied(false);
      const data = await getExpenses();
      setExpenses(data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAccessDenied(true);
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Other Expenses</CardTitle>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-slate-500">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {accessDenied ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 bg-red-50">
                      You do not have permission to view expenses.
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No expenses logged.
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b last:border-none hover:bg-slate-50"
                    >
                      <td className="py-4 text-sm text-slate-600">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="font-medium text-slate-900">
                        {expense.vehicle?.registrationNumber || "-"}
                      </td>
                      <td>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                          {expense.category}
                        </span>
                      </td>
                      <td className="text-right font-bold text-slate-900">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <AddExpenseModal
          onClose={() => setShowModal(false)}
          onSuccess={loadData}
        />
      )}
    </>
  );
}