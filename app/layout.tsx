import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bolos Su - E-commerce de Bolos",
  description: "Sistema de vendas de bolos online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
