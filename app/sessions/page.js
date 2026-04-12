import Link from "next/link";

import { getAllClientSessions } from "@/lib/client-sessions";

export default function SessionsPage() {
  const sessions = getAllClientSessions();

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Sessões client-facing</p>
          <h1>Links prontos para cliente</h1>
          <p className="hero-text">
            Cada sessão abaixo pode ter narrativa, branding e código de acesso
            próprios.
          </p>
        </div>

        <div className="hero-card">
          <p className="hero-card-label">Uso recomendado</p>
          <ol>
            <li>Configurar sessão</li>
            <li>Enviar link ao cliente</li>
            <li>Receber briefing estruturado</li>
            <li>Ler no admin ou no Monday</li>
          </ol>
        </div>
      </section>

      <section className="wizard-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">Lista</p>
            <h2>{`${sessions.length} sessões configuradas`}</h2>
          </div>
        </div>

        <div className="session-grid">
          {sessions.map((session) => (
            <Link className="session-card" href={`/c/${session.token}`} key={session.token}>
              <span
                className="session-dot"
                style={{ background: session.branding?.primary }}
              />
              <div>
                <h3>{session.name}</h3>
                <p>{session.title}</p>
                <small>{`/c/${session.token}`}</small>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
