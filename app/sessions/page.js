import Link from "next/link";

export default function SessionsPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Sessões client-facing</p>
          <h1>Links dedicados sem exposição pública</h1>
          <p className="hero-text">
            As sessões dedicadas da Lampada existem para customizar narrativa,
            branding e critérios por cliente. Elas não ficam listadas
            publicamente: cada link é enviado de forma direcionada pela equipe.
          </p>
          <div className="hero-badges">
            <span>Branding por cliente</span>
            <span>Código opcional</span>
            <span>Histórico centralizado</span>
          </div>
        </div>

        <div className="hero-card">
          <p className="hero-card-label">Uso recomendado</p>
          <ol>
            <li>Lampada configura a sessão</li>
            <li>O cliente recebe um link dedicado</li>
            <li>O briefing entra no pipeline com contexto</li>
            <li>O time lê tudo no admin e no Monday</li>
          </ol>
        </div>
      </section>

      <section className="launcher-grid">
        <Link className="launcher-card" href="/briefing">
          <p className="section-kicker">Entrada pública</p>
          <h3>Testar briefing genérico</h3>
          <div className="launcher-card-body">
            <p>
              Use o fluxo aberto para demonstração, captação inbound ou primeira
              triagem comercial.
            </p>
          </div>
          <span className="launcher-link">Abrir</span>
        </Link>

        <Link className="launcher-card" href="/admin/login">
          <p className="section-kicker">Equipe Lampada</p>
          <h3>Acessar painel interno</h3>
          <div className="launcher-card-body">
            <p>
              Área autenticada para histórico, score, pricing, gates e
              checklist operacional.
            </p>
          </div>
          <span className="launcher-link">Entrar</span>
        </Link>

        <div className="launcher-card">
          <p className="section-kicker">Entrega dedicada</p>
          <h3>Sessão privada por convite</h3>
          <div className="launcher-card-body">
            <p>
              Quando um cliente recebe um link próprio, a experiência aparece
              com narrativa e cores da conta, sem abrir o índice completo.
            </p>
          </div>
          <span className="launcher-link">Envio controlado</span>
        </div>
      </section>
    </main>
  );
}
