'use client'

import { SessionProvider } from 'next-auth/react'
import { ClientNav } from '@/components/client/client-nav'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-beige-50">
        <ClientNav />
        <main>{children}</main>
      </div>
    </SessionProvider>
  )
}
