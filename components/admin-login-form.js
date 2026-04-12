"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Nao foi possivel autenticar.");
      }

      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="wizard" onSubmit={handleSubmit}>
      <section className="step-panel is-active">
        <label>
          Email
          <input
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@lampada.ag"
            type="email"
            value={email}
          />
        </label>
        <label>
          Senha
          <input
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Sua senha de acesso"
            type="password"
            value={password}
          />
        </label>
      </section>

      <div className="wizard-actions">
        <div className="action-stack">
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Entrando..." : "Entrar no painel"}
          </button>
        </div>
      </div>

      {error ? <div className="status-inline is-error">{error}</div> : null}
    </form>
  );
}
