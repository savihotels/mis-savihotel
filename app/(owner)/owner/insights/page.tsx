import { getDashboardData } from "@/lib/dashboard";

export default async function InsightsPage() {
  const data = await getDashboardData("monthly");
  if (!data) return <main className="container"><h1>Hotel data not found</h1></main>;

  return (
    <main className="container">
      <h1>Management Insights & Alerts</h1>
      <ul className="card">
        {data.insights.map((insight: string) => <li key={insight}>{insight}</li>)}
      </ul>
    </main>
  );
}
