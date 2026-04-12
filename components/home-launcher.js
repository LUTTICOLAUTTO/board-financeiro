import Link from "next/link";

function Card({ children, href, title, subtitle }) {
  return (
    <Link className="launcher-card" href={href}>
      <p className="section-kicker">{subtitle}</p>
      <h3>{title}</h3>
      <div className="launcher-card-body">{children}</div>
      <span className="launcher-link">Abrir</span>
    </Link>
  );
}

export default function HomeLauncher({ sessions }) {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Lampada Platform</p>
          <h1>Interface de briefing, diagnóstico e decisão</h1>
          <p className="hero-text">
            Uma entrada clara para o ecossistema Lampada: experiência
            client-facing, sessões dedicadas, painel admin e operação interna em
            um fluxo mais intuitivo e clicável.
          </p>
          <div className="hero-badges">
            <span>Client-facing</span>
            <span>Admin interno</span>
            <span>Monday sync</span>
          </div>
        </div>

        <div className="hero-card">
          <p className="hero-card-label">Rotas principais</p>
          <ol>
            <li>Briefing genérico</li>
            <li>Sessões por cliente</li>
            <li>Painel interno</li>
            <li>Diagnóstico e pricing</li>
          </ol>
        </div>
      </section>

      <section className="launcher-grid">
        <Card href="/briefing" subtitle="Entrada geral" title="Briefing genérico">
          <p>
            Fluxo padrão para captar um caso novo sem depender de uma sessão já
            configurada.
          </p>
        </Card>

        <Card href="/sessions" subtitle="Links dedicados" title="Sessões client-facing">
          <p>{`${sessions.length} sessões configuradas para clientes específicos.`}</p>
        </Card>

        <Card href="/admin/login" subtitle="Equipe Lampada" title="Painel interno">
          <p>Área autenticada para histórico, score, pricing e leitura executiva.</p>
        </Card>
      </section>

      {sessions.length > 0 ? (
        <section className="wizard-panel" style={{ marginTop: 24 }}>
          <div className="section-head">
            <div>
              <p className="section-kicker">Acesso rápido</p>
              <h2>Sessões ativas</h2>
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
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
