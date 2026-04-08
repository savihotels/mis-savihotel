import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe@123", 10);

  const hotel = await prisma.hotel.upsert({
    where: { code: "HSR-JAIPUR-001" },
    update: {},
    create: {
      code: "HSR-JAIPUR-001",
      name: "Hotel Savi Regency",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
      totalRooms: 48
    }
  });

  const admin = await prisma.user.upsert({
    where: { email: "owner@saviregency.in" },
    update: {},
    create: {
      hotelId: hotel.id,
      fullName: "Owner Admin",
      email: "owner@saviregency.in",
      role: Role.ADMIN,
      passwordHash
    }
  });

  await prisma.user.upsert({
    where: { email: "staff@saviregency.in" },
    update: {},
    create: {
      hotelId: hotel.id,
      fullName: "FO Staff",
      email: "staff@saviregency.in",
      role: Role.STAFF,
      passwordHash
    }
  });

  for (let i = 0; i < 60; i++) {
    const d = subDays(new Date(), i);
    const roomsSold = 25 + (i % 20);
    const roomRevenue = roomsSold * (2200 + (i % 6) * 150);
    const restaurantRevenue = 22000 + (i % 5) * 2100;
    const banquetRevenue = i % 7 === 0 ? 40000 : 12000 + (i % 4) * 3000;
    const otaRevenue = roomRevenue * 0.58;
    const directBookingRevenue = roomRevenue * 0.42;
    const dailyTotalSales = roomRevenue + restaurantRevenue + banquetRevenue;
    const dailyExpenses = dailyTotalSales * (0.45 + (i % 6) * 0.01);

    await prisma.reportBatch.upsert({
      where: {
        hotelId_reportDate: {
          hotelId: hotel.id,
          reportDate: new Date(d.toISOString().slice(0, 10))
        }
      },
      update: {},
      create: {
        hotelId: hotel.id,
        reportDate: new Date(d.toISOString().slice(0, 10)),
        submittedByUserId: admin.id,
        dailyTotalSales,
        dailyExpenses,
        cashInflow: dailyTotalSales * 0.12,
        cashOutflow: dailyExpenses * 0.33,
        upiReceived: dailyTotalSales * 0.36,
        cardReceived: dailyTotalSales * 0.29,
        bankTransferReceived: dailyTotalSales * 0.23,
        otaRevenue,
        directBookingRevenue,
        restaurantRevenue,
        banquetRevenue,
        roomRevenue,
        roomsAvailable: 48,
        roomsSold,
        frontOfficeReport: {
          occupancyNotes: "Healthy walk-ins and OTA conversion",
          arrivals: roomsSold,
          departures: 17 + (i % 9)
        },
        expenseReport: {
          payroll: dailyExpenses * 0.42,
          utility: dailyExpenses * 0.14,
          maintenance: dailyExpenses * 0.12,
          misc: dailyExpenses * 0.32
        },
        purchaseReport: {
          kitchen: 10000 + (i % 4) * 1500,
          housekeeping: 3400 + (i % 3) * 800,
          supplies: 2500 + (i % 2) * 600
        },
        restaurantReport: {
          covers: 110 + (i % 30),
          avgBill: 520 + (i % 6) * 20
        },
        banquetReport: {
          events: i % 7 === 0 ? 1 : 0,
          pax: i % 7 === 0 ? 120 : 0
        },
        cashAccountsReport: {
          cashClosing: 120000 + i * 100,
          pendingReceivables: 35000 - i * 100
        }
      }
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
