import ExpenseHeader from "@/components/expenses/expense-header";
import FuelLogTable from "@/components/expenses/fuel-log-table";
import ExpenseTable from "@/components/expenses/expense-table";
import ExpenseSummary from "@/components/expenses/expense-summary";
import PlaceholderCards from "@/components/expenses/placeholder-cards";
import AddExpenseForm from "@/components/expenses/add-expense-form";

export default function ExpensesPage() {
  return (
    <div className="space-y-6">

      <ExpenseHeader />

      <FuelLogTable />

      <ExpenseTable />
      <AddExpenseForm />

      <ExpenseSummary />

      <PlaceholderCards />

    </div>
  );
}