'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SessionProvider, useSession } from 'next-auth/react'
import { AdminNav } from '@/components/admin/admin-nav'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/produtos')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (session?.user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-beige-50">
      <AdminNav />
      <main>{children}</main>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  )
}
