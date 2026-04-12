import { NextResponse } from "next/server";

import { buildLampadaPrompt } from "@/lib/lampada-prompts";
import { createLampadaDiagnosis } from "@/lib/openai";
import { persistSubmission } from "@/lib/persistence";
import { syncDiagnosisToMonday } from "@/lib/monday";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const payload = await request.json();
    const prompt = buildLampadaPrompt(payload);
    const diagnosis = await createLampadaDiagnosis(prompt, payload);
    const persistence = await persistSubmission({
      payload,
      diagnosis
    });
    const monday = await syncDiagnosisToMonday({
      payload,
      diagnosis
    });

    return NextResponse.json({
      diagnosis,
      persistence,
      monday
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Falha ao gerar diagnostico."
      },
      { status: 500 }
    );
  }
}
