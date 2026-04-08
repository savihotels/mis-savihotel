import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-only-secret");

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email }, include: { hotel: true } });
  if (!user || !user.isActive) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  const token = await new SignJWT({
    sub: user.id,
    role: user.role,
    hotelId: user.hotelId,
    hotelName: user.hotel.name
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);

  return { token, role: user.role };
}

export async function setSession(token: string) {
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function getSession() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as {
      sub: string;
      role: "ADMIN" | "STAFF";
      hotelId: string;
      hotelName: string;
    };
  } catch {
    return null;
  }
}
