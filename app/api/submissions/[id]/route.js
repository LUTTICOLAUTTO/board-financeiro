import { NextResponse } from "next/server";

import { getSubmissionById } from "@/lib/persistence";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const record = await getSubmissionById(params.id);

  if (!record) {
    return NextResponse.json({ error: "Submission nao encontrada." }, { status: 404 });
  }

  return NextResponse.json({
    id: record.id,
    createdAt: record.createdAt,
    diagnosis: record.diagnosis,
    sessionToken: record.payload?.sessionToken || "public",
    sessionName: record.payload?.sessionName || "Experiencia Lampada"
  });
}
