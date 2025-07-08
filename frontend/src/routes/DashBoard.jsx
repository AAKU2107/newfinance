import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, PieChart, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

function Dashboard({ transactions }) {
  const [stats, setStats] = useState({
    total: 0,
    income: 0,
    expenses: 0,
    balance: 0,
    categories: {},
    recentTransactions: [],
    trend: { income: 0, expenses: 0 },
  });

  useEffect(() => {
    const calculateStats = () => {
      if (transactions.length === 0) {
        setStats((prev) => ({
          ...prev,
          total: 0,
          income: 0,
          expenses: 0,
          balance: 0,
          categories: {},
          recentTransactions: [],
          trend: { income: 0, expenses: 0 },
        }));
        return;
      }
      const total = transactions.length;
      const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
      const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
      const balance = income - expenses;
      const categories = transactions.reduce((acc, t) => {
        const category = t.category.toLowerCase();
        if (!acc[category]) acc[category] = 0;
        acc[category] += Number(t.amount);
        return acc;
      }, {});
      // Sort by date (assuming t.date is a valid date string or timestamp)
      const recentTransactions = transactions
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const thisMonthTransactions = transactions.filter(
        (t) => {
          const d = new Date(t.date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }
      );
      const lastMonthTransactions = transactions.filter(
        (t) => {
          const d = new Date(t.date);
          return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
        }
      );
      const trend = {
        income:
          ((thisMonthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) /
            (lastMonthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) || 1) - 1) * 100,
        expenses:
          ((thisMonthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) /
            (lastMonthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 1) - 1) * 100,
      };
      setStats({ total, income, expenses, balance, categories, recentTransactions, trend });
    };
    calculateStats();
  }, [transactions]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Financial Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-gray-500 font-semibold">Total Balance</span>
            <TrendingUp className="w-6 h-6 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{stats.balance.toLocaleString()}</div>
            <p className="text-gray-400">From {stats.total} transactions</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-gray-500 font-semibold">Income</span>
            {stats.trend.income > 0 ? (
              <TrendingUp className="w-6 h-6 text-green-500" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{stats.income.toLocaleString()}</div>
            <p className="text-gray-400">{stats.trend.income.toFixed(1)}% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-gray-500 font-semibold">Expenses</span>
            {stats.trend.expenses > 0 ? (
              <TrendingUp className="w-6 h-6 text-green-500" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{stats.expenses.toLocaleString()}</div>
            <p className="text-gray-400">{stats.trend.expenses.toFixed(1)}% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-gray-500 font-semibold">Top Category</span>
            <PieChart className="w-6 h-6 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize text-gray-700">
              {Object.entries(stats.categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <span className="text-lg font-semibold text-gray-700">Recent Transactions</span>
        </CardHeader>
        <CardContent>
          {stats.recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No recent transactions.</div>
          ) : (
            <div className="space-y-4">
              {stats.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div>
                    <p className="font-medium text-gray-700">{transaction.description}</p>
                    <p className="text-gray-400 text-xs">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <p className={`text-lg font-bold ${transaction.type === "expense" ? "text-red-500" : "text-green-500"}`}>
                    {transaction.type === "expense" ? "-" : "+"}₹{Number(transaction.amount).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;