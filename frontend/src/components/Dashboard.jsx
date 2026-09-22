import { useEffect, useState } from "react";
import api from "../api";
export default function Dashboard({ filters }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const params = {};
    if (filters.dateFrom) params.date_from = filters.dateFrom;
    if (filters.dateTo) params.date_to = filters.dateTo;
    if (filters.category) params.category = filters.category;
    api
      .get("/transactions/summary/", { params })
      .then((res) => setSummary(res.data))
      .catch(() => setError("Impossible de charger le résumé."));
  }, [filters]);
  if (error) return <p className="error">{error}</p>;
  if (!summary) return <p>Chargement...</p>;
  const maxSpent = Math.max(1, ...summary.by_category.map((c) => Number(c.total)));
  return (
    <section className="dashboard">
      <div className="summary-cards">
        <Card label="Revenus" value={summary.income_total} tone="income" />
        <Card label="Dépenses" value={summary.expense_total} tone="expense" />
        <Card label="Solde" value={summary.balance} tone="balance" />
      </div>
      <div className="chart">
        {summary.by_category.map((c) => (
          <div key={c.category_id} className="bar-col">
            <div className="bar-amt">{Number(c.total).toLocaleString("fr-FR")}</div>
            <div
              className="bar"
              style={{ height: `${(Number(c.total) / maxSpent) * 140+10}px` }}
            />
            <div className="bar-label">{c.category}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
function Card({ label, value, tone }) {
  return (
    <div className={`sum-card ${tone}`}>
      <div className="sum-label">{label}</div>
      <div className="sum-val">{Number(value).toLocaleString("fr-FR")} DA</div>
    </div>
  );
}
