import Link from "next/link";

function ActionCard({ children, cta = "Abrir", href, title, subtitle }) {
  return (
    <Link className="launcher-card" href={href}>
      <p className="section-kicker">{subtitle}</p>
      <h3>{title}</h3>
      <div className="launcher-card-body">{children}</div>
      <span className="launcher-link">{cta}</span>
    </Link>
  );
}

function ValueCard({ text, title }) {
  return (
    <div className="detail-card">
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

export default function HomeLauncher() {
  return (
    <main className="page-shell landing-shell">
      <section className="hero landing-hero">
        <div className="hero-copy landing-copy">
          <p className="eyebrow">Lampada Briefing Platform</p>
          <h1>Briefing ruim deixa de virar proposta bonita e inviável.</h1>
          <p className="hero-text">
            Um webapp público, intuitivo e consultivo para captar briefings com
            mais clareza, rodar diagnóstico estratégico, gerar score, pricing e
            organizar a decisão com menos ruído.
          </p>

          <div className="hero-badges">
            <span>Briefing client-facing</span>
            <span>Score e pricing</span>
            <span>Admin e Monday</span>
          </div>

          <div className="landing-cta-row">
            <Link className="primary-button" href="/briefing">
              Iniciar briefing
            </Link>
            <Link className="ghost-button" href="/site.html">
              Ver site HTML
            </Link>
            <Link className="ghost-button" href="/sessions">
              Como funcionam as sessões privadas
            </Link>
          </div>
        </div>

        <div className="hero-card landing-proof-card">
          <p className="hero-card-label">O que o sistema entrega</p>
          <ol>
            <li>Briefing reorganizado em blocos executivos</li>
            <li>Perguntas bloqueadoras e premissas</li>
            <li>Gates de decisão e checklist operacional</li>
            <li>Score, pricing e devolutiva client-facing</li>
          </ol>

          <div className="landing-proof-grid">
            <div>
              <strong>Antes</strong>
              <p>Pedido solto, escopo elástico e verba no escuro.</p>
            </div>
            <div>
              <strong>Depois</strong>
              <p>Critério, leitura de risco e próximo passo claro.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wizard-panel landing-section">
        <div className="section-head">
          <div>
            <p className="section-kicker">Como funciona</p>
            <h2>Uma jornada simples para o cliente e útil para a equipe</h2>
            <p className="section-subtext">
              A interface pública foi desenhada para parecer consultoria, não
              formulário. O cliente entende o que está preenchendo e a Lampada
              recebe um caso mais maduro para decidir.
            </p>
          </div>
        </div>

        <div className="detail-grid">
          <ValueCard
            title="1. Entrada guiada"
            text="O cliente responde em quatro blocos: base comercial, escopo, operação e experiência."
          />
          <ValueCard
            title="2. Leitura estrutural"
            text="O app sinaliza cobertura dos dados bloqueadores e mostra se o caso ainda está travado."
          />
          <ValueCard
            title="3. Diagnóstico Lampada"
            text="A IA devolve briefing reorganizado, perguntas bloqueadoras, riscos, premissas, score e pricing."
          />
          <ValueCard
            title="4. Decisão operacional"
            text="O caso entra no admin e no Monday com rastreabilidade, pronto para qualificação e proposta."
          />
        </div>
      </section>

      <section className="launcher-grid landing-grid">
        <ActionCard
          href="/site.html"
          subtitle="Landing estática"
          title="Abrir site HTML público"
          cta="Ver site"
        >
          <p>
            Uma camada estática, clicável e compartilhável para apresentar a
            plataforma fora do fluxo principal do app.
          </p>
        </ActionCard>

        <ActionCard
          href="/briefing"
          subtitle="Entrada pública"
          title="Testar o fluxo de briefing"
          cta="Abrir briefing"
        >
          <p>
            Ideal para landing pública, inbound, primeira triagem comercial e
            demonstração do produto.
          </p>
        </ActionCard>

        <ActionCard
          href="/admin/login"
          subtitle="Equipe Lampada"
          title="Entrar no painel interno"
          cta="Abrir admin"
        >
          <p>
            Acompanhe score, pricing, gates, histórico e devolutiva executiva
            em uma área autenticada.
          </p>
        </ActionCard>

        <ActionCard
          href="/sessions"
          subtitle="Sessões privadas"
          title="Entender os links por cliente"
          cta="Ver modelo"
        >
          <p>
            Cada cliente pode receber narrativa, branding e código de acesso
            próprios, sem exposição pública da operação.
          </p>
        </ActionCard>
      </section>

      <section className="wizard-panel landing-section">
        <div className="section-head">
          <div>
            <p className="section-kicker">Para quem serve</p>
            <h2>Projetos que pedem clareza antes de criatividade</h2>
          </div>
        </div>

        <div className="detail-grid">
          <ValueCard
            title="Lançamentos e convenções"
            text="Quando a tese de negócio precisa ficar clara antes de abrir formato, conteúdo e produção."
          />
          <ValueCard
            title="Eventos médicos e contas sensíveis"
            text="Quando compliance, governança e risco político mudam o jogo desde o briefing."
          />
          <ValueCard
            title="Viagens de incentivo premium"
            text="Quando hospitalidade, narrativa e operação têm tolerância baixa a erro e alto risco financeiro."
          />
          <ValueCard
            title="Concorrências complexas"
            text="Quando escopo, entregáveis e critério de decisão ainda estão confusos e precisam ser reorganizados."
          />
        </div>
      </section>

      <section className="wizard-panel landing-section">
        <div className="section-head">
          <div>
            <p className="section-kicker">Publicação segura</p>
            <h2>O que fica público e o que continua privado</h2>
          </div>
        </div>

        <div className="session-grid">
          <div className="session-card">
            <span className="session-dot" style={{ background: "#0d6d63" }} />
            <div>
              <h3>Camada pública</h3>
              <p>
                Home, briefing genérico e páginas institucionais podem ir para
                produção como vitrine comercial da plataforma.
              </p>
            </div>
          </div>

          <div className="session-card">
            <span className="session-dot" style={{ background: "#b9701e" }} />
            <div>
              <h3>Camada privada</h3>
              <p>
                Sessões dedicadas continuam acessadas por link direto e, quando
                necessário, com código de acesso por cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-card landing-final-cta">
        <p className="hero-card-label">Próximo passo</p>
        <h2>Publicar a plataforma e começar a rodar briefings reais.</h2>
        <p className="hero-text">
          O app já está estruturado para produção com OpenAI, admin interno,
          persistência em banco e sincronização com o Monday. O próximo passo é
          conectar as envs, validar o domínio e subir na Vercel.
        </p>
        <div className="landing-cta-row">
          <Link className="primary-button" href="/briefing">
            Ver a experiência pública
          </Link>
          <Link className="ghost-button" href="/admin/login">
            Ir para o admin
          </Link>
        </div>
      </section>
    </main>
  );
}
