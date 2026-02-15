'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ClientNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { href: '/produtos', label: 'Produtos' },
    { href: '/pedidos', label: 'Meus Pedidos' },
    { href: '/chat', label: 'Chat' },
  ]

  // Add admin link if user is admin
  if (session?.user?.role === 'admin') {
    navItems.push({ href: '/admin/dashboard', label: 'Admin' })
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/produtos" className="text-2xl font-bold text-primary-600">
                Bolos Su
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-colors',
                    pathname === item.href || pathname?.startsWith(item.href)
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {session?.user && (
              <>
                <span className="text-sm text-gray-700 hidden sm:block">
                  Olá, {session.user.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  Sair
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
