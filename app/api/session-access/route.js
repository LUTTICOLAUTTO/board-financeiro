import { NextResponse } from "next/server";

import { getClientSession } from "@/lib/client-sessions";
import { buildSessionAccessCookie } from "@/lib/session-auth";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { token, accessCode } = await request.json();
    const session = getClientSession(token);

    if (!session) {
      return NextResponse.json({ error: "Sessao nao encontrada." }, { status: 404 });
    }

    if (!session.accessCode || session.accessCode !== accessCode) {
      return NextResponse.json({ error: "Codigo de acesso invalido." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    const cookie = buildSessionAccessCookie(token, accessCode);
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Falha ao validar acesso." },
      { status: 500 }
    );
  }
}
