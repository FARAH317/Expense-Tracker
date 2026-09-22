import { useEffect, useState } from "react";
import api from "../api";
export default function TransactionsTable({ filters, onFiltersChange }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/categories/").then((res) => setCategories(res.data));
  }, []);
  useEffect(() => {
    const params = {};
    if (filters.dateFrom) params.date_from = filters.dateFrom;
    if (filters.dateTo) params.date_to = filters.dateTo;
    if (filters.category) params.category = filters.category;
    if (filters.type) params.type = filters.type;
    api
      .get("/transactions/", { params })
      .then((res) => setTransactions(res.data.results ?? res.data))
      .catch(() => setError("Impossible de charger les transactions."));
  }, [filters]);
  function update(field, value) {
    onFiltersChange({ ...filters, [field]: value });
  }
  return (
    <section className="transactions">
      <div className="filters">
        <select value={filters.category} onChange={(e) => update("category", e.target.value)}>
          <option value="">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={filters.type} onChange={(e) => update("type", e.target.value)}>
          <option value="">Tout type</option>
          <option value="income">Revenus</option>
          <option value="expense">Dépenses</option>
        </select>
        <input type="date" value={filters.dateFrom || ""} onChange={(e) => update("dateFrom", e.target.value)} />
        <input type="date" value={filters.dateTo || ""} onChange={(e) => update("dateTo", e.target.value)} />
      </div>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr><th>Date</th><th>Description</th><th>Catégorie</th><th>Montant</th></tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.category_name}</td>
              <td className={t.type === "income" ? "pos" : "neg"}>
                {Number(t.signed_amount) >= 0 ? "+" : ""}
                {Number(t.signed_amount).toLocaleString("fr-FR")} DA
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
