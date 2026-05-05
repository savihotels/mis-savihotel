export function KpiCards({ stats }: { stats: Record<string, number> }) {
  const items = [
    ["Daily Sales", stats.dailySales],
    ["Daily Expenses", stats.dailyExpenses],
    ["Occupancy %", stats.occupancy],
    ["ARR", stats.arr],
    ["RevPAR", stats.revpar],
    ["Net Operating", stats.netOperating]
  ];

  return (
    <section className="cards-grid">
      {items.map(([label, value]) => (
        <article className="card" key={label as string}>
          <h3>{label}</h3>
          <strong>{Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
        </article>
      ))}
    </section>
  );
}
