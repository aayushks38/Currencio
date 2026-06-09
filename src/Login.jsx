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

  // Floating background currencies
  useEffect(() => {
    const layer = document.querySelector(".currency-layer");
    const symbols = ["₹", "$", "€", "¥", "₿"];

    if (!layer) return;

    layer.innerHTML = "";

    for (let i = 0; i < 20; i++) {
      const span = document.createElement("span");

      span.innerText =
        symbols[Math.floor(Math.random() * symbols.length)];

      span.style.left = Math.random() * 100 + "%";
      span.style.animationDuration =
        15 + Math.random() * 20 + "s";
      span.style.animationDelay =
        Math.random() * 10 + "s";

      layer.appendChild(span);
    }
  }, []);

  useEffect(() => {
  const symbols = ["₹", "$", "€", "¥", "₿"];

  let lastSpawn = 0;

  const trail = (e) => {
    const now = Date.now();

    if (now - lastSpawn < 150) return;

    lastSpawn = now;

    const particle = document.createElement("div");

    particle.className = "money-particle";

    particle.innerText =
      symbols[Math.floor(Math.random() * symbols.length)];

    particle.style.left = `${e.clientX}px`;
    particle.style.top = `${e.clientY}px`;

    particle.style.setProperty(
      "--x",
      `${(Math.random() - 0.5) * 60}px`
    );

    particle.style.setProperty(
      "--y",
      `${-20 - Math.random() * 40}px`
    );

    particle.style.fontSize =
      `${14 + Math.random() * 8}px`;

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 600);
  };

  window.addEventListener("mousemove", trail);

  return () => {
    window.removeEventListener("mousemove", trail);
  };
}, []);

  const login = async () => {
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(res.user);
    } catch (err) {
      alert(err.message);
    }
  };

  const signup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(res.user);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
  <div className="login-layout">
    <div className="hero-panel">
      <div className="currency-layer"></div>

      <video
        autoPlay
        muted
        loop
        playsInline
        className="hero-video"
      >
        <source src="/finance.mp4" type="video/mp4" />
      </video>

      <div className="hero-overlay">
        <span className="hero-badge">
          AI POWERED PERSONAL FINANCE
        </span>

        <h1 className="hero-heading">
          Your No.1 Financial
          Companion
        </h1>

        <p className="hero-copy">
          Track expenses. Manage budgets.
          Understand spending habits.
          Build a stronger financial future.
        </p>

        <div className="hero-tags">
          <span>Budget Tracking</span>
          <span>Expense Analytics</span>
          <span>Currencio AI</span>
        </div>
      </div>
    </div>

    <div className="auth-panel">
      <div className="auth-content">
        <span className="brand-tag">
          PERSONAL FINANCE
        </span>

        <h1 className="brand-title">
          CURRENCIO
        </h1>

        <p className="brand-subtitle">
          Welcome back.
        </p>

        <input
          className="input"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="btns">
          <button
            className="pro-btn"
            onClick={login}
          >
            Continue
          </button>

          <button
            className="success-btn"
            onClick={signup}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  </div>
);
}