import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { password } = await request.json()
    
    // Vérifier le mot de passe
    if (password === process.env.ADMIN_PASSWORD) {
      // Créer le cookie de session
      const cookieStore = await cookies()
      cookieStore.set('auth-token', process.env.SESSION_SECRET, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: '/'
      })
      
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}