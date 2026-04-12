"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const steps = ["Contexto", "Objetivo", "Publico", "Restricoes"];

const initialForm = {
  sessionToken: "",
  sessionName: "",
  brand: "",
  businessContext: "",
  urgency: "",
  realGoal: "",
  kpis: "",
  decision: "",
  audience: "",
  resistance: "",
  behavior: "",
  timeline: "",
  budget: "",
  constraints: "",
  nonNegotiable: ""
};

const defaultSession = {
  token: "public",
  name: "Experiencia Lampada",
  eyebrow: "Lampada.ag",
  title: "Diagnostico Estrategico de Projetos & Experiencias",
  intro:
    "Um app client-facing para transformar briefing em criterio. O cliente responde em um fluxo guiado, a IA estrutura o diagnostico no metodo Lampada e o pipeline segue direto para o Monday.",
  badges: ["Next.js app", "OpenAI Responses API", "Monday sync"],
  flowTitle: "Arquitetura ativa",
  flowSteps: [
    "Cliente preenche o briefing guiado",
    "API gera diagnostico estruturado",
    "App salva historico local",
    "Board do Monday recebe o caso"
  ],
  wizardKicker: "Interface client-facing",
  wizardTitle: "Roteiro de descoberta"
};

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
      "Perguntas bloqueadoras:",
      ...result.diagnosis.blockingQuestions.map((item) => `- ${item}`),
      "",
      "Proximo passo:",
      result.diagnosis.nextStep
    ].join("\n");

    await navigator.clipboard.writeText(text);
  }

  function renderResult() {
    if (!result?.diagnosis) {
      return (
        <div className="empty-state">
          <p className="empty-title">Ainda sem diagnostico.</p>
          <p>
            Quando o cliente enviar esse formulario, o app chama a OpenAI,
            estrutura o diagnostico no metodo Lampada e registra o caso no
            Monday.
          </p>
        </div>
      );
    }

    const { diagnosis, persistence, monday } = result;

    return (
      <>
        <article className="result-card">
          <div className="result-topline">
            <span className="pill">{`Maturidade: ${diagnosis.maturity}`}</span>
            <span className="pill pill-alt">{diagnosis.riskSignal}</span>
          </div>
          <h3>{diagnosis.title}</h3>
          <p>{diagnosis.summary}</p>

          <div className="result-block">
            <h4>Diagnostico estrategico</h4>
            <p>{diagnosis.strategicDiagnosis}</p>
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
            <h4>Pontos de atencao</h4>
            <ul>
              {diagnosis.attentionPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-block">
            <h4>Proximo passo recomendado</h4>
            <p>{diagnosis.nextStep}</p>
          </div>
        </article>

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
          <h4>Operacao</h4>
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
              <label>
                Nome da marca ou cliente
                <input
                  name="brand"
                  onChange={updateField}
                  placeholder="Ex.: Chevrolet"
                  value={form.brand}
                />
              </label>
              <label>
                O que está acontecendo agora no negócio?
                <textarea
                  name="businessContext"
                  onChange={updateField}
                  placeholder="Ex.: lançamento importante, pressão de vendas, reposicionamento, cultura interna..."
                  rows={5}
                  value={form.businessContext}
                />
              </label>
              <label>
                Por que esse projeto precisa existir agora?
                <textarea
                  name="urgency"
                  onChange={updateField}
                  placeholder="Ex.: abrir pipeline, fortalecer marca, acelerar decisão..."
                  rows={4}
                  value={form.urgency}
                />
              </label>
            </section>

            <section className={`step-panel ${stepIndex === 1 ? "is-active" : ""}`}>
              <label>
                Qual é o objetivo real do projeto?
                <textarea
                  name="realGoal"
                  onChange={updateField}
                  placeholder="Não descreva o formato. Descreva a mudança real que o projeto precisa provocar."
                  rows={5}
                  value={form.realGoal}
                />
              </label>
              <label>
                Como vocês saberão que deu certo?
                <textarea
                  name="kpis"
                  onChange={updateField}
                  placeholder="Ex.: leads, reuniões, percepção de marca, vendas..."
                  rows={4}
                  value={form.kpis}
                />
              </label>
              <label>
                Que decisão esse projeto precisa destravar?
                <textarea
                  name="decision"
                  onChange={updateField}
                  placeholder="Ex.: compra, adesão, indicação, priorização..."
                  rows={4}
                  value={form.decision}
                />
              </label>
            </section>

            <section className={`step-panel ${stepIndex === 2 ? "is-active" : ""}`}>
              <label>
                Quem é o público principal?
                <textarea
                  name="audience"
                  onChange={updateField}
                  placeholder="Ex.: rede, diretoria, cliente enterprise, influenciadores..."
                  rows={4}
                  value={form.audience}
                />
              </label>
              <label>
                O que esse público pensa ou resiste hoje?
                <textarea
                  name="resistance"
                  onChange={updateField}
                  placeholder="Ex.: ceticismo, baixa confiança, pouca prioridade..."
                  rows={4}
                  value={form.resistance}
                />
              </label>
              <label>
                Que comportamento você quer provocar depois?
                <textarea
                  name="behavior"
                  onChange={updateField}
                  placeholder="Ex.: pedir proposta, comprar, agendar, defender a marca..."
                  rows={4}
                  value={form.behavior}
                />
              </label>
            </section>

            <section className={`step-panel ${stepIndex === 3 ? "is-active" : ""}`}>
              <label>
                Qual é a janela de entrega ou data principal?
                <input
                  name="timeline"
                  onChange={updateField}
                  placeholder="Ex.: setembro/2026, D-90, lançamento em outubro"
                  value={form.timeline}
                />
              </label>
              <label>
                Qual é a faixa de investimento confortável?
                <input
                  name="budget"
                  onChange={updateField}
                  placeholder="Ex.: R$ 600k a R$ 800k"
                  value={form.budget}
                />
              </label>
              <label>
                Quais restrições críticas existem?
                <textarea
                  name="constraints"
                  onChange={updateField}
                  placeholder="Ex.: compliance, prazo, venue, orçamento, aprovações..."
                  rows={4}
                  value={form.constraints}
                />
              </label>
              <label>
                O que não pode dar errado?
                <textarea
                  name="nonNegotiable"
                  onChange={updateField}
                  placeholder="Ex.: reputação, operação, experiência VIP, segurança..."
                  rows={4}
                  value={form.nonNegotiable}
                />
              </label>
            </section>

            <div className="wizard-actions">
              <button
                className="ghost-button"
                disabled={stepIndex === 0 || loading}
                onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
                type="button"
              >
                Voltar
              </button>
              <div className="action-stack">
                {stepIndex < steps.length - 1 ? (
                  <button
                    className="primary-button"
                    disabled={loading}
                    onClick={() =>
                      setStepIndex((current) => Math.min(current + 1, steps.length - 1))
                    }
                    type="button"
                  >
                    Avancar
                  </button>
                ) : (
                  <button className="primary-button" disabled={loading} type="submit">
                    {loading ? "Gerando..." : "Gerar diagnostico-base"}
                  </button>
                )}
              </div>
            </div>
          </form>

          {error ? <div className="status-inline is-error">{error}</div> : null}
          {loading ? <div className="status-inline">Analisando briefing e sincronizando...</div> : null}
        </section>

        <aside className="result-panel">
          <div className="section-head">
            <div>
              <p className="section-kicker">Saida estruturada</p>
              <h2>Diagnostico Lampada</h2>
            </div>
            <button className="ghost-button" onClick={copySummary} type="button">
              Copiar resumo
            </button>
          </div>

          {renderResult()}
        </aside>
      </main>
      )}
    </div>
  );
}
