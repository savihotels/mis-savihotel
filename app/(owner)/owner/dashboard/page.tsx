import { KpiCards } from "@/components/kpi-cards";

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/dashboard?period=daily`, { cache: "no-store" });
  return res.json();
}

export default async function OwnerDashboardPage() {
  const data = await getData();

  return (
    <main className="container">
      <h1>Owner Dashboard - Hotel Savi Regency (Jaipur)</h1>
      <KpiCards stats={data.summary} />

      <section className="card">
        <h2>Revenue Mix</h2>
        <ul>
          <li>OTA Revenue: ₹{data.summary.otaRevenue.toFixed(2)}</li>
          <li>Direct Booking Revenue: ₹{data.summary.directBookingRevenue.toFixed(2)}</li>
          <li>Restaurant Revenue: ₹{data.summary.restaurantRevenue.toFixed(2)}</li>
          <li>Banquet Revenue: ₹{data.summary.banquetRevenue.toFixed(2)}</li>
        </ul>
      </section>

      <section className="card">
        <h2>Payment Mode Summary</h2>
        <ul>
          <li>UPI: ₹{data.summary.upiReceived.toFixed(2)}</li>
          <li>Card: ₹{data.summary.cardReceived.toFixed(2)}</li>
          <li>Bank Transfer: ₹{data.summary.bankTransferReceived.toFixed(2)}</li>
        </ul>
      </section>
    </main>
  );
}
