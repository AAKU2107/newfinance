import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

function TransactionList({ transactions = [], deleteTransaction, editTransaction }) {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-800">Recent Transactions</h2>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No transactions yet. Add your first transaction above.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((item) => (
              <TransactionItem
                key={item?._id || Date.now()}
                item={{
                  id: item?._id || Date.now(),
                  amount: item?.amount || 0,
                  description: item?.description || "",
                  type: item?.type || "expense",
                  category: item?.category || "General",
                }}
                deleteTransaction={deleteTransaction}
                editTransaction={editTransaction}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TransactionItem({ item, deleteTransaction, editTransaction }) {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(item.amount || 0);
  const [description, setDescription] = useState(item.description || "");
  const [type, setType] = useState(item.type || "expense");
  const [category, setCategory] = useState(item.category || "General");

  const handleEdit = (e) => {
    e.preventDefault();
    editTransaction(item._id, {
      amount: parseFloat(amount) || 0,
      description,
      type,
      category,
    });
    setIsEditing(false);
  };

  const safeAmount = parseFloat(amount) || 0;
  const transactionDate = item._id ? new Date(item._id) : new Date();

  return (
    <Card className={`rounded-lg ${type === "expense" ? "border-red-200" : "border-green-200"} border shadow-sm"}>
      <CardContent className="p-6">
        {isEditing ? (
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="font-medium text-gray-600">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium text-gray-600">Description</label>
                <Input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium text-gray-600">Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-gray-600">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="General">General</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button type="submit" variant="default">
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
                variant="outline"
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <div className="flex gap-2 items-center">
                <span className={`font-semibold ${type === "expense" ? "text-red-500" : "text-green-500"}`}>
                  {type === "expense" ? "Expense" : "Income"}
                </span>
                <h3 className="font-bold text-gray-700">
                  {description || "No description"}
                </h3>
              </div>
              <div className="flex gap-4 items-center mt-1">
                <span className={`text-lg font-bold ${type === "expense" ? "text-red-500" : "text-green-500"}`}>
                  ₹{safeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-gray-400">
                  {transactionDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {" • "}
                  {transactionDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                <span className="text-xs text-gray-500">{category}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit2 className="w-4 h-4 mr-1" />
              </Button>
              <Button
                onClick={() => deleteTransaction(item._id)}
                variant="outline"
                className="hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TransactionList;