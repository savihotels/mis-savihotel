import { NextResponse } from "next/server";
import { reportSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "STAFF") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = reportSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid report payload" }, { status: 400 });
  }

  const p = parsed.data;
  const dailyTotalSales = p.roomRevenue + p.restaurantRevenue + p.banquetRevenue;

  try {
    const record = await prisma.reportBatch.create({
      data: {
        hotelId: session.hotelId,
        reportDate: new Date(p.reportDate),
        submittedByUserId: session.sub,
        dailyTotalSales,
        dailyExpenses: p.dailyExpenses,
        cashInflow: p.cashInflow,
        cashOutflow: p.cashOutflow,
        upiReceived: p.upiReceived,
        cardReceived: p.cardReceived,
        bankTransferReceived: p.bankTransferReceived,
        otaRevenue: p.roomRevenue * 0.6,
        directBookingRevenue: p.roomRevenue * 0.4,
        restaurantRevenue: p.restaurantRevenue,
        banquetRevenue: p.banquetRevenue,
        roomRevenue: p.roomRevenue,
        roomsAvailable: p.roomsAvailable,
        roomsSold: p.roomsSold,
        frontOfficeReport: JSON.parse(p.frontOfficeReport),
        expenseReport: JSON.parse(p.expenseReport),
        purchaseReport: JSON.parse(p.purchaseReport),
        restaurantReport: JSON.parse(p.restaurantReport),
        banquetReport: JSON.parse(p.banquetReport),
        cashAccountsReport: JSON.parse(p.cashAccountsReport)
      }
    });

    return NextResponse.json({ id: record.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Report for this date already exists (immutable daily submission rule)" },
      { status: 409 }
    );
  }
}
