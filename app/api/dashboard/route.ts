import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboard";

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get("period") || "daily";
  const data = await getDashboardData(period);
  if (!data) return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
  return NextResponse.json(data);
}
