import Link from "next/link";

import AdminDashboard from "@/components/admin-dashboard";
import AdminLogoutButton from "@/components/admin-logout-button";
import { requireAdminAccess } from "@/lib/admin-auth";
import { getAllSubmissions } from "@/lib/persistence";

export default async function AdminDashboardPage() {
  await requireAdminAccess();

  const submissions = await getAllSubmissions();

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Lampada Admin</p>
          <h1>Painel de submissões</h1>
          <p className="hero-text">
            Visão interna para acompanhar os diagnósticos gerados pelo app, sem
            depender do Monday para leitura inicial.
          </p>
        </div>
        <div className="hero-card">
          <p className="hero-card-label">Ações rápidas</p>
          <ol>
            <li>Abrir score e pricing do caso</li>
            <li>Ler devolutiva cliente-facing</li>
            <li>Conferir a sessão/origem</li>
            <li>Despachar o próximo passo</li>
          </ol>
          <div style={{ marginTop: 18 }}>
            <AdminLogoutButton />
          </div>
        </div>
      </section>

      <section className="wizard-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">Histórico</p>
            <h2>{`${submissions.length} submissões`}</h2>
          </div>
        </div>

        <AdminDashboard submissions={submissions} />
      </section>
    </main>
  );
}
