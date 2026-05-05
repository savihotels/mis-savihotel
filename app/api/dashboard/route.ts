import { NextRequest, NextResponse } from "next/server";
import { startOfMonth, startOfYear } from "date-fns";
import { prisma } from "@/lib/prisma";
import { calcGrowth, calcKpi } from "@/lib/kpi";
import { generateInsights } from "@/lib/insights";

const d = (n: unknown) => Number(n || 0);

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get("period") || "daily";

  const hotel = await prisma.hotel.findFirst({ where: { code: "HSR-JAIPUR-001" } });
  if (!hotel) return NextResponse.json({ message: "Hotel not found" }, { status: 404 });

  const today = new Date();
  const from = period === "yearly" ? startOfYear(today) : period === "monthly" ? startOfMonth(today) : new Date(today.toISOString().slice(0, 10));

  const rows = await prisma.reportBatch.findMany({
    where: { hotelId: hotel.id, reportDate: { gte: from, lte: today } },
    orderBy: { reportDate: "asc" }
  });

  const prevRows = await prisma.reportBatch.findMany({
    where: {
      hotelId: hotel.id,
      reportDate: {
        gte: new Date(from.getTime() - (today.getTime() - from.getTime())),
        lt: from
      }
    }
  });

  const sum = rows.reduce((a, r) => ({
    dailySales: a.dailySales + d(r.dailyTotalSales),
    dailyExpenses: a.dailyExpenses + d(r.dailyExpenses),
    cashInflow: a.cashInflow + d(r.cashInflow),
    cashOutflow: a.cashOutflow + d(r.cashOutflow),
    upiReceived: a.upiReceived + d(r.upiReceived),
    cardReceived: a.cardReceived + d(r.cardReceived),
    bankTransferReceived: a.bankTransferReceived + d(r.bankTransferReceived),
    otaRevenue: a.otaRevenue + d(r.otaRevenue),
    directBookingRevenue: a.directBookingRevenue + d(r.directBookingRevenue),
    restaurantRevenue: a.restaurantRevenue + d(r.restaurantRevenue),
    banquetRevenue: a.banquetRevenue + d(r.banquetRevenue),
    roomRevenue: a.roomRevenue + d(r.roomRevenue),
    roomsSold: a.roomsSold + r.roomsSold,
    roomsAvailable: a.roomsAvailable + r.roomsAvailable
  }), {
    dailySales: 0, dailyExpenses: 0, cashInflow: 0, cashOutflow: 0,
    upiReceived: 0, cardReceived: 0, bankTransferReceived: 0,
    otaRevenue: 0, directBookingRevenue: 0, restaurantRevenue: 0,
    banquetRevenue: 0, roomRevenue: 0, roomsSold: 0, roomsAvailable: 0
  });

  const kpi = calcKpi({ roomsAvailable: sum.roomsAvailable, roomsSold: sum.roomsSold, roomRevenue: sum.roomRevenue });

  const prevRevenue = prevRows.reduce((a, r) => a + d(r.dailyTotalSales), 0);
  const prevExpense = prevRows.reduce((a, r) => a + d(r.dailyExpenses), 0);
  const prevUpi = prevRows.reduce((a, r) => a + d(r.upiReceived), 0);

  const revenueGrowth = calcGrowth(sum.dailySales, prevRevenue);
  const expenseGrowth = calcGrowth(sum.dailyExpenses, prevExpense);
  const upiGrowth = calcGrowth(sum.upiReceived, prevUpi);

  const insights = generateInsights({
    occupancy: kpi.occupancy,
    arr: kpi.arr,
    revpar: kpi.revpar,
    expenseGrowth,
    revenueGrowth,
    otaShare: sum.roomRevenue ? sum.otaRevenue / sum.roomRevenue : 0,
    banquetRevenue: sum.banquetRevenue,
    banquetTarget: 500000,
    cashMismatch: sum.cashInflow - (sum.upiReceived + sum.cardReceived + sum.bankTransferReceived),
    upiGrowth
  });

  return NextResponse.json({
    summary: {
      ...sum,
      ...kpi,
      netOperating: sum.dailySales - sum.dailyExpenses,
      revenueGrowth,
      expenseGrowth
    },
    insights
  });
}
