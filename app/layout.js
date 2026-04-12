import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Lampada Diagnostico",
  description:
    "Interface client-facing para briefing, diagnostico e qualificação de projetos da Lampada."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="site-nav-wrap">
          <nav className="site-nav">
            <Link href="/">Lampada Platform</Link>
            <div className="site-nav-links">
              <Link href="/briefing">Briefing</Link>
              <Link href="/sessions">Sessões</Link>
              <Link href="/admin/login">Admin</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
