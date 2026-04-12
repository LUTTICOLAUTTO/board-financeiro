export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="wizard-panel">
        <p className="section-kicker">Link não encontrado</p>
        <h1 style={{ maxWidth: "none", fontSize: "3rem" }}>Sessão inválida</h1>
        <p className="hero-text">
          Esse link de briefing não existe ou já não está ativo. Se precisar,
          peça um novo link para a equipe da Lampada.
        </p>
      </section>
    </main>
  );
}
