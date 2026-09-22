import { useEffect, useState } from "react";
import api from "../api";
export default function BudgetList({ month }) {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/budgets/", { params: { month } })
      .then((res) => setBudgets(res.data.results ?? res.data))
      .catch(() => setError("Impossible de charger les budgets."));
  }, [month]);
  if (error) return <p className="error">{error}</p>;
  return (
    <section className="budgets">
      {budgets.map((b) => {
        const pct = Math.min(100, Math.round((Number(b.spent) / Number(b.limit)) * 100));
        return (
          <div key={b.id} className="budget-row">
            <span className="budget-name">{b.category_name}</span>
            <div className="budget-track">
              <div className={`budget-fill ${b.over_budget ? "over" : ""}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="budget-amt">
              {Number(b.spent).toLocaleString("fr-FR")} / {Number(b.limit).toLocaleString("fr-FR")}
            </span>
            {b.over_budget && (
              <span className="alert">⚠ dépassement</span>
            )}
          </div>
        );
      })}
    </section>
  );
}
