import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

function Home({ transactions }) {
  const stats = transactions.reduce(
    (acc, item) => {
      const amount = Number(item.amount);
      if (item.type === "expense") {
        acc.expenses += amount;
      } else {
        acc.income += amount;
      }
      acc.total = acc.income - acc.expenses;
      return acc;
    },
    { total: 0, income: 0, expenses: 0 }
  );

  const recentTransactions = transactions
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome to Your Finance Tracker</h1>
          <p className="text-gray-500 text-lg">
            Take control of your finances with our easy-to-use tracking tools
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-none">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Balance</p>
                <p className={`text-2xl font-bold ${stats.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{stats.total.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 shadow-none">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Income</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.income.toLocaleString()}</p>
              </div>
              <ArrowUpCircle className="w-8 h-8 text-green-500" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 shadow-none">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">₹{stats.expenses.toLocaleString()}</p>
              </div>
              <ArrowDownCircle className="w-8 h-8 text-red-500" />
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link to="/transactions">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow">
              <PlusCircle className="w-5 h-5" />
              Add New Transaction
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-gray-800">Recent Transactions</h2>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-center text-gray-400 py-4">
              No transactions yet. Start by adding your first transaction!
            </p>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-4 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-gray-700">
                      {transaction.description}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(transaction.id).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-bold ${transaction.type === "expense" ? "text-red-500" : "text-green-500"}`}
                  >
                    {transaction.type === "expense" ? "-" : "+"}₹{Number(transaction.amount).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link to="/transactions" className="w-full">
            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
              View All Transactions
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Home;