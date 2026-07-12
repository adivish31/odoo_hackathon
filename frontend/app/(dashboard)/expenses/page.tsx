import ExpenseHeader from "@/components/expenses/expense-header";
import FuelLogTable from "@/components/expenses/fuel-log-table";
import ExpenseTable from "@/components/expenses/expense-table";
import ExpenseSummary from "@/components/expenses/expense-summary";
import PlaceholderCards from "@/components/expenses/placeholder-cards";

export default function ExpensesPage() {
  return (
    <div className="space-y-6">

      <ExpenseHeader />

      <FuelLogTable />

      <ExpenseTable />

      <ExpenseSummary />

      <PlaceholderCards />

    </div>
  );
}