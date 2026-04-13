import { getSubmissionById } from "@/lib/persistence";
import { getPublicClientSession } from "@/lib/client-sessions";
import { notFound } from "next/navigation";

function ThankYouView({ session, diagnosis }) {
  return (
    <main
      className="page-shell"
      style={{
        "--teal": session.branding?.primary,
        "--amber": session.branding?.accent
      }}
    >
      <section className="hero-copy">
        <p className="eyebrow">{session.eyebrow}</p>
        <h1 style={{ maxWidth: "13ch" }}>{session.thankYouTitle}</h1>
        <p className="hero-text">{session.thankYouText}</p>
      </section>

      <section className="workspace" style={{ marginTop: 24 }}>
        <div className="wizard-panel">
          <div className="section-head">
            <div>
              <p className="section-kicker">Leitura executiva</p>
              <h2>{diagnosis?.clientReport?.recommendation || "Diagnóstico recebido"}</h2>
            </div>
          </div>

          <article className="result-card" style={{ marginTop: 0 }}>
            <div className="result-topline">
              <span className="pill">{`Score: ${diagnosis?.score?.total || 0}`}</span>
              <span className="pill pill-alt">
                {diagnosis?.pricing?.classification || "Em análise"}
              </span>
            </div>
            <h3>{diagnosis?.title || "Resumo do projeto"}</h3>
            <p>{diagnosis?.clientReport?.executiveSummary || diagnosis?.summary}</p>

            <div className="result-block">
              <h4>Oportunidades</h4>
              <ul>
                {(diagnosis?.clientReport?.opportunities || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="result-block">
              <h4>Próximos passos</h4>
              <ul>
                {(diagnosis?.clientReport?.nextSteps || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        <aside className="result-panel">
          <div className="sync-card" style={{ marginTop: 0 }}>
            <h4>Faixa de investimento</h4>
            <p>{diagnosis?.pricing?.recommendedRange || "A definir com a equipe"}</p>
            <h4 style={{ marginTop: 22 }}>Narrativa de enquadramento</h4>
            <p>{diagnosis?.clientReport?.investmentNarrative || diagnosis?.nextStep}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default async function ThankYouPage({ params, searchParams }) {
  const { token } = await params;
  const resolvedSearchParams = await searchParams;
  const session = getPublicClientSession(token);
  const submissionId = resolvedSearchParams?.id;
  const record = submissionId ? await getSubmissionById(submissionId) : null;

  if (!session) {
    notFound();
  }

  return <ThankYouView diagnosis={record?.diagnosis} session={session} />;
}
