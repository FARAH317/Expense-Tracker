import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import TransactionsTable from "./components/TransactionsTable";
import BudgetList from "./components/BudgetList";
import { isAuthenticated, logout } from "./api";
import "./styles.css";
export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [filters, setFilters] = useState({ category: "", type: "", dateFrom: "", dateTo: "" });
  if (!authed) {
    return <Login onLoggedIn={() => setAuthed(true)} />;
  }
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  return (
    <div className="app">
      <header>
        <h1>Ledger</h1>
        <button onClick={() => { logout(); setAuthed(false); }}>Déconnexion</button>
      </header>
      <Dashboard filters={filters} />
      <BudgetList month={currentMonth} />
      <TransactionsTable filters={filters} onFiltersChange={setFilters} />
    </div>
  );
}
