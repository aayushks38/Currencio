import { useEffect, useMemo, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Login from "./Login";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#e11d48", "#a855f7", "#14b8a6"];

const CATEGORY_OPTIONS = [
  { value: "Food", label: "Food 🍔" },
  { value: "Shopping", label: "Shopping 🛍" },
  { value: "Transport", label: "Transport 🚗" },
  { value: "Bills", label: "Bills 💡" },
  { value: "Recharge", label: "Recharge 📱" },
  { value: "Entertainment", label: "Entertainment 🎮" },
  { value: "Travel", label: "Travel ✈️" },
  { value: "Health", label: "Health 🏥" },
  { value: "Education", label: "Education 📚" },
  { value: "Other", label: "Other" },
];

const CURRENCY_SYMBOLS = ["₹", "$", "€", "£", "¥", "₩", "₦", "₽", "₫", "₱"];

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [darkMode, setDarkMode] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [budget, setBudget] = useState("");

  const askAI = async () => {
  setLoadingAI(true);

  try {
    const res = await fetch("http://localhost:5000/ask-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expenses: filteredExpenses,
        budget,
        question,
      }),
    });

    const data = await res.json();
    setAiResponse(data.answer);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingAI(false);
  }
};

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") setDarkMode(false);
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });

    return () => unsub();
  }, []);

  const fetchExpenses = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "expenses"),
      where("user", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setExpenses(data);
  };

  useEffect(() => {
    if (user) fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addExpense = async () => {
    if (!amount || !category || !date) {
      alert("Please fill amount, category, and date.");
      return;
    }

    if (!auth.currentUser) {
      alert("Please log in again.");
      return;
    }

    const newExpense = {
      amount: Number(amount),
      category,
      date,
      user: auth.currentUser.uid,
    };

    const docRef = await addDoc(collection(db, "expenses"), newExpense);
    setExpenses((prev) => [...prev, { id: docRef.id, ...newExpense }]);

    setAmount("");
    setCategory("");
    setDate("");
    setCategoryOpen(false);
  };

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };
      const startEdit = (expense) => {
      setEditingId(expense.id);
      setAmount(expense.amount);
      setCategory(expense.category);
      setDate(expense.date);
    };

    const updateExpense = async () => {
      const expenseRef = doc(db, "expenses", editingId);

      await updateDoc(expenseRef, {
        amount: Number(amount),
        category,
        date,
      });

      setExpenses((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? {
                ...e,
                amount: Number(amount),
                category,
                date,
              }
            : e
        )
      );

      setEditingId(null);
      setAmount("");
      setCategory("");
      setDate("");
    };
  const exportCSV = () => {
  const headers = ["Amount", "Category", "Date"];

  const rows = filteredExpenses.map((e) => [
    e.amount,
    e.category,
    e.date,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = `currencio-${selectedMonth}.csv`;

  link.click();
};

  const filteredExpenses = useMemo(() => {
    return expenses.filter(
      (e) => String(e.date || "").slice(0, 7) === selectedMonth
    );
  }, [expenses, selectedMonth]);

  const total = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [filteredExpenses]);
  const remainingBudget = Number(budget || 0) - total;

  const budgetUsedPercent =
  Number(budget) > 0
    ? Math.min((total / Number(budget)) * 100, 100)
    : 0;

  const insight = useMemo(() => {
    if (filteredExpenses.length === 0) return "Start tracking to unlock insights 🚀";

    const map = {};
    filteredExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount || 0);
    });

    const topCategory = Object.keys(map).reduce((a, b) =>
      map[a] > map[b] ? a : b
    );

    return `You spend most on ${topCategory} 💸`;
  }, [filteredExpenses]);

  const categoryData = useMemo(() => {
    const categoryMap = {};
    filteredExpenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount || 0);
    });

    return Object.keys(categoryMap).map((name) => ({
      name,
      value: categoryMap[name],
    }));
  }, [filteredExpenses]);

  const trendData = useMemo(() => {
    const monthMap = {};
    expenses.forEach((e) => {
      const d = String(e.date || "");
      if (!d) return;
      const month = d.slice(0, 7);
      monthMap[month] = (monthMap[month] || 0) + Number(e.amount || 0);
    });

    return Object.keys(monthMap)
      .sort()
      .map((month) => ({
        month,
        amount: monthMap[month],
      }));
  }, [expenses]);

  const selectedCategoryLabel =
    CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label ||
    "Select Category";

  const handleLogout = async () => {
    await signOut(auth);
    setExpenses([]);
  };

  if (!authReady) {
    return (
      <div className={`app-shell theme-dark`}>
        <div className="loading-screen">
          <div className="loading-card">
            <div className="spinner" />
            <h2>Loading your dashboard...</h2>
            <p>Securing your expense data</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <Login setUser={setUser} />;

  return (
    <div className={`app-shell ${darkMode ? "theme-dark" : "theme-light"}`}>
      <div className="currency-background" aria-hidden="true">
        {Array.from({ length: 28 }).map((_, i) => {
          const symbol = CURRENCY_SYMBOLS[i % CURRENCY_SYMBOLS.length];
          const left = (i * 7) % 100;
          const size = 18 + (i % 4) * 8;
          const duration = 12 + (i % 7) * 2;
          const delay = i * 0.8;

          return (
            <span
              key={i}
              className="currency-float"
              style={{
                left: `${left}%`,
                fontSize: `${size}px`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
              }}
            >
              {symbol}
            </span>
          );
        })}
      </div>

      <div className="dashboard-container">
        <div className="top-bar">
          <div className="brand">
              <span className="brand-tag">PERSONAL FINANCE</span>
              <h1 className="brand-title">CURRENCIO</h1>
              <p className="brand-subtitle">
              Track. Analyze. Grow.
              </p>
          </div>

          <div className="action-group">
            <button
              className="pro-btn"
              onClick={() => setDarkMode((prev) => !prev)}
              type="button"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              className="pro-btn"
              onClick={exportCSV}
              type="button"
            >
              Export CSV
            </button>

            <button className="danger-btn" onClick={handleLogout} type="button">
              Logout
            </button>
          </div>
        </div>
        <div className="budget-card">
          <div className="budget-top">
            <span className="budget-label">MONTHLY BUDGET</span>

            <div className="budget-remaining">
              Remaining ₹{Math.max(remainingBudget, 0).toLocaleString()}
            </div>
          </div>

          <input
            type="number"
            className="budget-input"
            placeholder="Enter monthly budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <div className="form form-panel">
            <input
            className="input"
            type="number"
            min="0"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="dropdown-wrap">
            <button
              type="button"
              className="input dropdown-button"
              onClick={() => setCategoryOpen((prev) => !prev)}
            >
              <span>{selectedCategoryLabel}</span>
              <span className={`chevron ${categoryOpen ? "open" : ""}`}>▾</span>
            </button>

            {categoryOpen && (
              <div className="dropdown-menu">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`dropdown-option ${
                      category === opt.value ? "active" : ""
                    }`}
                    onClick={() => {
                      setCategory(opt.value);
                      setCategoryOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            className="pro-btn add-btn"
            onClick={editingId ? updateExpense : addExpense}
            type="button"
          >
            {editingId ? "Update" : "+ Add"}
          </button>
        </div>

        <section className="hero-section">
        <div>
          <span className="hero-label">
            TOTAL SPEND THIS MONTH
          </span>

          <h2 className="total-title">
            ₹{total.toLocaleString()}
          </h2>
        </div>

      </section>
            <div className="stats-grid">
            <div className="stat-card">
              <span>Total Expenses</span>
              <h3>₹{total}</h3>
            </div>

            <div className="stat-card">
              <span>Transactions</span>
              <h3>{filteredExpenses.length}</h3>
            </div>

            <div className="stat-card">
              <span>Top Category</span>
              <h3>
                {categoryData.length
                  ? categoryData.reduce((a, b) =>
                      a.value > b.value ? a : b
                    ).name
                  : "-"}
              </h3>
            </div>

            <div className="stat-card">
              <span>Average Spend</span>
              <h3>
                ₹
                {filteredExpenses.length
                  ? Math.round(total / filteredExpenses.length)
                  : 0}
              </h3>
            </div>
          </div>


        <div className="month-row">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input month-input"
             />
        </div>

        <div className="insight-box">{insight}</div>

        <section className="content-section">
          <h2 className="section-title">Expenses</h2>

          {filteredExpenses.length === 0 ? (
            <div className="empty-state">
              <p>📭 No expenses yet for this month</p>
              <span>Add your first expense to begin</span>
            </div>
          ) : (
            <div className="expense-list">
              {filteredExpenses.map((e) => (
                <div key={e.id} className="expense-card">
                  <div className="expense-main">
                    <span className="expense-amount">₹{e.amount}</span>
                    <span className="expense-category">{e.category}</span>
                    <span className="expense-date">{e.date}</span>
                  </div>

                  <div className="expense-actions">
                      <button
                        className="pro-btn small"
                        onClick={() => startEdit(e)}
                        type="button"
                      >
                        Edit
                      </button>

                      <button
                        className="danger-btn small"
                        onClick={() => deleteExpense(e.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="charts-grid">
          <div className="chart-card">
            <h3>Spending Breakdown</h3>
            {categoryData.length === 0 ? (
              <div className="chart-empty">No category data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-card">
            <h3>Expense Trend</h3>
            {trendData.length === 0 ? (
              <div className="chart-empty">No trend data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>
      <section className="ai-card">
          <h2>🤖 Currencio AI</h2>

          <input
            className="input"
            type="text"
            placeholder="Ask about your budget..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            className="pro-btn"
            onClick={askAI}
            disabled={loadingAI}
          >
            {loadingAI ? "🤖 Thinking..." : "Ask AI"}
          </button>
          {loadingAI && <p>Thinking...</p>}

          {aiResponse && (
            <div className="ai-response">
              {aiResponse}
            </div>
          )}
        </section>
    </div>
  );
}