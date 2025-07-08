import React from 'react';
import TransactionForm from '@/components/TransactionForm';
import TransactionsList from '@/components/TransactionsList';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

function Transactions({
  transactions,
  addTransaction,
  deleteTransaction,
  editTransaction,
}) {
  const balance = transactions.reduce((acc, item) => {
    return item.type === "expense"
      ? acc - Number(item.amount)
      : acc + Number(item.amount);
  }, 0);
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <Card className="shadow-lg rounded-xl mb-6">
        <CardHeader className="text-xl font-semibold text-gray-700">Current Balance</CardHeader>
        <CardContent>
          <span className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{balance}</span>
        </CardContent>
      </Card>
      <TransactionForm addTransaction={addTransaction} />
      <TransactionsList
        transactions={transactions}
        deleteTransaction={deleteTransaction}
        editTransaction={editTransaction}
      />
    </div>
  );
}

export default Transactions;