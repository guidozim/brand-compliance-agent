import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Brand Compliance Agent — Auditoria de Diretrizes de Marca Industrial',
  description: 'Auditoria inteligente de peças criativas contra regras de Brand Guide industrial (ANDRITZ, etc.). Checagem de cores HEX, tipografia, logotipo, clear space e tom de voz.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50/70 text-slate-900 antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

