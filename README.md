# Currencio

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Authentication-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Firestore-Database-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Gemini-AI_Assistant-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-Analytics-22C55E?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Active_Development-success?style=for-the-badge" />
</p>

<h1 align="center">Currencio</h1>

<p align="center">
  <strong>AI-Powered Personal Finance Dashboard</strong>
</p>

<p align="center">
  Manage expenses • Track budgets • Visualize spending • Get AI-powered financial assistance
</p>

---

## Overview

Currencio is a modern personal finance dashboard that helps users manage expenses, monitor monthly budgets, analyze spending behavior, and receive AI-powered financial guidance.

The platform combines secure authentication, cloud-based storage, real-time expense management, interactive analytics, and an integrated AI assistant to provide a complete personal finance experience.

---

## Key Highlights

* Secure Firebase Authentication
* Cloud-based Firestore Database
* AI Financial Assistant powered by Gemini
* Monthly Budget Tracking
* Expense Analytics Dashboard
* Interactive Pie & Trend Charts
* Dark Mode / Light Mode
* Responsive User Interface
* Real-Time Expense Management
* Category-Based Expense Tracking

---

## Features

### Authentication

* User Registration
* User Login
* Secure Authentication using Firebase
* User-specific financial records
* Session persistence

### Expense Management

* Add Expenses
* Edit Expenses
* Delete Expenses
* Category Selection
* Date-Based Tracking
* Real-Time Updates

### Budget Management

* Set Monthly Budget
* Track Remaining Balance
* Monthly Expense Monitoring
* Spending Overview

### Analytics Dashboard

* Total Monthly Spending
* Transaction Count
* Top Spending Category
* Average Spending Analysis
* Financial Insights

### Data Visualization

* Expense Breakdown Pie Chart
* Monthly Spending Trend Chart
* Interactive Analytics Dashboard

### AI Financial Assistant

Currencio integrates Google's Gemini AI to help users better understand their finances.

Capabilities include:

* Budgeting Suggestions
* Spending Advice
* Financial Guidance
* Expense Analysis
* Personal Finance Queries

### User Experience

* Modern Dashboard Design
* Dark Theme
* Light Theme
* Responsive Layout
* Smooth Animations
* Premium UI Components

---

## Technology Stack

| Category           | Technologies            |
| ------------------ | ----------------------- |
| Frontend           | React.js                |
| Build Tool         | Vite                    |
| Styling            | CSS3                    |
| Authentication     | Firebase Authentication |
| Database           | Firebase Firestore      |
| AI Integration     | Google Gemini API       |
| Data Visualization | Recharts                |
| Version Control    | Git & GitHub            |

---

## Project Structure

```text
EXPENSE-TRACKER
│
├── new-client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── firebase.js
│   │   └── App.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── server/
    ├── server.js
    ├── expenses.db
    └── package.json
```

---

## Current Functionality

| Feature                        | Status   |
| ------------------------------ | -------- |
| Firebase Authentication        | Complete |
| Firestore Database Integration | Complete |
| Add Expenses                   | Complete |
| Edit Expenses                  | Complete |
| Delete Expenses                | Complete |
| Monthly Budget Tracking        | Complete |
| Category Management            | Complete |
| AI Financial Assistant         | Complete |
| Pie Chart Analytics            | Complete |
| Expense Trend Analytics        | Complete |
| Dark Mode                      | Complete |
| Responsive Design              | Complete |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/currencio.git
```

### Navigate to Project

```bash
cd currencio
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Firebase configuration is currently managed inside `src/firebase.js`.
```

---

## Screenshots

Add screenshots of:

* Authentication Page
* Dashboard Overview
* Expense Management
* Budget Tracking
* Analytics Dashboard
* AI Financial Assistant
* Dark Mode Interface

---

## Future Roadmap

* Export Expenses to CSV
* Export Reports to PDF
* Financial Goal Tracking
* Advanced AI Insights
* Recurring Expense Support
* Multi-Currency Support
* Production Deployment

---

## Author

### Aayush Kumar Sinha

Computer Science Undergraduate

---

## License

This project is licensed under the MIT License.

---

<p align="center">
  Built with React, Firebase, Firestore, Recharts, and Gemini AI
</p>
