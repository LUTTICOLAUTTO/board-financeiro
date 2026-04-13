import AdminLoginForm from "@/components/admin-login-form";
import { hasAdminAccess } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  if (await hasAdminAccess()) {
    redirect("/admin");
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Lampada Admin</p>
          <h1>Painel interno</h1>
          <p className="hero-text">
            Acesso interno da equipe Lampada para visualizar histórico, score,
            pricing e diagnósticos gerados pelo app client-facing.
          </p>
        </div>
        <div className="hero-card">
          <p className="hero-card-label">Escopo do painel</p>
          <ol>
            <li>Listar submissões</li>
            <li>Abrir diagnósticos completos</li>
            <li>Consultar score e pricing</li>
            <li>Operar o próximo passo com clareza</li>
          </ol>
        </div>
      </section>

      <section className="workspace">
        <div className="wizard-panel">
          <div className="section-head">
            <div>
              <p className="section-kicker">Autenticação interna</p>
              <h2>Entrar</h2>
            </div>
          </div>
          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
