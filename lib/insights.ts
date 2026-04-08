type InsightInput = {
  occupancy: number;
  arr: number;
  revpar: number;
  expenseGrowth: number;
  revenueGrowth: number;
  otaShare: number;
  banquetRevenue: number;
  banquetTarget: number;
  cashMismatch: number;
  upiGrowth: number;
};

export function generateInsights(i: InsightInput): string[] {
  const insights: string[] = [];

  if (i.occupancy > 75 && i.arr < 2600) insights.push("Occupancy is strong but ARR is weak. Consider price optimization and upselling.");
  if (i.expenseGrowth > i.revenueGrowth) insights.push("Expenses are rising faster than revenue. Tighten cost controls by department.");
  if (i.otaShare > 0.55) insights.push("Heavy dependence on OTA bookings. Push direct booking campaigns to improve net margins.");
  if (i.banquetRevenue < i.banquetTarget) insights.push("Banquet revenue is underperforming versus target. Review event pipeline and local sales outreach.");
  if (Math.abs(i.cashMismatch) > 5000) insights.push("Cash collection mismatch possible. Reconcile cash ledger and payment gateway settlements.");
  if (i.upiGrowth > 10) insights.push("UPI collections are improving. Consider UPI-only offers and faster checkout counters.");
  if (i.revpar < 1800) insights.push("RevPAR is below expected level. Improve room mix and yield strategy.");

  if (insights.length === 0) insights.push("Performance is stable with no high-risk alerts for the selected period.");

  return insights;
}
