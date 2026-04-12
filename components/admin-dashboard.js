"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function formatDate(value) {
  return new Date(value).toLocaleString("pt-BR");
}

function matchesFilter(submission, query, scoreBand, pricingClass) {
  const haystack = [
    submission.diagnosis?.title,
    submission.diagnosis?.summary,
    submission.payload?.sessionName,
    submission.payload?.brand,
    submission.payload?.realGoal
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const queryOk = !query || haystack.includes(query.toLowerCase());
  const scoreOk = !scoreBand || submission.diagnosis?.score?.band === scoreBand;
  const pricingOk =
    !pricingClass || submission.diagnosis?.pricing?.classification === pricingClass;

  return queryOk && scoreOk && pricingOk;
}

function countBy(submissions, getter) {
  return submissions.reduce((acc, item) => {
    const key = getter(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export default function AdminDashboard({ submissions }) {
  const [query, setQuery] = useState("");
  const [scoreBand, setScoreBand] = useState("");
  const [pricingClass, setPricingClass] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const filtered = useMemo(
    () =>
      submissions.filter((submission) =>
        matchesFilter(submission, query, scoreBand, pricingClass)
      ),
    [pricingClass, query, scoreBand, submissions]
  );

  const sorted = useMemo(() => {
    const items = [...filtered];

    items.sort((left, right) => {
      if (sortBy === "newest") {
        return new Date(right.createdAt) - new Date(left.createdAt);
      }

      if (sortBy === "oldest") {
        return new Date(left.createdAt) - new Date(right.createdAt);
      }

      if (sortBy === "score_desc") {
        return (right.diagnosis?.score?.total || 0) - (left.diagnosis?.score?.total || 0);
      }

      if (sortBy === "score_asc") {
        return (left.diagnosis?.score?.total || 0) - (right.diagnosis?.score?.total || 0);
      }

      return (left.diagnosis?.title || "").localeCompare(right.diagnosis?.title || "");
    });

    return items;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [page, sorted]);

  function updateAndReset(updateFn) {
    updateFn();
    setPage(1);
  }

  const scoreCounts = countBy(submissions, (item) => item.diagnosis?.score?.band || "Sem score");
  const pricingCounts = countBy(
    submissions,
    (item) => item.diagnosis?.pricing?.classification || "Sem pricing"
  );

  return (
    <>
      <div className="admin-toolbar">
        <label className="admin-filter">
          Busca
          <input
            onChange={(event) => updateAndReset(() => setQuery(event.target.value))}
            placeholder="Cliente, sessão, objetivo, resumo..."
            value={query}
          />
        </label>

        <label className="admin-filter">
          Score
          <select
            onChange={(event) => updateAndReset(() => setScoreBand(event.target.value))}
            value={scoreBand}
          >
            <option value="">Todos</option>
            <option value="Verde">Verde</option>
            <option value="Amarelo">Amarelo</option>
            <option value="Vermelho">Vermelho</option>
          </select>
        </label>

        <label className="admin-filter">
          Pricing
          <select
            onChange={(event) => updateAndReset(() => setPricingClass(event.target.value))}
            value={pricingClass}
          >
            <option value="">Todos</option>
            <option value="Viavel">Viável</option>
            <option value="Atencao">Atenção</option>
            <option value="Inviavel">Inviável</option>
          </select>
        </label>

        <label className="admin-filter">
          Ordenar
          <select
            onChange={(event) => updateAndReset(() => setSortBy(event.target.value))}
            value={sortBy}
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigas</option>
            <option value="score_desc">Maior score</option>
            <option value="score_asc">Menor score</option>
            <option value="title">Título A-Z</option>
          </select>
        </label>
      </div>

      <div className="admin-stats">
        <div className="sync-card" style={{ marginTop: 0 }}>
          <h4>Score</h4>
          <ul>
            <li>{`Verde: ${scoreCounts.Verde || 0}`}</li>
            <li>{`Amarelo: ${scoreCounts.Amarelo || 0}`}</li>
            <li>{`Vermelho: ${scoreCounts.Vermelho || 0}`}</li>
          </ul>
        </div>

        <div className="sync-card" style={{ marginTop: 0 }}>
          <h4>Pricing</h4>
          <ul>
            <li>{`Viável: ${pricingCounts.Viavel || 0}`}</li>
            <li>{`Atenção: ${pricingCounts.Atencao || 0}`}</li>
            <li>{`Inviável: ${pricingCounts.Inviavel || 0}`}</li>
          </ul>
        </div>
      </div>

      <div className="section-head" style={{ marginTop: 20 }}>
        <div>
          <p className="section-kicker">Resultado filtrado</p>
          <h2>{`${sorted.length} submissões visíveis`}</h2>
        </div>
      </div>

      <div className="admin-list">
        {paginated.map((submission) => (
          <Link
            className="admin-card"
            href={`/admin/submissions/${submission.id}`}
            key={submission.id}
          >
            <div className="admin-card-top">
              <span className="pill">{submission.diagnosis?.maturity || "sem leitura"}</span>
              <span className="pill pill-alt">
                {submission.diagnosis?.score?.band || "Sem score"}
              </span>
            </div>
            <h3>{submission.diagnosis?.title || "Diagnóstico"}</h3>
            <p>{submission.diagnosis?.summary}</p>
            <div className="admin-meta">
              <span>{submission.payload?.sessionName || "Sessão pública"}</span>
              <span>{`Pricing: ${submission.diagnosis?.pricing?.classification || "Sem leitura"}`}</span>
              <span>{formatDate(submission.createdAt)}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="admin-pagination">
        <button
          className="ghost-button"
          disabled={page <= 1}
          onClick={() => setPage((current) => Math.max(current - 1, 1))}
          type="button"
        >
          Anterior
        </button>
        <span>{`Página ${page} de ${totalPages}`}</span>
        <button
          className="ghost-button"
          disabled={page >= totalPages}
          onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
          type="button"
        >
          Próxima
        </button>
      </div>
    </>
  );
}
