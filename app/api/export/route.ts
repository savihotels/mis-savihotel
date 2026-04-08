import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get("format") || "excel";
  const rows = await prisma.reportBatch.findMany({
    orderBy: { reportDate: "desc" },
    take: 366
  });

  if (format === "excel") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("MIS");
    sheet.columns = [
      { header: "Date", key: "date", width: 14 },
      { header: "Sales", key: "sales", width: 12 },
      { header: "Expenses", key: "expenses", width: 12 },
      { header: "Rooms Sold", key: "roomsSold", width: 12 },
      { header: "Room Revenue", key: "roomRevenue", width: 14 },
      { header: "Restaurant", key: "restaurant", width: 14 },
      { header: "Banquet", key: "banquet", width: 14 }
    ];

    rows.forEach((r) => {
      sheet.addRow({
        date: r.reportDate.toISOString().slice(0, 10),
        sales: Number(r.dailyTotalSales),
        expenses: Number(r.dailyExpenses),
        roomsSold: r.roomsSold,
        roomRevenue: Number(r.roomRevenue),
        restaurant: Number(r.restaurantRevenue),
        banquet: Number(r.banquetRevenue)
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=hotel-savi-regency-mis.xlsx"
      }
    });
  }

  const csv = [
    "date,sales,expenses,rooms_sold,room_revenue,restaurant,banquet",
    ...rows.map((r) => `${r.reportDate.toISOString().slice(0, 10)},${r.dailyTotalSales},${r.dailyExpenses},${r.roomsSold},${r.roomRevenue},${r.restaurantRevenue},${r.banquetRevenue}`)
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=hotel-savi-regency-mis.csv"
    }
  });
}
