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

  const blockerSignals = [
    payload.realGoal,
    payload.scope || payload.deliverables,
    payload.timeline,
    payload.location,
    payload.audience || payload.participants,
    payload.budget,
    payload.deliverables,
    payload.governance,
    payload.decisionCriteria,
    payload.constraints || payload.compliance
  ].filter((item) => item && item.trim().length > 10).length;

  const maturity =
    maturitySignals <= 2 ? "baixa" : maturitySignals <= 4 ? "média" : "alta";
  const briefingClassification =
    blockerSignals <= 4
      ? "Bloqueado"
      : blockerSignals <= 7
        ? "Viavel com premissas"
        : payload.constraints && payload.nonNegotiable
          ? "Apto para proposta"
          : "Viavel com premissas";

  const blockingQuestions = [];
  const assumptions = [];

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

  if (!payload.governance) {
    blockingQuestions.push("Quem aprova, influencia ou pode vetar a decisao final?");
  }

  if (!payload.deliverables) {
    assumptions.push("Escopo ainda em consolidacao; separar obrigatorio de desejavel antes da proposta.");
  }

  if (!payload.location) {
    assumptions.push("Venue, destino ou shortlist ainda precisam ser validados para precificacao real.");
  }

  if (!payload.compliance) {
    assumptions.push("Regras de compliance e restricoes legais ainda nao foram detalhadas.");
  }

  if (!payload.history) {
    assumptions.push("Nao ha historico consolidado do que deu certo ou errado em projetos similares.");
  }

  return {
    title: payload.brand ? `${payload.brand} — resumo executivo` : "Resumo executivo",
    summary:
      "Diagnostico em modo fallback. O app esta sem OPENAI_API_KEY e gerou uma leitura heuristica para nao quebrar a experiencia.",
    strategicDiagnosis:
      "O caso parece ter potencial, mas ainda precisa consolidar melhor contexto, objetivo, KPI e restricoes antes de abrir uma proposta robusta.",
    maturity,
    briefingClassification,
    riskSignal: payload.constraints ? "Atenção alta" : "Atenção moderada",
    reorganizedBrief: {
      context: payload.businessContext || "Contexto ainda raso ou nao informado.",
      realObjective:
        payload.realGoal || "Objetivo real ainda nao foi separado do formato desejado.",
      successIndicators: payload.kpis || "KPIs nao informados.",
      audienceAndBehavior:
        payload.audience || payload.behavior
          ? `${payload.audience || "Publico nao detalhado"}. Comportamento esperado: ${payload.behavior || "nao informado"}.`
          : "Publico e comportamento esperado ainda nao foram detalhados.",
      restrictions:
        payload.constraints || payload.compliance || "Restricoes criticas ainda nao foram fechadas.",
      governance:
        payload.governance || "Governanca e aprovadores ainda nao foram mapeados."
    },
    blockingQuestions:
      blockingQuestions.length > 0
        ? blockingQuestions
        : ["Nenhuma lacuna critica imediata. O caso pode avancar para score e pricing."],
    refinementQuestions: [
      "O que precisa estar obrigatoriamente pronto para este projeto ser considerado um sucesso interno?",
      "Quais entregas podem sair do escopo sem comprometer o objetivo real?",
      "Como esse projeto sera avaliado por compras, marketing e lideranca?"
    ],
    attentionPoints: [
      "Evitar que o projeto vire formato sem tese de negocio.",
      "Amarrar objetivo, KPI e comportamento esperado antes de escopo criativo.",
      "Sem governanca clara, o risco de retrabalho e atraso aumenta rapidamente."
    ],
    assumptions:
      assumptions.length > 0
        ? assumptions
        : ["O caso parece suficientemente descrito para avancar com refinamentos controlados."],
    nextStep:
      "Validar as perguntas bloqueadoras e, em seguida, registrar score e faixa de investimento.",
    recommendedPhase: "Diagnostico",
    decisionHint: "Ajustar",
    marginHint: "Media",
    scoreHint: 68,
    gateStatus: [
      {
        name: "Viabilidade",
        status: blockerSignals >= 6 ? "OK" : blockerSignals >= 4 ? "Parcial" : "Pendente",
        rationale: "Prazo, verba, publico e local ainda precisam estar suficientemente travados."
      },
      {
        name: "Estrategia",
        status: payload.realGoal && payload.kpis ? "OK" : payload.realGoal ? "Parcial" : "Pendente",
        rationale: "Objetivo e indicadores ainda definem a qualidade do briefing."
      },
      {
        name: "Experiencia",
        status:
          payload.behavior && payload.desiredExperience
            ? "OK"
            : payload.behavior || payload.desiredExperience
              ? "Parcial"
              : "Pendente",
        rationale: "A experiencia precisa servir ao comportamento desejado, nao ao formato."
      },
      {
        name: "Producao",
        status:
          payload.deliverables && payload.logistics
            ? "OK"
            : payload.deliverables || payload.logistics
              ? "Parcial"
              : "Pendente",
        rationale: "Entregaveis, operacao e contingencias ainda precisam de base real."
      },
      {
        name: "Financeiro",
        status: payload.budget ? "OK" : "Pendente",
        rationale: "Sem range plausivel de investimento nao existe proposta madura."
      }
    ],
    checklistSummary: [
      {
        area: "Painel",
        status: blockerSignals >= 8 ? "OK" : blockerSignals >= 5 ? "Parcial" : "Pendente",
        summary: "Visao geral do caso e status executivo do briefing."
      },
      {
        area: "Dados Bloqueadores",
        status: blockerSignals === 10 ? "OK" : blockerSignals >= 6 ? "Parcial" : "Pendente",
        summary: "Itens minimos para destravar proposta com menos risco."
      },
      {
        area: "Custos PAX",
        status: payload.participants ? "Parcial" : "Pendente",
        summary: "Ainda depende de volume, perfil e jornada real dos participantes."
      },
      {
        area: "Custos de Grupo",
        status: payload.location || payload.logistics ? "Parcial" : "Pendente",
        summary: "Custos coletivos exigem venue, operacao e premissas mais concretas."
      },
      {
        area: "Operacao & Staff",
        status: payload.logistics ? "Parcial" : "Pendente",
        summary: "Operacao ainda precisa de detalhamento tecnico."
      },
      {
        area: "Riscos & Contingencia",
        status: payload.operationalRisks || payload.constraints ? "Parcial" : "Pendente",
        summary: "Mapa de risco inicial identificado, mas ainda sem plano pleno de mitigacao."
      },
      {
        area: "Governanca",
        status: payload.governance ? "OK" : "Pendente",
        summary: "Aprovadores, influenciadores e vetos precisam estar claros."
      },
      {
        area: "Experiencia & Narrativa",
        status:
          payload.desiredExperience || payload.theme ? "Parcial" : "Pendente",
        summary: "Experiencia desejada e direcao narrativa ja tem ponto de partida, mas ainda pedem consolidacao."
      }
    ],
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
        "Avancar com mais seguranca para score, faixa e proposta.",
        "Usar o checklist operacional para tirar emocao da conversa comercial."
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
