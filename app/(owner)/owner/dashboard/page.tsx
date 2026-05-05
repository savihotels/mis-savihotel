import { KpiCards } from "@/components/kpi-cards";
import { getDashboardData } from "@/lib/dashboard";

export default async function OwnerDashboardPage() {
  const data = await getDashboardData("daily");
  if (!data) return <main className="container"><h1>Hotel data not found</h1></main>;

  return (
    <main className="container">
      <h1>Owner Dashboard - Hotel Savi Regency (Jaipur)</h1>
      <KpiCards stats={data.summary} />

      <section className="card">
        <h2>Revenue Mix</h2>
        <ul>
          <li>OTA Revenue: INR {data.summary.otaRevenue.toFixed(2)}</li>
          <li>Direct Booking Revenue: INR {data.summary.directBookingRevenue.toFixed(2)}</li>
          <li>Restaurant Revenue: INR {data.summary.restaurantRevenue.toFixed(2)}</li>
          <li>Banquet Revenue: INR {data.summary.banquetRevenue.toFixed(2)}</li>
        </ul>
      </section>

      <section className="card">
        <h2>Payment Mode Summary</h2>
        <ul>
          <li>UPI: INR {data.summary.upiReceived.toFixed(2)}</li>
          <li>Card: INR {data.summary.cardReceived.toFixed(2)}</li>
          <li>Bank Transfer: INR {data.summary.bankTransferReceived.toFixed(2)}</li>
        </ul>
      </section>
    </main>
  );
}
