import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import { diagnosisSchema } from "@/lib/diagnosis-schema";

const openai = process.env.OPENAI_API_KEY ? new OpenAI() : null;

function fallbackDiagnosis(payload) {
  const maturitySignals = [
    payload.businessContext,
    payload.realGoal,
    payload.kpis,
    payload.audience,
    payload.constraints,
    payload.budget
  ].filter((item) => item && item.trim().length > 16).length;

  const maturity =
    maturitySignals <= 2 ? "baixa" : maturitySignals <= 4 ? "média" : "alta";

  const blockingQuestions = [];

  if (!payload.realGoal) {
    blockingQuestions.push("Qual e o objetivo real do projeto alem do formato pedido?");
  }

  if (!payload.kpis) {
    blockingQuestions.push("Quais KPIs definem sucesso minimo e excelente?");
  }

  if (!payload.audience) {
    blockingQuestions.push("Quem e o publico principal e o que precisa mudar nele?");
  }

  if (!payload.budget) {
    blockingQuestions.push("Qual e a faixa de investimento confortavel para tomar a decisao certa?");
  }

  if (!payload.constraints) {
    blockingQuestions.push("Quais restricoes criticas podem travar conceito, producao ou aprovacao?");
  }

  return {
    title: payload.brand ? `${payload.brand} — resumo executivo` : "Resumo executivo",
    summary:
      "Diagnostico em modo fallback. O app esta sem OPENAI_API_KEY e gerou uma leitura heuristica para nao quebrar a experiencia.",
    strategicDiagnosis:
      "O caso parece ter potencial, mas ainda precisa consolidar melhor contexto, objetivo, KPI e restricoes antes de abrir uma proposta robusta.",
    maturity,
    riskSignal: payload.constraints ? "Atenção alta" : "Atenção moderada",
    blockingQuestions:
      blockingQuestions.length > 0
        ? blockingQuestions
        : ["Nenhuma lacuna critica imediata. O caso pode avancar para score e pricing."],
    attentionPoints: [
      "Evitar que o projeto vire formato sem tese de negocio.",
      "Amarrar objetivo, KPI e comportamento esperado antes de escopo criativo."
    ],
    nextStep:
      "Validar as perguntas bloqueadoras e, em seguida, registrar score e faixa de investimento.",
    recommendedPhase: "Diagnostico",
    decisionHint: "Ajustar",
    marginHint: "Media",
    scoreHint: 68,
    score: {
      total: 68,
      band: "Amarelo",
      rationale:
        "Existe potencial real, mas o briefing ainda nao amarra plenamente objetivo, KPI, restricoes e poder de decisao.",
      dimensions: [
        {
          name: "Clareza do briefing",
          score: 6,
          rationale: "Ha sinais do caso, mas ainda faltam definicoes criticas."
        },
        {
          name: "Maturidade do cliente",
          score: 7,
          rationale: "O pedido parece relevante, mas ainda nao veio suficientemente estruturado."
        },
        {
          name: "Complexidade operacional",
          score: 6,
          rationale: "Ha risco de crescer em escopo antes do alinhamento."
        },
        {
          name: "Potencial de margem",
          score: 7,
          rationale: "Pode ser bom, mas depende de escopo e verba mais claros."
        },
        {
          name: "Potencial de relacionamento",
          score: 8,
          rationale: "O caso sugere espaco para relacionamento consultivo."
        },
        {
          name: "Risco reputacional",
          score: 7,
          rationale: "O risco existe, mas ainda parece administravel com boa governanca."
        }
      ]
    },
    pricing: {
      recommendedRange: payload.budget || "Validar faixa recomendada apos alinhamento",
      minimumRange: payload.budget || "Definir faixa minima aceitavel",
      margin: "Media",
      classification: "Atencao",
      financialRisks: [
        "Escopo crescer antes da tese de negocio ficar clara.",
        "Cliente esperar experiencia premium sem faixa de investimento compativel."
      ],
      scopeAdjustments: [
        "Amarrar primeiro o objetivo real antes de abrir frente criativa.",
        "Separar obrigatorio de desejavel para proteger margem."
      ]
    },
    clientReport: {
      executiveSummary:
        "O projeto mostra potencial, mas precisa consolidar objetivo, indicadores e restricoes para virar decisao madura.",
      recommendation: "Ajustar",
      opportunities: [
        "Transformar o pedido em uma tese mais clara de negocio.",
        "Avancar com mais seguranca para score, faixa e proposta."
      ],
      nextSteps: [
        "Responder as perguntas bloqueadoras prioritarias.",
        "Validar faixa de investimento e criterio de sucesso."
      ],
      investmentNarrative:
        "A faixa final depende de clareza de escopo, governanca e ambicao de experiencia."
    }
  };
}

export async function createLampadaDiagnosis(prompt, payload) {
  if (!openai) {
    return fallbackDiagnosis(payload);
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.2";

  const response = await openai.responses.parse({
    model,
    input: [
      {
        role: "system",
        content:
          "Voce opera o metodo Lampada de briefing, diagnostico, score e protecao de margem."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    text: {
      format: zodTextFormat(diagnosisSchema, "lampada_diagnosis")
    }
  });

  if (!response.output_parsed) {
    throw new Error("A OpenAI nao retornou um diagnostico estruturado.");
  }

  return response.output_parsed;
}
