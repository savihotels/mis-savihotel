import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { login, setSession } from "@/lib/auth";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = loginSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const session = await login(parsed.data.email, parsed.data.password);
  if (!session) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  await setSession(session.token);
  return NextResponse.json({ role: session.role });
}
