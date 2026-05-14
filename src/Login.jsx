import { useState, useEffect } from "react";
import { auth } from "./firebase";
import "./App.css";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 💸 Currency animation
  useEffect(() => {
    const layer = document.querySelector(".currency-layer");
    const symbols = ["₹", "$", "€", "¥", "₿"];

    if (!layer) return;
    layer.innerHTML = "";

    for (let i = 0; i < 40; i++) {
      const span = document.createElement("span");

      span.innerText =
        symbols[Math.floor(Math.random() * symbols.length)];

      span.style.left = Math.random() * 100 + "%";
      span.style.animationDuration = 15 + Math.random() * 20 + "s";
      span.style.animationDelay = Math.random() * 10 + "s";

      layer.appendChild(span);
    }
  }, []);

  const login = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (err) {
      alert(err.message);
    }
  };

  const signup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg">
      <div className="currency-layer"></div>

      <div className="login-card">
        <h1>💸 Expense Tracker</h1>
        <p>Welcome back 👋</p>

        <input
          className="input"
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="btns">
          <button className="pro-btn" onClick={login}>
            Login
          </button>
          <button className="success-btn" onClick={signup}>
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}