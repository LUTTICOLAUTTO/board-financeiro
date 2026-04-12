"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  "Base comercial",
  "Escopo e decisão",
  "Operação e risco",
  "Experiência e narrativa"
];

const blockerChecklist = [
  {
    label: "Objetivo principal do projeto está claro?",
    gate: "Bloqueador",
    fields: ["realGoal"]
  },
  {
    label: "Escopo e limite da entrega estão definidos?",
    gate: "Bloqueador",
    fields: ["scope", "deliverables"]
  },
  {
    label: "Data confirmada ou janela real de execução?",
    gate: "Bloqueador",
    fields: ["timeline"]
  },
  {
    label: "Destino, praça ou venue definido ou shortlist validada?",
    gate: "Importante",
    fields: ["location"]
  },
  {
    label: "Quantidade e perfil real dos participantes?",
    gate: "Bloqueador",
    fields: ["audience", "participants"]
  },
  {
    label: "Há budget fechado, faixa aprovada ou teto plausível?",
    gate: "Bloqueador",
    fields: ["budget"]
  },
  {
    label: "O que precisa obrigatoriamente ser entregue?",
    gate: "Bloqueador",
    fields: ["deliverables"]
  },
  {
    label: "Quem aprova, influencia e veta?",
    gate: "Bloqueador",
    fields: ["governance"]
  },
  {
    label: "Como a proposta será avaliada?",
    gate: "Importante",
    fields: ["decisionCriteria"]
  },
  {
    label: "Existe restrição legal, compliance, marca ou operação?",
    gate: "Bloqueador",
    fields: ["constraints", "compliance"]
  }
];

const initialForm = {
  sessionToken: "",
  sessionName: "",
  brand: "",
  demandType: "",
  businessContext: "",
  urgency: "",
  realGoal: "",
  format: "",
  kpis: "",
  budget: "",
  scope: "",
  deliverables: "",
  timeline: "",
  location: "",
  audience: "",
  participants: "",
  behavior: "",
  governance: "",
  decisionCriteria: "",
  decision: "",
  constraints: "",
  compliance: "",
  logistics: "",
  operationalRisks: "",
  nonNegotiable: "",
  desiredExperience: "",
  theme: "",
  references: "",
  history: ""
};

const defaultSession = {
  token: "public",
  name: "Experiencia Lampada",
  eyebrow: "Lampada.ag",
  title: "Diagnóstico Estratégico de Projetos & Experiências",
  intro:
    "Uma interface consultiva para transformar intenção em briefing executável, com leitura de risco, clareza comercial e próximo passo objetivo.",
  badges: ["Briefing guiado", "Critério antes da proposta", "Próximo passo claro"],
  flowTitle: "O que acontece aqui",
  flowSteps: [
    "Você organiza o caso em blocos objetivos",
    "O sistema identifica lacunas, gates e riscos",
    "A Lampada qualifica score, pricing e decisão",
    "O projeto sai daqui mais maduro para avançar"
  ],
  wizardKicker: "Diagnóstico guiado",
  wizardTitle: "Estruturação do briefing",
  thankYouTitle: "Recebemos seu briefing",
  thankYouText:
    "A Lampada já recebeu as informações e vai usar esse material para estruturar o próximo passo com mais clareza.",
  branding: {
    primary: "#0d6d63",
    accent: "#b9701e"
  }
};

function isFilled(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function renderChecklistStatus(form) {
  return blockerChecklist.map((item) => {
    const filledCount = item.fields.filter((field) => isFilled(form[field])).length;
    const completed = filledCount === item.fields.length;
    const partial = filledCount > 0 && !completed;

    return {
      ...item,
      status: completed ? "OK" : partial ? "Parcial" : "Pendente"
    };
  });
}

function scoreColorClass(status) {
  if (status === "OK") return "is-good";
  if (status === "Parcial") return "is-warning";
  return "is-danger";
}

export default function DiagnosticApp({
  accessGranted = true,
  requiresAuth = false,
  session = defaultSession
}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState({
    ...initialForm,
    sessionToken: session.token || "public",
    sessionName: session.name || "Experiencia Lampada"
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  const progressWidth = useMemo(
    () => `${((stepIndex + 1) / steps.length) * 100}%`,
    [stepIndex]
  );

  const shellStyle = useMemo(
    () => ({
      "--teal": session.branding?.primary || defaultSession.branding.primary,
      "--amber": session.branding?.accent || defaultSession.branding.accent
    }),
    [session.branding]
  );

  const checklist = useMemo(() => renderChecklistStatus(form), [form]);
  const checklistCompleted = checklist.filter((item) => item.status === "OK").length;
  const checklistPartial = checklist.filter((item) => item.status === "Parcial").length;
  const checklistCoverage = Math.round((checklistCompleted / checklist.length) * 100);
  const blockingCoverage = checklist
    .filter((item) => item.gate === "Bloqueador")
    .every((item) => item.status === "OK");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Nao foi possivel gerar o diagnostico.");
      }

      setResult(payload);
      if (session.token && session.token !== "public" && payload?.persistence?.id) {
        router.push(`/c/${session.token}/obrigado?id=${payload.persistence.id}`);
        return;
      }
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAccessSubmit(event) {
    event.preventDefault();
    setAuthenticating(true);
    setError("");

    try {
      const response = await fetch("/api/session-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: session.token,
          accessCode
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Nao foi possivel validar o acesso.");
      }

      router.refresh();
    } catch (authError) {
      setError(authError.message);
    } finally {
      setAuthenticating(false);
    }
  }

  async function copySummary() {
    if (!result?.diagnosis) return;

    const text = [
      result.diagnosis.title,
      "",
      result.diagnosis.summary,
      "",
      `Classificacao: ${result.diagnosis.briefingClassification}`,
      `Maturidade: ${result.diagnosis.maturity}`,
      "",
      "Perguntas bloqueadoras:",
      ...result.diagnosis.blockingQuestions.map((item) => `- ${item}`),
      "",
      "Premissas:",
      ...result.diagnosis.assumptions.map((item) => `- ${item}`),
      "",
      "Proximo passo:",
      result.diagnosis.nextStep
    ].join("\n");

    await navigator.clipboard.writeText(text);
  }

  function renderPreview() {
    return (
      <>
        <div className="empty-state" style={{ marginTop: 0 }}>
          <p className="empty-title">Leitura em tempo real</p>
          <p>
            O formulário já mostra o quanto do briefing está de pé antes mesmo
            da IA rodar. Quando os dados bloqueadores não chegam completos, a
            proposta deve continuar travada.
          </p>
        </div>

        <div className="sync-card">
          <h4>Cobertura do briefing</h4>
          <div className="coverage-metric">
            <strong>{`${checklistCoverage}%`}</strong>
            <span>{`${checklistCompleted} de ${checklist.length} itens críticos completos`}</span>
          </div>
          <ul>
            <li>{`Bloqueadores completos: ${blockingCoverage ? "sim" : "nao"}`}</li>
            <li>{`Itens parciais: ${checklistPartial}`}</li>
            <li>{`Regra operacional: sem 100% em dados bloqueadores, o gate segue bloqueado.`}</li>
          </ul>
        </div>

        <div className="sync-card">
          <h4>Checklist operacional</h4>
          <div className="checklist-stack">
            {checklist.map((item) => (
              <div className="checklist-row" key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.gate}</small>
                </div>
                <span className={`pill ${scoreColorClass(item.status)}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  function renderResult() {
    if (!result?.diagnosis) {
      return renderPreview();
    }

    const { diagnosis, persistence, monday } = result;

    return (
      <>
        <article className="result-card">
          <div className="result-topline">
            <span className="pill">{`Maturidade: ${diagnosis.maturity}`}</span>
            <span className="pill pill-alt">{diagnosis.riskSignal}</span>
            <span className="pill pill-outline">{diagnosis.briefingClassification}</span>
          </div>
          <h3>{diagnosis.title}</h3>
          <p>{diagnosis.summary}</p>

          <div className="result-block">
            <h4>Diagnóstico estratégico</h4>
            <p>{diagnosis.strategicDiagnosis}</p>
          </div>

          <div className="result-block">
            <h4>Briefing reorganizado</h4>
            <div className="detail-grid">
              <div className="detail-card">
                <strong>Contexto</strong>
                <p>{diagnosis.reorganizedBrief.context}</p>
              </div>
              <div className="detail-card">
                <strong>Objetivo real</strong>
                <p>{diagnosis.reorganizedBrief.realObjective}</p>
              </div>
              <div className="detail-card">
                <strong>KPIs</strong>
                <p>{diagnosis.reorganizedBrief.successIndicators}</p>
              </div>
              <div className="detail-card">
                <strong>Público e comportamento</strong>
                <p>{diagnosis.reorganizedBrief.audienceAndBehavior}</p>
              </div>
              <div className="detail-card">
                <strong>Restrições</strong>
                <p>{diagnosis.reorganizedBrief.restrictions}</p>
              </div>
              <div className="detail-card">
                <strong>Governança</strong>
                <p>{diagnosis.reorganizedBrief.governance}</p>
              </div>
            </div>
          </div>

          <div className="result-block">
            <h4>Perguntas bloqueadoras</h4>
            <ul>
              {diagnosis.blockingQuestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-block">
            <h4>Perguntas de refinamento</h4>
            <ul>
              {diagnosis.refinementQuestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-block">
            <h4>Riscos ocultos</h4>
            <ul>
              {diagnosis.attentionPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-block">
            <h4>Premissas assumidas</h4>
            <ul>
              {diagnosis.assumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-block">
            <h4>Próximo passo recomendado</h4>
            <p>{diagnosis.nextStep}</p>
          </div>
        </article>

        <div className="sync-card">
          <h4>Gates de decisão</h4>
          <div className="checklist-stack">
            {diagnosis.gateStatus.map((gate) => (
              <div className="checklist-row" key={gate.name}>
                <div>
                  <strong>{gate.name}</strong>
                  <p>{gate.rationale}</p>
                </div>
                <span className={`pill ${scoreColorClass(gate.status)}`}>{gate.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sync-card">
          <h4>Checklist por aba</h4>
          <ul>
            {diagnosis.checklistSummary.map((item) => (
              <li key={item.area}>
                <strong>{`${item.area}: ${item.status}`}</strong>
                {` — ${item.summary}`}
              </li>
            ))}
          </ul>
        </div>

        <div className="sync-card">
          <h4>Score comercial</h4>
          <p>{`${diagnosis.score.total} pontos — ${diagnosis.score.band}`}</p>
          <ul>
            {diagnosis.score.dimensions.map((dimension) => (
              <li key={dimension.name}>
                <strong>{`${dimension.name}: ${dimension.score}/10`}</strong>
                {` — ${dimension.rationale}`}
              </li>
            ))}
          </ul>
        </div>

        <div className="sync-card">
          <h4>Pricing</h4>
          <ul>
            <li>{`Faixa recomendada: ${diagnosis.pricing.recommendedRange}`}</li>
            <li>{`Faixa minima: ${diagnosis.pricing.minimumRange}`}</li>
            <li>{`Margem estimada: ${diagnosis.pricing.margin}`}</li>
            <li>{`Classificacao: ${diagnosis.pricing.classification}`}</li>
          </ul>
          <h4 style={{ marginTop: 22 }}>Ajustes de escopo</h4>
          <ul>
            {diagnosis.pricing.scopeAdjustments.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="sync-card">
          <h4>Devolutiva client-facing</h4>
          <p>{diagnosis.clientReport.executiveSummary}</p>
          <ul>
            {diagnosis.clientReport.opportunities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="sync-card">
          <h4>Operação</h4>
          <ul>
            <li>{`Persistencia local: ${persistence?.saved ? "ok" : "falhou"}`}</li>
            <li>
              {monday?.synced
                ? `Monday sincronizado: item ${monday.itemId}`
                : `Monday: ${monday?.message || "nao configurado"}`}
            </li>
          </ul>
          {monday?.url ? (
            <p>
              Abrir item no Monday:{" "}
              <a href={monday.url} target="_blank" rel="noreferrer">
                {monday.url}
              </a>
            </p>
          ) : null}
          <div className="action-stack" style={{ marginTop: 18 }}>
            <button className="ghost-button" onClick={copySummary} type="button">
              Copiar leitura
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="page-shell" style={shellStyle}>
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{session.eyebrow}</p>
          <h1>{session.title}</h1>
          <p className="hero-text">{session.intro}</p>
          <div className="hero-badges">
            {session.badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </div>
        <div className="hero-card">
          <p className="hero-card-label">{session.flowTitle}</p>
          <ol>
            {session.flowSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </header>

      {requiresAuth && !accessGranted ? (
        <main className="workspace">
          <section className="wizard-panel">
            <div className="section-head">
              <div>
                <p className="section-kicker">Acesso protegido</p>
                <h2>Informe o código da sessão</h2>
              </div>
            </div>

            <form className="wizard" onSubmit={handleAccessSubmit}>
              <section className="step-panel is-active">
                <label>
                  Código de acesso
                  <input
                    onChange={(event) => setAccessCode(event.target.value)}
                    placeholder="Digite o código enviado pela Lampada"
                    value={accessCode}
                  />
                </label>
              </section>

              <div className="wizard-actions">
                <div className="action-stack">
                  <button className="primary-button" disabled={authenticating} type="submit">
                    {authenticating ? "Validando..." : "Entrar"}
                  </button>
                </div>
              </div>
            </form>

            {error ? <div className="status-inline is-error">{error}</div> : null}
          </section>

          <aside className="result-panel">
            <div className="empty-state" style={{ marginTop: 0 }}>
              <p className="empty-title">Sessão privada</p>
              <p>
                Esse briefing foi preparado para um cliente específico. Use o
                código enviado pela equipe da Lampada para continuar.
              </p>
            </div>
          </aside>
        </main>
      ) : (
        <main className="workspace">
          <section className="wizard-panel">
            <div className="section-head">
              <div>
                <p className="section-kicker">{session.wizardKicker}</p>
                <h2>{session.wizardTitle}</h2>
                <p className="section-subtext">
                  Nada aqui é formulário frio. O fluxo foi desenhado para
                  capturar o mínimo viável que torna um projeto cotável sem
                  virar chute bem vestido.
                </p>
              </div>
              <div className="progress-card">
                <span>{`Passo ${stepIndex + 1} de ${steps.length}`}</span>
                <div className="progress-track">
                  <div className="progress-bar" style={{ width: progressWidth }} />
                </div>
              </div>
            </div>

            <nav className="stepper" aria-label="Etapas do briefing">
              {steps.map((step, index) => (
                <button
                  key={step}
                  className={`step ${index === stepIndex ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setStepIndex(index)}
                >
                  {step}
                </button>
              ))}
            </nav>

            <form className="wizard" onSubmit={handleSubmit}>
              <section className={`step-panel ${stepIndex === 0 ? "is-active" : ""}`}>
                <div className="field-grid">
                  <label>
                    Marca ou cliente
                    <input
                      name="brand"
                      onChange={updateField}
                      placeholder="Ex.: Chevrolet"
                      value={form.brand}
                    />
                  </label>
                  <label>
                    Tipo de demanda
                    <input
                      name="demandType"
                      onChange={updateField}
                      placeholder="Ex.: evento médico, incentivo premium, lançamento, convenção"
                      value={form.demandType}
                    />
                  </label>
                </div>
                <label>
                  O que está acontecendo agora no negócio?
                  <textarea
                    name="businessContext"
                    onChange={updateField}
                    placeholder="Ex.: pressão comercial, reposicionamento, retenção, pipeline, cultura interna, concorrência."
                    rows={4}
                    value={form.businessContext}
                  />
                </label>
                <label>
                  Por que esse projeto precisa existir agora?
                  <textarea
                    name="urgency"
                    onChange={updateField}
                    placeholder="Explique o gatilho real, não só a vontade de fazer algo."
                    rows={4}
                    value={form.urgency}
                  />
                </label>
                <label>
                  Qual é o objetivo real do projeto?
                  <textarea
                    name="realGoal"
                    onChange={updateField}
                    placeholder="Não descreva o formato. Descreva a mudança real que o projeto precisa provocar."
                    rows={4}
                    value={form.realGoal}
                  />
                </label>
                <div className="field-grid">
                  <label>
                    Formato imaginado até aqui
                    <input
                      name="format"
                      onChange={updateField}
                      placeholder="Ex.: jantar, convenção, viagem, ativações, feira"
                      value={form.format}
                    />
                  </label>
                  <label>
                    Faixa de investimento
                    <input
                      name="budget"
                      onChange={updateField}
                      placeholder="Ex.: R$ 600k a R$ 800k"
                      value={form.budget}
                    />
                  </label>
                </div>
                <label>
                  Quais são os indicadores de sucesso?
                  <textarea
                    name="kpis"
                    onChange={updateField}
                    placeholder="Ex.: presença, leads, reuniões, adesão, percepção, vendas, próximos passos."
                    rows={4}
                    value={form.kpis}
                  />
                </label>
              </section>

              <section className={`step-panel ${stepIndex === 1 ? "is-active" : ""}`}>
                <label>
                  Escopo macro do projeto
                  <textarea
                    name="scope"
                    onChange={updateField}
                    placeholder="Explique o que entra, o que parece entrar e onde estão os limites ainda indefinidos."
                    rows={4}
                    value={form.scope}
                  />
                </label>
                <label>
                  Entregáveis obrigatórios
                  <textarea
                    name="deliverables"
                    onChange={updateField}
                    placeholder="Ex.: conceito, KV, produção, operação, conteúdo, relatório, logística, estande, hospitalidade."
                    rows={4}
                    value={form.deliverables}
                  />
                </label>
                <div className="field-grid">
                  <label>
                    Data ou janela real
                    <input
                      name="timeline"
                      onChange={updateField}
                      placeholder="Ex.: agosto/2026, D-90, 05 a 25/08"
                      value={form.timeline}
                    />
                  </label>
                  <label>
                    Praça, destino ou venue
                    <input
                      name="location"
                      onChange={updateField}
                      placeholder="Ex.: São Paulo, Punta del Este, shortlist em validação"
                      value={form.location}
                    />
                  </label>
                </div>
                <div className="field-grid">
                  <label>
                    Público principal
                    <textarea
                      name="audience"
                      onChange={updateField}
                      placeholder="Ex.: diretoria, rede, médicos, corretores, cliente enterprise."
                      rows={4}
                      value={form.audience}
                    />
                  </label>
                  <label>
                    Quantidade e perfil de participantes
                    <textarea
                      name="participants"
                      onChange={updateField}
                      placeholder="Ex.: 400 pax, top performers, acompanhantes, origens, senioridade."
                      rows={4}
                      value={form.participants}
                    />
                  </label>
                </div>
                <label>
                  Como a decisão será tomada?
                  <textarea
                    name="decisionCriteria"
                    onChange={updateField}
                    placeholder="Ex.: menor preço, aderência ao racional, wow controlado, governança, prazo, homologação."
                    rows={4}
                    value={form.decisionCriteria}
                  />
                </label>
                <label>
                  Quem aprova, influencia e veta?
                  <textarea
                    name="governance"
                    onChange={updateField}
                    placeholder="Ex.: marketing, compras, compliance, diretoria, área demandante."
                    rows={4}
                    value={form.governance}
                  />
                </label>
              </section>

              <section className={`step-panel ${stepIndex === 2 ? "is-active" : ""}`}>
                <label>
                  Restrições críticas
                  <textarea
                    name="constraints"
                    onChange={updateField}
                    placeholder="Ex.: prazo, budget, marca, fornecedor homologado, regras do festival, sindicato, approvals."
                    rows={4}
                    value={form.constraints}
                  />
                </label>
                <label>
                  Compliance e guardrails
                  <textarea
                    name="compliance"
                    onChange={updateField}
                    placeholder="Ex.: limite de gift, o que é proibido, LGPD, regras jurídicas, segurança, claims."
                    rows={4}
                    value={form.compliance}
                  />
                </label>
                <label>
                  Operação, logística e staff
                  <textarea
                    name="logistics"
                    onChange={updateField}
                    placeholder="Ex.: passagens, quartos, transfers, montagem, credenciamento, equipe local, hospitalidade."
                    rows={4}
                    value={form.logistics}
                  />
                </label>
                <div className="field-grid">
                  <label>
                    Riscos operacionais percebidos
                    <textarea
                      name="operationalRisks"
                      onChange={updateField}
                      placeholder="Ex.: fila, energia, aprovações lentas, venue sensível, integração com terceiros."
                      rows={4}
                      value={form.operationalRisks}
                    />
                  </label>
                  <label>
                    O que não pode dar errado
                    <textarea
                      name="nonNegotiable"
                      onChange={updateField}
                      placeholder="Ex.: reputação, experiência VIP, segurança, confidencialidade, zero atraso."
                      rows={4}
                      value={form.nonNegotiable}
                    />
                  </label>
                </div>
                <label>
                  Histórico útil
                  <textarea
                    name="history"
                    onChange={updateField}
                    placeholder="Conte o que já foi feito, o que deu certo, o que deu ruim e o que a equipe quer evitar repetir."
                    rows={4}
                    value={form.history}
                  />
                </label>
              </section>

              <section className={`step-panel ${stepIndex === 3 ? "is-active" : ""}`}>
                <label>
                  Que comportamento você quer provocar depois?
                  <textarea
                    name="behavior"
                    onChange={updateField}
                    placeholder="Ex.: agendar reunião, aderir, comprar, defender a marca, aceitar piloto."
                    rows={4}
                    value={form.behavior}
                  />
                </label>
                <label>
                  Que experiência o projeto precisa deixar?
                  <textarea
                    name="desiredExperience"
                    onChange={updateField}
                    placeholder="Ex.: confiança, orgulho, pertencimento, prova, desejo, clareza de decisão."
                    rows={4}
                    value={form.desiredExperience}
                  />
                </label>
                <div className="field-grid">
                  <label>
                    Tema, narrativa ou hipótese criativa
                    <textarea
                      name="theme"
                      onChange={updateField}
                      placeholder="Se já existir uma direção criativa, descreva aqui."
                      rows={4}
                      value={form.theme}
                    />
                  </label>
                  <label>
                    Referências úteis
                    <textarea
                      name="references"
                      onChange={updateField}
                      placeholder="Cases, concorrentes, eventos, decks, inspirações ou coisas que precisam ser evitadas."
                      rows={4}
                      value={form.references}
                    />
                  </label>
                </div>
                <label>
                  Que decisão esse projeto precisa destravar?
                  <textarea
                    name="decision"
                    onChange={updateField}
                    placeholder="Ex.: aprovar proposta, definir rota criativa, destravar budget, validar arquitetura."
                    rows={4}
                    value={form.decision}
                  />
                </label>
              </section>

              <div className="wizard-actions">
                <button
                  className="ghost-button"
                  disabled={stepIndex === 0}
                  onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
                  type="button"
                >
                  Voltar
                </button>

                <div className="action-stack">
                  {stepIndex < steps.length - 1 ? (
                    <button
                      className="primary-button"
                      onClick={() =>
                        setStepIndex((current) => Math.min(current + 1, steps.length - 1))
                      }
                      type="button"
                    >
                      Continuar
                    </button>
                  ) : (
                    <button className="primary-button" disabled={loading} type="submit">
                      {loading ? "Gerando diagnóstico..." : "Gerar diagnóstico"}
                    </button>
                  )}
                </div>
              </div>
            </form>

            {error ? <div className="status-inline is-error">{error}</div> : null}
          </section>

          <aside className="result-panel">{renderResult()}</aside>
        </main>
      )}
    </div>
  );
}
