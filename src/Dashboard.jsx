import { useState, useEffect } from "react";
import "./App.css";

export default function Dashboard({ setUser }) {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("expenses"));
    if (saved) setExpenses(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!amount || !category) return;

    const newExpense = {
      id: Date.now(),
      amount: Number(amount),
      category,
    };

    setExpenses([...expenses, newExpense]);
    setAmount("");
    setCategory("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const getInsight = () => {
    if (expenses.length === 0) return "Start tracking to unlock insights 🚀";

    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });

    const max = Object.keys(map).reduce((a, b) =>
      map[a] > map[b] ? a : b
    );

    return `You spend most on ${max} 💸`;
  };

  return (
    <div className="bg">
      <div className="dashboard-container">

        {/* HEADER */}
        <div className="top-bar">
          <h1>💰 Expense Dashboard</h1>
          <button onClick={() => setUser(null)}>Logout</button>
        </div>

        {/* QUICK ADD */}
        <div className="quick-add">
          <button onClick={() => { setCategory("Food"); setAmount(200); }}>🍔 Food</button>
          <button onClick={() => { setCategory("Shopping"); setAmount(500); }}>🛍 Shopping</button>
          <button onClick={() => { setCategory("Fun"); setAmount(300); }}>🎮 Fun</button>
        </div>

        {/* INPUT FORM */}
        <div className="form">
          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button onClick={addExpense}>Add</button>
        </div>

        {/* TOTAL */}
        <h2>Monthly Total: ₹{total}</h2>

        {/* INSIGHTS */}
        <div className="insights">
          🧠 {getInsight()}
        </div>

        {/* EXPENSE LIST */}
        <h3>Expenses</h3>

        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>📭 No expenses yet</p>
            <span>Add your first expense to begin</span>
          </div>
        ) : (
          expenses.map((e) => (
            <div key={e.id} className="expense-item">
              ₹{e.amount} - {e.category}
              <button onClick={() => deleteExpense(e.id)}>Delete</button>
            </div>
          ))
        )}

      </div>
    </div>
  );
}