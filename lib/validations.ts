import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const reportSchema = z.object({
  reportDate: z.string().min(10),
  roomsAvailable: z.coerce.number().int().min(1),
  roomsSold: z.coerce.number().int().min(0),
  roomRevenue: z.coerce.number().min(0),
  restaurantRevenue: z.coerce.number().min(0),
  banquetRevenue: z.coerce.number().min(0),
  dailyExpenses: z.coerce.number().min(0),
  cashInflow: z.coerce.number().min(0),
  cashOutflow: z.coerce.number().min(0),
  upiReceived: z.coerce.number().min(0),
  cardReceived: z.coerce.number().min(0),
  bankTransferReceived: z.coerce.number().min(0),
  frontOfficeReport: z.string().min(2),
  expenseReport: z.string().min(2),
  purchaseReport: z.string().min(2),
  restaurantReport: z.string().min(2),
  banquetReport: z.string().min(2),
  cashAccountsReport: z.string().min(2)
}).refine((data) => data.roomsSold <= data.roomsAvailable, {
  message: "Rooms sold cannot exceed rooms available",
  path: ["roomsSold"]
});

export type ReportInput = z.infer<typeof reportSchema>;
