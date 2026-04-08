import { ReportForm } from "@/components/report-form";

export default function StaffReportsPage() {
  return (
    <main className="container">
      <h1>Staff Daily Reports</h1>
      <p>Submit all 6 departmental forms as one immutable daily batch.</p>
      <ReportForm />
    </main>
  );
}
