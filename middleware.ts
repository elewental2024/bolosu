import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public paths
  const isPublicPath = path === '/login' || path === '/register'

  // Auth paths (requires auth)
  const isAuthPath = path.startsWith('/produtos') || 
                     path.startsWith('/pedidos') || 
                     path.startsWith('/chat') ||
                     path.startsWith('/admin')

  const token = request.cookies.get('next-auth.session-token') || 
                request.cookies.get('__Secure-next-auth.session-token')

  if (isAuthPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/produtos', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/produtos/:path*',
    '/pedidos/:path*',
    '/chat/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
}
