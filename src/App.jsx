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

export default function App() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") setDarkMode(false);
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
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

    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    fetchExpenses();
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => String(e.date || "").slice(0, 7) === selectedMonth);
  }, [expenses, selectedMonth]);

  const total = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [filteredExpenses]);

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
    CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label || "Select Category";

  if (!user) return <Login setUser={setUser} />;

  return (
    <div className={`app-shell ${darkMode ? "theme-dark" : "theme-light"}`}>
      <div className="dashboard-container">
        <div className="top-bar">
          <h1>💰 Expense Dashboard</h1>

          <div className="action-group">
            <button
              className="pro-btn"
              onClick={() => setDarkMode((prev) => !prev)}
              type="button"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            <button
              className="danger-btn"
              onClick={() => signOut(auth)}
              type="button"
            >
              Logout
            </button>
          </div>
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

          <button className="pro-btn add-btn" onClick={addExpense} type="button">
            + Add
          </button>
        </div>

        <h2 className="total-title">Monthly Total: ₹{total}</h2>

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

                  <button
                    className="danger-btn small"
                    onClick={() => deleteExpense(e.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="charts-grid">
          <div className="chart-card">
            <h3>Category</h3>
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
            <h3>Monthly Trend</h3>
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
    </div>
  );
}