import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bolos Su - Bolos Artesanais',
  description: 'Os melhores bolos artesanais da região',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">{children}</body>
    </html>
  )
}
