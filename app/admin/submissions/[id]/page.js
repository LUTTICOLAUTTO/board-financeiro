import Link from "next/link";
import { notFound } from "next/navigation";

import AdminLogoutButton from "@/components/admin-logout-button";
import { requireAdminAccess } from "@/lib/admin-auth";
import { getSubmissionById } from "@/lib/persistence";

function Section({ children, title }) {
  return (
    <div className="sync-card" style={{ marginTop: 0 }}>
      <h4>{title}</h4>
      {children}
    </div>
  );
}

export default async function AdminSubmissionDetailPage({ params }) {
  requireAdminAccess();

  const { id } = await params;
  const submission = await getSubmissionById(id);

  if (!submission) {
    notFound();
  }

  const diagnosis = submission.diagnosis;

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{submission.payload?.sessionName || "Sessão pública"}</p>
          <h1>{diagnosis.title}</h1>
          <p className="hero-text">{diagnosis.summary}</p>
          <div className="hero-badges">
            <span>{`Score ${diagnosis.score.total}`}</span>
            <span>{diagnosis.score.band}</span>
            <span>{diagnosis.pricing.classification}</span>
          </div>
        </div>
        <div className="hero-card">
          <p className="hero-card-label">Navegação</p>
          <ol>
            <li>
              <Link href="/admin">Voltar ao painel</Link>
            </li>
            <li>
              <Link href={`/c/${submission.payload?.sessionToken || "public"}/obrigado?id=${submission.id}`}>
                Abrir página final
              </Link>
            </li>
          </ol>
          <div style={{ marginTop: 18 }}>
            <AdminLogoutButton />
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="wizard-panel">
          <div className="section-head">
            <div>
              <p className="section-kicker">Diagnóstico</p>
              <h2>Leitura estratégica</h2>
            </div>
          </div>

          <div className="admin-grid">
            <Section title="Diagnóstico estratégico">
              <p>{diagnosis.strategicDiagnosis}</p>
            </Section>

            <Section title="Briefing reorganizado">
              <div className="detail-grid">
                <div className="detail-card">
                  <strong>Contexto</strong>
                  <p>{diagnosis.reorganizedBrief?.context}</p>
                </div>
                <div className="detail-card">
                  <strong>Objetivo real</strong>
                  <p>{diagnosis.reorganizedBrief?.realObjective}</p>
                </div>
                <div className="detail-card">
                  <strong>KPIs</strong>
                  <p>{diagnosis.reorganizedBrief?.successIndicators}</p>
                </div>
                <div className="detail-card">
                  <strong>Público e comportamento</strong>
                  <p>{diagnosis.reorganizedBrief?.audienceAndBehavior}</p>
                </div>
                <div className="detail-card">
                  <strong>Restrições</strong>
                  <p>{diagnosis.reorganizedBrief?.restrictions}</p>
                </div>
                <div className="detail-card">
                  <strong>Governança</strong>
                  <p>{diagnosis.reorganizedBrief?.governance}</p>
                </div>
              </div>
            </Section>

            <Section title="Perguntas bloqueadoras">
              <ul>
                {diagnosis.blockingQuestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>

            <Section title="Perguntas de refinamento">
              <ul>
                {diagnosis.refinementQuestions?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>

            <Section title="Pontos de atenção">
              <ul>
                {diagnosis.attentionPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>

            <Section title="Premissas assumidas">
              <ul>
                {diagnosis.assumptions?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>

            <Section title="Próximo passo">
              <p>{diagnosis.nextStep}</p>
            </Section>
          </div>
        </div>

        <aside className="result-panel">
          <div className="admin-grid">
            <Section title="Score">
              <p>{`${diagnosis.score.total} pontos — ${diagnosis.score.band}`}</p>
              <ul>
                {diagnosis.score.dimensions.map((item) => (
                  <li key={item.name}>
                    <strong>{`${item.name}: ${item.score}/10`}</strong>
                    {` — ${item.rationale}`}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Pricing">
              <ul>
                <li>{`Faixa recomendada: ${diagnosis.pricing.recommendedRange}`}</li>
                <li>{`Faixa mínima: ${diagnosis.pricing.minimumRange}`}</li>
                <li>{`Margem estimada: ${diagnosis.pricing.margin}`}</li>
                <li>{`Classificação: ${diagnosis.pricing.classification}`}</li>
                <li>{`Classificação do briefing: ${diagnosis.briefingClassification}`}</li>
              </ul>
            </Section>

            <Section title="Gates">
              <ul>
                {diagnosis.gateStatus?.map((item) => (
                  <li key={item.name}>
                    <strong>{`${item.name}: ${item.status}`}</strong>
                    {` — ${item.rationale}`}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Riscos financeiros">
              <ul>
                {diagnosis.pricing.financialRisks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>

            <Section title="Checklist operacional">
              <ul>
                {diagnosis.checklistSummary?.map((item) => (
                  <li key={item.area}>
                    <strong>{`${item.area}: ${item.status}`}</strong>
                    {` — ${item.summary}`}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Devolutiva cliente-facing">
              <p>{diagnosis.clientReport.executiveSummary}</p>
              <ul>
                {diagnosis.clientReport.nextSteps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>
          </div>
        </aside>
      </section>
    </main>
  );
}
