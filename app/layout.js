import "./globals.css";

export const metadata = {
  title: "Lampada Diagnostico",
  description:
    "Interface client-facing para briefing, diagnostico e qualificação de projetos da Lampada."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
