import { z } from "zod";

export const diagnosisSchema = z.object({
  title: z.string(),
  summary: z.string(),
  strategicDiagnosis: z.string(),
  maturity: z.enum(["baixa", "média", "alta"]),
  briefingClassification: z.enum([
    "Bloqueado",
    "Viavel com premissas",
    "Apto para proposta",
    "Alto risco"
  ]),
  riskSignal: z.string(),
  reorganizedBrief: z.object({
    context: z.string(),
    realObjective: z.string(),
    successIndicators: z.string(),
    audienceAndBehavior: z.string(),
    restrictions: z.string(),
    governance: z.string()
  }),
  blockingQuestions: z.array(z.string()).min(1).max(6),
  refinementQuestions: z.array(z.string()).min(2).max(6),
  attentionPoints: z.array(z.string()).min(2).max(6),
  assumptions: z.array(z.string()).min(1).max(6),
  nextStep: z.string(),
  recommendedPhase: z.enum(["Intake", "Diagnostico", "Score", "Precificacao", "Proposta"]),
  decisionHint: z.enum(["Avancar", "Ajustar", "Repensar"]),
  marginHint: z.enum(["Baixa", "Media", "Alta"]),
  scoreHint: z.number().min(0).max(100),
  gateStatus: z.array(
    z.object({
      name: z.string(),
      status: z.enum(["OK", "Parcial", "Pendente"]),
      rationale: z.string()
    })
  ).min(5).max(5),
  checklistSummary: z.array(
    z.object({
      area: z.string(),
      status: z.enum(["OK", "Parcial", "Pendente"]),
      summary: z.string()
    })
  ).min(8).max(8),
  score: z.object({
    total: z.number().min(0).max(100),
    band: z.enum(["Verde", "Amarelo", "Vermelho"]),
    rationale: z.string(),
    dimensions: z.array(
      z.object({
        name: z.string(),
        score: z.number().min(0).max(10),
        rationale: z.string()
      })
    ).min(6).max(6)
  }),
  pricing: z.object({
    recommendedRange: z.string(),
    minimumRange: z.string(),
    margin: z.enum(["Baixa", "Media", "Alta"]),
    classification: z.enum(["Viavel", "Atencao", "Inviavel"]),
    financialRisks: z.array(z.string()).min(2).max(5),
    scopeAdjustments: z.array(z.string()).min(2).max(5)
  }),
  clientReport: z.object({
    executiveSummary: z.string(),
    recommendation: z.enum(["Avancar", "Ajustar", "Repensar"]),
    opportunities: z.array(z.string()).min(2).max(5),
    nextSteps: z.array(z.string()).min(2).max(5),
    investmentNarrative: z.string()
  })
});
