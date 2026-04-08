async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/dashboard?period=monthly`, { cache: "no-store" });
  return res.json();
}

export default async function InsightsPage() {
  const data = await getData();
  return (
    <main className="container">
      <h1>Management Insights & Alerts</h1>
      <ul className="card">
        {data.insights.map((insight: string) => <li key={insight}>{insight}</li>)}
      </ul>
    </main>
  );
}
