import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request) {
  // Protection des routes admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')
    
    // Si pas de token ou token invalide, rediriger vers login
    if (!authToken || authToken.value !== process.env.SESSION_SECRET) {
      // Sauf si on est déjà sur la page de login
      if (request.nextUrl.pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}