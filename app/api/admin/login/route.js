import { NextResponse } from "next/server";

import { buildAdminCookie, validateAdminCredentials } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!validateAdminCredentials(email, password)) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });
    const cookie = buildAdminCookie();
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Falha ao autenticar." },
      { status: 500 }
    );
  }
}
