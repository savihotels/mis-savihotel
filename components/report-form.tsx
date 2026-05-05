"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema, type ReportInput } from "@/lib/validations";

export function ReportForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ReportInput>({
    resolver: zodResolver(reportSchema),
    defaultValues: { reportDate: new Date().toISOString().slice(0, 10) }
  });

  async function onSubmit(payload: ReportInput) {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) alert("Report submitted");
    else alert("Unable to submit report");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card form-grid two-col">
      {[
        ["reportDate", "Report Date", "date"],
        ["roomsAvailable", "Rooms Available", "number"],
        ["roomsSold", "Rooms Sold", "number"],
        ["roomRevenue", "Room Revenue", "number"],
        ["restaurantRevenue", "Restaurant Revenue", "number"],
        ["banquetRevenue", "Banquet Revenue", "number"],
        ["dailyExpenses", "Daily Expenses", "number"],
        ["cashInflow", "Cash Inflow", "number"],
        ["cashOutflow", "Cash Outflow", "number"],
        ["upiReceived", "UPI Received", "number"],
        ["cardReceived", "Card Received", "number"],
        ["bankTransferReceived", "Bank Transfer", "number"]
      ].map(([field, label, type]) => (
        <label key={field}>{label}
          <input type={type} step="0.01" {...register(field as keyof ReportInput)} required />
          {errors[field as keyof ReportInput] ? <span className="error">Invalid value</span> : null}
        </label>
      ))}

      {[
        ["frontOfficeReport", "Front Office Report"],
        ["expenseReport", "Daily Expense Report"],
        ["purchaseReport", "Purchase Report"],
        ["restaurantReport", "Restaurant Sales Report"],
        ["banquetReport", "Banquet/Event Report"],
        ["cashAccountsReport", "Cash/Accounts Report"]
      ].map(([field, label]) => (
        <label key={field} className="col-span-2">{label}
          <textarea {...register(field as keyof ReportInput)} placeholder='{"notes":"..."}' required />
        </label>
      ))}

      <button type="submit" className="btn col-span-2">Submit Daily Batch</button>
    </form>
  );
}
